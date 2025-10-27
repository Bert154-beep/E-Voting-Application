#pragma once
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <memory>
#include <iostream>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <windows.h>
#include <sql.h>
#include <sqlext.h>
#include<optional>
using namespace std;

struct User {
    string fullname;
    string father_name;
    string mother_name;
    string date_of_birth;
    string cnic_number;
    string email_address;
    string phone_no;
    string role;
};

struct CNICNode
{
    string cnic;
    CNICNode *next;
    CNICNode(const string &c) : cnic(c), next(nullptr) {}
};

class CNICList
{
private:
    CNICNode *head;

public:
    CNICList() : head(nullptr) {}
    ~CNICList()
    {
        while (head)
        {
            CNICNode *temp = head;
            head = head->next;
            delete temp;
        }
    }

    bool exists(const string &cnic);
    void insert(const string &cnic);
    void loadFromDB(SQLHDBC hDbc);
    void printCNICs();
};

class Database
{
private:
    SQLHENV hEnv;
    SQLHDBC hDbc;
    bool connected;

    unordered_map<string, string> userCache;
    unordered_set<int> votedUsers;
    priority_queue<pair<int, string>> resultsHeap;
    queue<string> auditQueue;
    CNICList cnicList;

    void loadUsersToCache();
    void loadVotesToHeap();

public:
    Database();
    ~Database();
    bool connect();
    void close();

    bool createUser(const string &fullname,
                    const string &father_name,
                    const string &mother_name,
                    const string &dob,
                    const string &cnic,
                    const string &password,
                    const string &email,
                    const string &phone_no,
                    const string &role);
    std::optional<User> verifyUser(const string &email, const string &password);
    bool castVote(const string &username, const string &candidateId);
    string getResults();
};
