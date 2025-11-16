#include "e_voting.h"
#include <sstream>
#include <iomanip>
#include <optional>
using namespace std;

void PartyList::insert(int id, const string &name, const string &color, int members, int seats)
{
    Party *newNode = new Party(id, name, color, members, seats);
    if (!head)
    {
        head = newNode;
        return;
    }
    Party *temp = head;
    while (temp->next)
        temp = temp->next;
    temp->next = newNode;
}

VotedUserList::Node::Node(int v, int e, int c)
    : voterId(v), electionId(e), candidateId(c), next(nullptr) {}

VotedUserList::VotedUserList() : head(nullptr) {}

VotedUserList::~VotedUserList()
{
    while (head)
    {
        Node *t = head;
        head = head->next;
        delete t;
    }
}

bool VotedUserList::existsInElection(int voterId, int electionId)
{
    Node *temp = head;
    while (temp)
    {
        if (temp->voterId == voterId && temp->electionId == electionId)
            return true;
        temp = temp->next;
    }
    return false;
}

bool VotedUserList::existsForCandidate(int voterId, int candidateId)
{
    Node *temp = head;
    while (temp)
    {
        if (temp->voterId == voterId && temp->candidateId == candidateId)
            return true;
        temp = temp->next;
    }
    return false;
}

void VotedUserList::insert(int voterId, int electionId, int candidateId)
{
    Node *newNode = new Node(voterId, electionId, candidateId);
    newNode->next = head;
    head = newNode;
}

void StringQueue::push(const string &s)
{
    Node *n = new Node(s);
    if (!rear)
    {
        front = rear = n;
        return;
    }
    rear->next = n;
    rear = n;
};

bool StringQueue::empty() const
{
    return front == nullptr;
};

string StringQueue::pop()
{
    if (empty())
        return "";
    Node *temp = front;
    string val = temp->data;
    front = front->next;
    if (!front)
        rear = nullptr;
    delete temp;
    return val;
};

void UserCacheList::insert(const string &e, const string &p)
{
    Node *newNode = new Node(e, p);
    newNode->next = head;
    head = newNode;
};

bool UserCacheList::verify(const string &e, const string &p)
{
    Node *current = head;
    while (current)
    {
        if (current->email == e && current->password == p)
            return true;
        current = current->next;
    }
    return false;
};

CNICList::CNICList() : head(nullptr) {}

CNICList::~CNICList()
{
    while (head)
    {
        CNICNode *temp = head;
        head = head->next;
        delete temp;
    }
}

bool CNICList::exists(const string &cnic)
{
    CNICNode *temp = head;
    while (temp)
    {
        if (temp->cnic == cnic)
            return true;
        temp = temp->next;
    }
    return false;
};

void CNICList::insert(const string &cnic)
{
    CNICNode *newNode = new CNICNode(cnic);
    newNode->next = head;
    head = newNode;
};

void CNICList::loadFromDB(SQLHDBC hDbc)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR *)"SELECT cnic_number FROM users", SQL_NTS);

    SQLCHAR cnic[20];
    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_CHAR, cnic, sizeof(cnic), NULL);
        insert((char *)cnic);
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
};

Database::Database() : hEnv(SQL_NULL_HENV), hDbc(SQL_NULL_HDBC), connected(false) {}

Database::~Database()
{
    close();
}

bool Database::connect()
{
    SQLRETURN ret;
    SQLAllocHandle(SQL_HANDLE_ENV, SQL_NULL_HANDLE, &hEnv);
    SQLSetEnvAttr(hEnv, SQL_ATTR_ODBC_VERSION, (void *)SQL_OV_ODBC3, 0);
    SQLAllocHandle(SQL_HANDLE_DBC, hEnv, &hDbc);

    ret = SQLDriverConnect(hDbc, NULL,
                           (SQLCHAR *)"DRIVER={MySQL ODBC 9.5 ANSI Driver};SERVER=localhost;PORT=3306;DATABASE=evoting_db;USER=root;PASSWORD=masab123;OPTION=3;",
                           SQL_NTS, NULL, 0, NULL, SQL_DRIVER_COMPLETE);

    if (SQL_SUCCEEDED(ret))
    {
        connected = true;
        cout << "Connected to MySQL via ODBC.\n";
        loadUsersToCache();
        cnicList.loadFromDB(hDbc);
        loadVotesToHeap();
        return true;
    }
    else
    {
        cerr << "ODBC connection failed.\n";
        return false;
    }
}

void Database::close()
{
    if (connected)
    {
        SQLDisconnect(hDbc);
        SQLFreeHandle(SQL_HANDLE_DBC, hDbc);
        SQLFreeHandle(SQL_HANDLE_ENV, hEnv);
        connected = false;
        cout << "Connection closed.\n";
    }
}

void Database::loadUsersToCache()
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR *)"SELECT email_address, password FROM users", SQL_NTS);

    SQLCHAR email[100], pass[100];
    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_CHAR, email, sizeof(email), NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, pass, sizeof(pass), NULL);
        userCache.insert((char *)email, (char *)pass);
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
}

void Database::loadVotesToHeap()
{
    resultsHeap.clear();
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string query = "SELECT id, name, votes FROM candidates";
    SQLExecDirect(stmt, (SQLCHAR *)query.c_str(), SQL_NTS);
    SQLINTEGER id, votes;
    SQLCHAR name[100];
    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &id, 0, NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, name, sizeof(name), NULL);
        SQLGetData(stmt, 3, SQL_C_SLONG, &votes, 0, NULL);
        resultsHeap.push({(int)id, string((char *)name), (int)votes});
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
}

bool Database::createUser(const string &fullname, const string &father_name,
                          const string &mother_name, const string &dob,
                          const string &cnic, const string &password,
                          const string &email, const string &phone_no,
                          const string &role)
{
    if (cnicList.exists(cnic))
    {
        cerr << "Duplicate CNIC detected! Registration blocked.\n";
        return false;
    }

    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);

    string query =
        "INSERT INTO users (fullname, father_name, mother_name, date_of_birth, "
        "cnic_number, password, email_address, phone_no, role) VALUES ('" +
        fullname + "','" + father_name + "','" + mother_name + "','" + dob + "','" +
        cnic + "','" + password + "','" + email + "','" + phone_no + "','" + role + "')";

    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)query.c_str(), SQL_NTS);

    if (SQL_SUCCEEDED(ret))
    {
        cnicList.insert(cnic);
        userCache[email] = password;
        auditQueue.push("User " + fullname + " registered.");
        cout << "User registered successfully.\n";
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return true;
    }
    else
    {
        cerr << "Registration failed.\n";
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return false;
    }
}

CustomOptional<User> Database::verifyUser(const string &email, const string &password)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);

    string query = "SELECT fullname, father_name, mother_name, date_of_birth, "
                   "cnic_number, email_address, phone_no, role "
                   "FROM users WHERE email_address='" +
                   email +
                   "' AND password='" + password + "'";

    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)query.c_str(), SQL_NTS);

    if (!SQL_SUCCEEDED(ret))
    {
        cerr << "Query failed during login.\n";
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return nullopt;
    }

    SQLCHAR fullname[100], father[100], mother[100], dob[20], cnic[20], email_addr[100], phone[20], role[20];
    if (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_CHAR, fullname, sizeof(fullname), NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, father, sizeof(father), NULL);
        SQLGetData(stmt, 3, SQL_C_CHAR, mother, sizeof(mother), NULL);
        SQLGetData(stmt, 4, SQL_C_CHAR, dob, sizeof(dob), NULL);
        SQLGetData(stmt, 5, SQL_C_CHAR, cnic, sizeof(cnic), NULL);
        SQLGetData(stmt, 6, SQL_C_CHAR, email_addr, sizeof(email_addr), NULL);
        SQLGetData(stmt, 7, SQL_C_CHAR, phone, sizeof(phone), NULL);
        SQLGetData(stmt, 8, SQL_C_CHAR, role, sizeof(role), NULL);

        User user{
            (char *)fullname,
            (char *)father,
            (char *)mother,
            (char *)dob,
            (char *)cnic,
            (char *)email_addr,
            (char *)phone,
            (char *)role};

        auditQueue.push("User " + email + " logged in.");
        cout << "Login successful for: " << email << endl;

        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return user;
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    cout << "Invalid credentials.\n";
    return nullopt;
}

bool Database::castVote(const string &voterCnic, int candidateId, int electionId)
{
    SQLHSTMT stmt;
    SQLRETURN ret;

    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q = "SELECT id FROM users WHERE cnic_number='" + voterCnic + "'";
    ret = SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);

    SQLINTEGER voterId;
    if (SQLFetch(stmt) != SQL_SUCCESS)
    {
        cerr << "User not found.\n";
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return false;
    }
    SQLGetData(stmt, 1, SQL_C_SLONG, &voterId, 0, NULL);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);

    if (votedUsers.existsForCandidate(voterId, candidateId))
    {
        cerr << "You have already voted for this candidate.\n";
        return false;
    }

    if (votedUsers.existsInElection(voterId, electionId))
    {
        cerr << "You have already voted in this election.\n";
        return false;
    }

    SQLINTEGER partyId = 0;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string getParty = "SELECT party_id FROM candidates WHERE id=" + to_string(candidateId);
    ret = SQLExecDirect(stmt, (SQLCHAR *)getParty.c_str(), SQL_NTS);
    if (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &partyId, 0, NULL);
    }
    else
    {
        cerr << "Candidate not found.\n";
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return false;
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);

    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string insertVote =
        "INSERT INTO votes (voter_id, candidate_id, election_id, party_id) VALUES (" +
        to_string(voterId) + "," + to_string(candidateId) + "," + to_string(electionId) + "," + to_string(partyId) + ")";
    ret = SQLExecDirect(stmt, (SQLCHAR *)insertVote.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);

    if (!SQL_SUCCEEDED(ret))
    {
        cerr << "Failed to insert vote record.\n";
        return false;
    }

    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string updateCandidate =
        "UPDATE candidates SET votes = votes + 1 WHERE id = " + to_string(candidateId);
    ret = SQLExecDirect(stmt, (SQLCHAR *)updateCandidate.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);

    if (!SQL_SUCCEEDED(ret))
    {
        cerr << "Failed to update candidate votes.\n";
        return false;
    }

    votedUsers.insert(voterId, electionId, candidateId);
    auditQueue.push("Vote cast by CNIC " + voterCnic + " for candidate " + to_string(candidateId));

    cout << "Vote successfully cast for candidate " << candidateId
         << " (Party " << partyId << ").\n";
    return true;
}

crow::json::wvalue Database::getResultsJson(int electionId)
{
    crow::json::wvalue res;
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);

    std::string query =
        "SELECT e.id AS election_id, e.name AS election_name, "
        "c.id AS candidate_id, c.name AS candidate_name, c.votes "
        "FROM elections e "
        "JOIN candidates c ON e.id = c.election_id "
        "WHERE e.id = " +
        std::to_string(electionId);

    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)query.c_str(), SQL_NTS);
    if (!SQL_SUCCEEDED(ret))
    {
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        res["error"] = "Failed to execute query.";
        return res;
    }

    SQLINTEGER election_id, candidate_id, votes;
    SQLCHAR election_name[100], candidate_name[100];

    int idx = 0;
    bool electionSet = false;

    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &election_id, 0, NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, election_name, sizeof(election_name), NULL);
        SQLGetData(stmt, 3, SQL_C_SLONG, &candidate_id, 0, NULL);
        SQLGetData(stmt, 4, SQL_C_CHAR, candidate_name, sizeof(candidate_name), NULL);
        SQLGetData(stmt, 5, SQL_C_SLONG, &votes, 0, NULL);

        if (!electionSet)
        {
            res["election"]["id"] = (int)election_id;
            res["election"]["name"] = std::string((char *)election_name);
            electionSet = true;
        }

        res["candidates"][idx]["id"] = (int)candidate_id;
        res["candidates"][idx]["name"] = std::string((char *)candidate_name);
        res["candidates"][idx]["votes"] = (int)votes;
        idx++;
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return res;
}

void Database::loadParties()
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR *)"SELECT id,name,color,total_members,seats_held FROM parties", SQL_NTS);
    SQLINTEGER id, members, seats;
    SQLCHAR name[100], color[50];
    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &id, 0, NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, name, sizeof(name), NULL);
        SQLGetData(stmt, 3, SQL_C_CHAR, color, sizeof(color), NULL);
        SQLGetData(stmt, 4, SQL_C_SLONG, &members, 0, NULL);
        SQLGetData(stmt, 5, SQL_C_SLONG, &seats, 0, NULL);
        partyList.insert(id, (char *)name, (char *)color, members, seats);
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
}

void Database::loadElections()
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR *)"SELECT id,name,description,election_date,status FROM elections", SQL_NTS);
    SQLINTEGER id;
    SQLCHAR name[100], desc[255], date[30], status[20];
    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &id, 0, NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, name, sizeof(name), NULL);
        SQLGetData(stmt, 3, SQL_C_CHAR, desc, sizeof(desc), NULL);
        SQLGetData(stmt, 4, SQL_C_CHAR, date, sizeof(date), NULL);
        SQLGetData(stmt, 5, SQL_C_CHAR, status, sizeof(status), NULL);
        Election e = {id, (char *)name, (char *)desc, (char *)date, (char *)status};
        elections.push_back(e);
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
}

bool Database::createParty(const string &name, const string &color, int members, int seats)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q = "INSERT INTO parties(name,color,total_members,seats_held) VALUES('" + name + "','" + color + "'," + to_string(members) + "," + to_string(seats) + ")";
    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    if (SQL_SUCCEEDED(ret))
    {
        auditQueue.push("Party " + name + " created.");
        return true;
    }
    return false;
}

bool Database::deleteParty(int id)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q = "DELETE FROM parties WHERE id=" + to_string(id);
    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return SQL_SUCCEEDED(ret);
}

bool Database::createElection(const string &name, const string &desc,
                              const string &election_date, const string &start_date,
                              const string &end_date, const string &status)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q =
        "INSERT INTO elections(name, description, election_date, start_date, end_date, status) "
        "VALUES('" +
        name + "','" + desc + "','" + election_date + "','" + start_date + "','" + end_date + "','" + status + "')";
    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return SQL_SUCCEEDED(ret);
}

bool Database::deleteElection(int id)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q = "DELETE FROM elections WHERE id=" + to_string(id);
    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return SQL_SUCCEEDED(ret);
}

bool Database::createCandidate(const string &name, int electionId, int partyId)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q = "INSERT INTO candidates(name,votes,election_id,party_id) VALUES('" + name + "',0," + to_string(electionId) + "," + to_string(partyId) + ")";
    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return SQL_SUCCEEDED(ret);
}

bool Database::deleteCandidate(int id)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q = "DELETE FROM candidates WHERE id=" + to_string(id);
    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return SQL_SUCCEEDED(ret);
}

void Database::finalizeElection(int electionId)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);

    SQLExecDirect(stmt, (SQLCHAR *)"UPDATE parties SET seats_held = 0", SQL_NTS);

    string q = "SELECT party_id, COUNT(*) as total_votes "
               "FROM votes WHERE election_id=" + to_string(electionId) +
               " GROUP BY party_id";
    SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);

    SQLINTEGER partyId, votes;
    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &partyId, 0, NULL);
        SQLGetData(stmt, 2, SQL_C_SLONG, &votes, 0, NULL);

        string update = "UPDATE parties SET seats_held = " + to_string(votes) +
                        " WHERE id = " + to_string(partyId);
        SQLHSTMT updateStmt;
        SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &updateStmt);
        SQLExecDirect(updateStmt, (SQLCHAR *)update.c_str(), SQL_NTS);
        SQLFreeHandle(SQL_HANDLE_STMT, updateStmt);
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);

    SQLHSTMT statusStmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &statusStmt);
    string statusUpdate = "UPDATE elections SET status='Ended' WHERE id=" + to_string(electionId);
    SQLExecDirect(statusStmt, (SQLCHAR *)statusUpdate.c_str(), SQL_NTS);
    SQLFreeHandle(SQL_HANDLE_STMT, statusStmt);

    cout << "Election " << electionId << " finalized. Party seats updated.\n";
}

crow::json::wvalue Database::getAllPartiesJson()
{
    crow::json::wvalue res;
    res["parties"] = crow::json::wvalue::list();
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR *)"SELECT id, name, color, total_members, seats_held FROM parties", SQL_NTS);

    SQLINTEGER id, members, seats;
    SQLCHAR name[100], color[50];
    int idx = 0;

    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &id, 0, NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, name, sizeof(name), NULL);
        SQLGetData(stmt, 3, SQL_C_CHAR, color, sizeof(color), NULL);
        SQLGetData(stmt, 4, SQL_C_SLONG, &members, 0, NULL);
        SQLGetData(stmt, 5, SQL_C_SLONG, &seats, 0, NULL);

        res["parties"][idx]["id"] = static_cast<int>(id);
        res["parties"][idx]["name"] = (char *)name;
        res["parties"][idx]["color"] = (char *)color;
        res["parties"][idx]["members"] = static_cast<int>(members);
        res["parties"][idx]["seats"] = static_cast<int>(seats);
        idx++;
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return res;
}

crow::json::wvalue Database::getAllElectionsJson()
{
    crow::json::wvalue res;
    res["elections"] = crow::json::wvalue::list();
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    SQLExecDirect(stmt, (SQLCHAR *)"SELECT id, name, description, election_date, status FROM elections", SQL_NTS);

    SQLINTEGER id;
    SQLCHAR name[100], desc[255], date[30], status[20];
    int idx = 0;

    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &id, 0, NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, name, sizeof(name), NULL);
        SQLGetData(stmt, 3, SQL_C_CHAR, desc, sizeof(desc), NULL);
        SQLGetData(stmt, 4, SQL_C_CHAR, date, sizeof(date), NULL);
        SQLGetData(stmt, 5, SQL_C_CHAR, status, sizeof(status), NULL);

        res["elections"][idx]["id"] = static_cast<int>(id);
        res["elections"][idx]["name"] = (char *)name;
        res["elections"][idx]["description"] = (char *)desc;
        res["elections"][idx]["date"] = (char *)date;
        res["elections"][idx]["status"] = (char *)status;
        idx++;
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return res;
}

int Database::getPartyIdByName(const string &name)
{
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);
    string q = "SELECT id FROM parties WHERE name='" + name + "' LIMIT 1";
    SQLRETURN ret = SQLExecDirect(stmt, (SQLCHAR *)q.c_str(), SQL_NTS);
    int id = 0;
    if (SQL_SUCCEEDED(ret) && SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLINTEGER pid;
        SQLGetData(stmt, 1, SQL_C_SLONG, &pid, 0, NULL);
        id = static_cast<int>(pid);
    }
    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return id;
}

crow::json::wvalue Database::getAllCandidatesJson()
{
    crow::json::wvalue result;
    result["candidates"] = crow::json::wvalue::list();
    SQLHSTMT stmt;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);

    std::string query =
        "SELECT c.id, c.name, p.name AS party_name, e.name AS election_name, "
        "c.votes, c.election_id, c.party_id "
        "FROM candidates c "
        "LEFT JOIN parties p ON c.party_id = p.id "
        "LEFT JOIN elections e ON c.election_id = e.id";

    if (SQLExecDirect(stmt, (SQLCHAR *)query.c_str(), SQL_NTS) != SQL_SUCCESS)
    {
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        return result;
    }

    int id, votes, election_id, party_id;
    SQLCHAR candidate_name[255], party_name[255], election_name[255];
    int idx = 0;

    while (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &id, 0, NULL);
        SQLGetData(stmt, 2, SQL_C_CHAR, candidate_name, sizeof(candidate_name), NULL);
        SQLGetData(stmt, 3, SQL_C_CHAR, party_name, sizeof(party_name), NULL);
        SQLGetData(stmt, 4, SQL_C_CHAR, election_name, sizeof(election_name), NULL);
        SQLGetData(stmt, 5, SQL_C_SLONG, &votes, 0, NULL);
        SQLGetData(stmt, 6, SQL_C_SLONG, &election_id, 0, NULL);
        SQLGetData(stmt, 7, SQL_C_SLONG, &party_id, 0, NULL);

        result["candidates"][idx]["id"] = id;
        result["candidates"][idx]["name"] = std::string((char *)candidate_name);
        result["candidates"][idx]["party"] = std::string((char *)party_name);
        result["candidates"][idx]["party_id"] = party_id;
        result["candidates"][idx]["election"] = std::string((char *)election_name);
        result["candidates"][idx]["election_id"] = election_id;
        result["candidates"][idx]["votes"] = votes;
        idx++;
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return result;
}

bool Database::hasVoted(const std::string &cnic, int electionId)
{
    SQLHSTMT stmt;
    SQLRETURN ret;
    SQLAllocHandle(SQL_HANDLE_STMT, hDbc, &stmt);

    std::string query =
        "SELECT COUNT(*) FROM votes v "
        "JOIN users u ON v.voter_id = u.id "
        "WHERE u.cnic_number = '" + cnic + "' AND v.election_id = " + std::to_string(electionId);

    ret = SQLExecDirect(stmt, (SQLCHAR *)query.c_str(), SQL_NTS);
    if (!SQL_SUCCEEDED(ret))
    {
        SQLFreeHandle(SQL_HANDLE_STMT, stmt);
        std::cerr << "Error executing hasVoted query.\n";
        return false;
    }

    SQLINTEGER count = 0;
    if (SQLFetch(stmt) == SQL_SUCCESS)
    {
        SQLGetData(stmt, 1, SQL_C_SLONG, &count, 0, NULL);
    }

    SQLFreeHandle(SQL_HANDLE_STMT, stmt);
    return count > 0;
}

