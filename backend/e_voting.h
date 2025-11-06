#pragma once
#include <winsock2.h>
#include <ws2tcpip.h>
#include <windows.h>
#include <sql.h>
#include <sqlext.h>
#include <string>
#include <iostream>
#include <optional>
#include <crow.h>
using namespace std;

struct User
{
    string fullname, father_name, mother_name, date_of_birth;
    string cnic_number, email_address, phone_no, role;
};

struct VoteResult
{
    int candidateId;
    string name;
    int votes;
    bool operator<(const VoteResult &other) const
    {
        return votes < other.votes;
    }
};

struct Party
{
    int id;
    string name;
    string color;
    int members;
    int seats;
    Party *next;
    Party(int i, const string &n, const string &c, int m, int s)
        : id(i), name(n), color(c), members(m), seats(s), next(nullptr) {}
};

class PartyList
{
    Party *head;

public:
    PartyList() : head(nullptr) {}
    ~PartyList()
    {
        while (head)
        {
            Party *t = head;
            head = head->next;
            delete t;
        }
    }
    void insert(int id, const string &name, const string &color, int members, int seats);
    void print();
};

struct Election
{
    int id;
    string name, description, date, status;
};

template <typename T>
class DynamicArray
{
    T *arr;
    int size, capacity;

public:
    DynamicArray() : arr(new T[10]), size(0), capacity(10) {}
    ~DynamicArray() { delete[] arr; }

    void push_back(const T &val)
    {
        if (size >= capacity)
        {
            capacity *= 2;
            T *newArr = new T[capacity];
            for (int i = 0; i < size; ++i)
                newArr[i] = arr[i];
            delete[] arr;
            arr = newArr;
        }
        arr[size++] = val;
    }
    int length() const { return size; }
    T &operator[](int i) { return arr[i]; }
};

class StringQueue
{
    struct Node
    {
        string data;
        Node *next;
        Node(const string &d) : data(d), next(nullptr) {}
    };
    Node *front;
    Node *rear;

public:
    StringQueue() : front(nullptr), rear(nullptr) {}
    ~StringQueue()
    {
        while (front)
        {
            Node *t = front;
            front = front->next;
            delete t;
        }
    }
    void push(const string &s);
    bool empty() const;
    string pop();
};

class CNICList
{
    struct CNICNode
    {
        string cnic;
        CNICNode *next;
        CNICNode(const string &c) : cnic(c), next(nullptr) {}
    };
    CNICNode *head;

public:
    CNICList();
    ~CNICList();
    bool exists(const string &cnic);
    void insert(const string &cnic);
    void loadFromDB(SQLHDBC hDbc);
};

class UserCacheList
{
    struct Node
    {
        string email, password;
        Node *next;
        Node(const string &e, const string &p) : email(e), password(p), next(nullptr) {}
    };
    Node *head;

public:
    UserCacheList() : head(nullptr) {}
    ~UserCacheList()
    {
        while (head)
        {
            Node *t = head;
            head = head->next;
            delete t;
        }
    }
    void insert(const string &e, const string &p);
    bool verify(const string &e, const string &p);

    string &operator[](const string &key)
    {
        Node *current = head;
        while (current)
        {
            if (current->email == key)
                return current->password;
            current = current->next;
        }

        Node *newNode = new Node(key, "");
        newNode->next = head;
        head = newNode;
        return head->password;
    }
};

class VotedUserList {
private:
    struct Node {
        int voterId;
        int electionId;
        int candidateId;
        Node* next;
        Node(int v, int e, int c);
    };
    Node* head;

public:
    VotedUserList();
    ~VotedUserList();
    bool existsInElection(int voterId, int electionId);
    bool existsForCandidate(int voterId, int candidateId);
    void insert(int voterId, int electionId, int candidateId);
};



template <typename T>
struct CustomOptional
{
    bool has_value;
    T value;

    CustomOptional() : has_value(false) {}
    CustomOptional(const T &v) : has_value(true), value(v) {}
    CustomOptional(std::nullopt_t) : has_value(false) {}
};

class CustomHeap
{
    VoteResult *arr;
    int size;
    int capacity;

public:
    CustomHeap() : size(0), capacity(10) { arr = new VoteResult[capacity]; }
    ~CustomHeap() { delete[] arr; }

    bool empty() const { return size == 0; }

    void push(const VoteResult &v)
    {
        if (size >= capacity)
        {
            capacity *= 2;
            VoteResult *newArr = new VoteResult[capacity];
            for (int i = 0; i < size; ++i)
                newArr[i] = arr[i];
            delete[] arr;
            arr = newArr;
        }
        arr[size] = v;
        int i = size++;
        while (i > 0 && arr[(i - 1) / 2] < arr[i])
        {
            swap(arr[i], arr[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }

    VoteResult pop()
    {
        if (empty())
            return {0, "", 0};
        VoteResult root = arr[0];
        arr[0] = arr[--size];
        heapify(0);
        return root;
    }

    void clear() { size = 0; }

private:
    void heapify(int i)
    {
        int largest = i;
        int left = 2 * i + 1, right = 2 * i + 2;
        if (left < size && arr[largest] < arr[left])
            largest = left;
        if (right < size && arr[largest] < arr[right])
            largest = right;
        if (largest != i)
        {
            swap(arr[i], arr[largest]);
            heapify(largest);
        }
    }
};

class Database
{
    SQLHENV hEnv;
    SQLHDBC hDbc;
    bool connected;

    CustomHeap resultsHeap;
    UserCacheList userCache;
    VotedUserList votedUsers;
    StringQueue auditQueue;
    CNICList cnicList;
    PartyList partyList;
    DynamicArray<Election> elections;

    void loadUsersToCache();
    void loadParties();
    void loadElections();
    void loadVotesToHeap();

public:
    Database();
    ~Database();
    bool connect();
    void close();

    bool isConnected() const { return connected; }

    bool createUser(const string &, const string &, const string &, const string &, const string &, const string &, const string &, const string &, const string &);
    CustomOptional<User> verifyUser(const string &, const string &);
    bool createParty(const string &, const string &, int, int);
    bool deleteParty(int);
    bool createElection(const string &, const string &, const string &, const string &, const string &, const string &);
    bool deleteElection(int);
    bool createCandidate(const string &, int, int);
    bool deleteCandidate(int);
    int getPartyIdByName(const std::string &name);
    bool castVote(const string &voterCnic, int candidateId, int electionId);
    string getResults(int electionId);
    void finalizeElection(int electionId);
    crow::json::wvalue getResultsJson(int electionId);
    crow::json::wvalue getAllPartiesJson();
    crow::json::wvalue getAllElectionsJson();
    crow::json::wvalue getAllCandidatesJson();
    bool hasVoted(const std::string& cnic, int electionId);

};
