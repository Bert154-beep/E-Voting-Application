#include "e_voting.h"
#include <sstream>
#include <iomanip>
#include<optional>

bool CNICList::exists(const string& cnic) {
    CNICNode* temp = head;
    while (temp) {
        if (temp->cnic == cnic)
            return true;
        temp = temp->next;
    }
    return false;
}

void CNICList::insert(const string& cnic) {
    CNICNode* newNode = new CNICNode(cnic);
    newNode->next = head;
    head = newNode;
}

void CNICList::loadFromDB(SQLHDBC hDbc) {
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR*)"SELECT cnic FROM users", SQL_NTS);

    SQLCHAR cnic[20];
    while (SQLFetch(stmt) == SQL_SUCCESS) {
        SQLGetData(stmt, 1, SQL_C_CHAR, cnic, sizeof(cnic), NULL);
        insert((char*)cnic);
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
}

void CNICList::printCNICs() {
    CNICNode* temp = head;
    cout << "=== CNIC Linked List ===\n";
    while (temp) {
        cout << "-> " << temp->cnic << "\n";
        temp = temp->next;
    }
}



Database::Database() : hEnv(SQL_NULL_HENV), hDbc(SQL_NULL_HDBC), connected(false) {}

Database::~Database() {
    close();
}

bool Database::connect() {
    SQLRETURN ret;
    SQLAllocHandle(SQL_HANDLE_ENV, SQL_NULL_HANDLE, &hEnv);
    SQLSetEnvAttr(hEnv, SQL_ATTR_ODBC_VERSION, (void*)SQL_OV_ODBC3, 0);
    SQLAllocHandle(SQL_HANDLE_DBC, hEnv, &hDbc);

    ret = SQLDriverConnect(hDbc, NULL,
        (SQLCHAR*)"DRIVER={MySQL ODBC 9.5 ANSI Driver};SERVER=localhost;PORT=3306;DATABASE=evoting_db;USER=root;PASSWORD=masab123;OPTION=3;",
        SQL_NTS, NULL, 0, NULL, SQL_DRIVER_COMPLETE);

    if (SQL_SUCCEEDED(ret)) {
        connected = true;
        cout << "Connected to MySQL via ODBC.\n";
        loadUsersToCache();
        cnicList.loadFromDB(hDbc);
        loadVotesToHeap();
        return true;
    } else {
        cerr << "ODBC connection failed.\n";
        return false;
    }
}

void Database::close() {
    if (connected) {
        SQLDisconnect(hDbc);
        SQLFreeHandle(SQL_HANDLE_DBC, hDbc);
        SQLFreeHandle(SQL_HANDLE_ENV, hEnv);
        connected = false;
        cout << "Connection closed.\n";
    }
}

void Database::loadUsersToCache() {
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR*)"SELECT username, password FROM users", SQL_NTS);

    SQLCHAR user[50], pass[50];
    while (SQLFetch(stmt) == SQL_SUCCESS) {
        SQLGetData(stmt, 1, SQL_C_CHAR, user, sizeof(user), NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, pass, sizeof(pass), NULL);
        userCache[(char*)user] = (char*)pass;
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
}

void Database::loadVotesToHeap() {
    while (!resultsHeap.empty()) resultsHeap.pop();

    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR*)"SELECT name, votes FROM candidates", SQL_NTS);

    SQLCHAR name[100];
    SQLINTEGER votes;
    while (SQLFetch(stmt) == SQL_SUCCESS) {
        SQLGetData(stmt, 1, SQL_C_CHAR, name, sizeof(name), NULL);
        SQLGetData(stmt, 2, SQL_C_SLONG, &votes, 0, NULL);
        resultsHeap.push({votes, (char*)name});
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
}
bool Database::createUser(const string& fullname, const string& father_name,
                          const string& mother_name, const string& dob,
                          const string& cnic, const string& password,
                          const string& email, const string& phone_no,
                          const string& role) {
    if (cnicList.exists(cnic)) {
        cerr << " Duplicate CNIC detected! Registration blocked.\n";
        return false;
    }

    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);

     string query =
        "INSERT INTO users (fullname, father_name, mother_name, date_of_birth, "
        "cnic_number, password, email_address, phone_no, role) VALUES ('" +
        fullname + "','" + father_name + "','" + mother_name + "','" + dob + "','" +
        cnic + "','" + password + "','" + email + "','" + phone_no + "','" + role + "')";


    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR*)query.c_str(), SQL_NTS);

    if (SQL_SUCCEEDED(ret)) {
        cnicList.insert(cnic);
        userCache[email] = password;
        auditQueue.push("User " + fullname + " registered.");
        cout << "User registered successfully.\n";
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return true;
    } else {
        SQLCHAR sqlState[6], message[256];
        SQLINTEGER nativeError;
        SQLSMALLINT textLength;

        SQLGetDiagRec(SQL_HANDLE_STMT, stmt, 1, sqlState, &nativeError, message, sizeof(message), &textLength);

        cerr << "Registration failed.\n";
        cerr << "SQL State: " << sqlState << endl;
        cerr << "Error Message: " << message << endl;
        cerr << "Native Error: " << nativeError << endl;

        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return false;
    }
}


#include <optional>

std::optional<User> Database::verifyUser(const string& email, const string& password) {
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);

   string query = "SELECT fullname, father_name, mother_name, date_of_birth, "
                   "cnic_number, email_address, phone_no, role "
                   "FROM users WHERE email_address='" + email +
                   "' AND password='" + password + "'";

    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR*)query.c_str(), SQL_NTS);

    if (!SQL_SUCCEEDED(ret)) {
        cerr << "Query failed during login.\n";
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return nullopt;
    }

    SQLCHAR fullname[100], father[100], mother[100], dob[20], cnic[20], email_addr[100], phone[20], role[20];
    if (SQLFetch(stmt) == SQL_SUCCESS) {
        SQLGetData(stmt, 1, SQL_C_CHAR, fullname, sizeof(fullname), NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, father, sizeof(father), NULL);
        SQLGetData(stmt, 3, SQL_C_CHAR, mother, sizeof(mother), NULL);
        SQLGetData(stmt, 4, SQL_C_CHAR, dob, sizeof(dob), NULL);
        SQLGetData(stmt, 5, SQL_C_CHAR, cnic, sizeof(cnic), NULL);
        SQLGetData(stmt, 6, SQL_C_CHAR, email_addr, sizeof(email_addr), NULL);
        SQLGetData(stmt, 7, SQL_C_CHAR, phone, sizeof(phone), NULL);
        SQLGetData(stmt, 8, SQL_C_CHAR, role, sizeof(role), NULL);


        User user{
            (char*)fullname,
            (char*)father,
            (char*)mother,
            (char*)dob,
            (char*)cnic,
            (char*)email_addr,
            (char*)phone,
            (char*)role
        };

        auditQueue.push("User " + email + " logged in.");
        cout << "Login successful for: " << email << endl;

        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return user;
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    cout << "Invalid credentials.\n";
    return nullopt;
}


bool Database::castVote(const string& username, const string& candidateId) {
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q = "SELECT id FROM users WHERE username='" + username + "'";
    SQLExecDirect(stmt, (SQLCHAR*)q.c_str(), SQL_NTS);

    SQLINTEGER voterId;
    if (SQLFetch(stmt) != SQL_SUCCESS) {
        cerr << "User not found.\n";
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return false;
    }
    SQLGetData(stmt, 1, SQL_C_SLONG, &voterId, 0, NULL);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);

    if (votedUsers.count(voterId)) {
        cerr << "Duplicate vote attempt blocked.\n";
        return false;
    }

    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string insertVote = "INSERT INTO votes (voter_id, candidate_id) VALUES (" + to_string(voterId) + "," + candidateId + ")";
    SQLExecDirect(stmt, (SQLCHAR*)insertVote.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);

    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string updateVote = "UPDATE candidates SET votes=votes+1 WHERE id=" + candidateId;
    SQLExecDirect(stmt, (SQLCHAR*)updateVote.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);

    votedUsers.insert(voterId);
    loadVotesToHeap();
    cout << "Vote successfully cast.\n";
    return true;
}

string Database::getResults() {
    ostringstream out;
    out << "\n===========================Live Voting Results\n=============================\n";

    priority_queue<pair<int, string>> temp = resultsHeap;
    while (!temp.empty()) {
        auto [votes, name] = temp.top();
        temp.pop();
        out << left << setw(20) << name << " | Votes: " << votes << "\n";
    }
    return out.str();
}
