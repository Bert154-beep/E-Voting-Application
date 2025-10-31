#define WIN32_LEAN_AND_MEAN
#include <winsock2.h>
#include <windows.h>
#include "e_voting.h"
#include "crow.h"
#include <iostream>
using namespace std;

struct CORS {
    struct context {};
    void before_handle(crow::request&, crow::response& res, context&) {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
    }
    void after_handle(crow::request&, crow::response& res, context&) {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
    }
};


int main()
{
    Database db;
    if (!db.connect())
    {
        cerr << "Failed To Connect To The Database." << endl;
        return 1;
    }

    crow::App<CORS> app;

    

    CROW_ROUTE(app, "/register").methods("POST"_method)([&db](const crow::request &req)
                                                        {
        auto body = crow::json::load(req.body);
        if (!body || !body.has("fullname") || !body.has("father_name") || !body.has("mother_name") || !body.has("date_of_birth") || !body.has("cnic_number") || !body.has("password") || !body.has("email_address") || !body.has("phone_no"))
            return crow::response(400, "Missing Required Fields!");
        string fullname = body["fullname"].s(), father_name = body["father_name"].s(), mother_name = body["mother_name"].s();
        string dob = body["date_of_birth"].s(), cnic = body["cnic_number"].s(), password = body["password"].s();
        string email = body["email_address"].s(), phone = body["phone_no"].s();
        if (db.createUser(fullname, father_name, mother_name, dob, cnic, password, email, phone, "voter"))
            return crow::response(200, "User Registered Successfully!");
        return crow::response(400, "Registration Failed!"); });

    CROW_ROUTE(app, "/login").methods("POST"_method)([&db](const crow::request &req)
                                                     {
        auto body = crow::json::load(req.body);
        if (!body || !body.has("email") || !body.has("password"))
            return crow::response(400, "Missing email or password!");
        string email = body["email"].s(), password = body["password"].s();
        auto userOpt = db.verifyUser(email, password);
        if (userOpt.has_value) {
            auto user = userOpt.value;
            crow::json::wvalue res;
            res["fullname"] = user.fullname;
            res["father_name"] = user.father_name;
            res["mother_name"] = user.mother_name;
            res["date_of_birth"] = user.date_of_birth;
            res["cnic_number"] = user.cnic_number;
            res["email_address"] = user.email_address;
            res["phone_no"] = user.phone_no;
            res["role"] = user.role;
            return crow::response{res};
        }
        return crow::response(401, "Invalid credentials!"); });

    CROW_ROUTE(app, "/party/create").methods("POST"_method)([&db](const crow::request &req)
                                                            {
        auto body = crow::json::load(req.body);
        if (!body || !body.has("name") || !body.has("color") || !body.has("members") || !body.has("seats"))
            return crow::response(400, "Missing Fields!");
        string name = body["name"].s(), color = body["color"].s();
        int members = body["members"].i(), seats = body["seats"].i();
        if (db.createParty(name, color, members, seats))
            return crow::response(200, "Party Created Successfully!");
        return crow::response(400, "Party Creation Failed!"); });

    CROW_ROUTE(app, "/party/delete/<int>").methods("DELETE"_method)([&db](int id)
                                                                    {
        if (db.deleteParty(id))
            return crow::response(200, "Party Deleted Successfully!");
        return crow::response(400, "Failed To Delete Party!"); });

    CROW_ROUTE(app, "/election/create").methods("POST"_method)([&db](const crow::request &req)
                                                               {
        auto body = crow::json::load(req.body);
        if (!body || !body.has("name") || !body.has("description") || !body.has("date") || !body.has("status"))
            return crow::response(400, "Missing Fields!");
        string name = body["name"].s(), desc = body["description"].s(), date = body["date"].s(), status = body["status"].s();
        if (db.createElection(name, desc, date, status))
            return crow::response(200, "Election Created Successfully!");
        return crow::response(400, "Election Creation Failed!"); });

    CROW_ROUTE(app, "/election/delete/<int>").methods("DELETE"_method)([&db](int id)
                                                                       {
        if (db.deleteElection(id))
            return crow::response(200, "Election Deleted Successfully!");
        return crow::response(400, "Failed To Delete Election!"); });

    CROW_ROUTE(app, "/candidate/create").methods("POST"_method)([&db](const crow::request &req)
                                                                {
        auto body = crow::json::load(req.body);
        if (!body || !body.has("name") || !body.has("election_id") || !body.has("party_id"))
            return crow::response(400, "Missing Fields!");
        string name = body["name"].s();
        int electionId = body["election_id"].i(), partyId = body["party_id"].i();
        if (db.createCandidate(name, electionId, partyId))
            return crow::response(200, "Candidate Created Successfully!");
        return crow::response(400, "Candidate Creation Failed!"); });

    CROW_ROUTE(app, "/candidate/delete/<int>").methods("DELETE"_method)([&db](int id)
                                                                        {
        if (db.deleteCandidate(id))
            return crow::response(200, "Candidate Deleted Successfully!");
        return crow::response(400, "Failed To Delete Candidate!"); });

    CROW_ROUTE(app, "/vote").methods("POST"_method)([&db](const crow::request &req)
                                                    {
    auto body = crow::json::load(req.body);
    if (!body || !body.has("cnic") || !body.has("candidate_id") || !body.has("election_id"))
        return crow::response(400, "Missing Fields!");

    string cnic = body["cnic"].s();
    int candidateId = body["candidate_id"].i();
    int electionId = body["election_id"].i();  

    if (db.castVote(cnic, candidateId, electionId))
        return crow::response(200, "Vote Cast Successfully!");
    
    return crow::response(400, "Failed To Cast Vote!"); });

    CROW_ROUTE(app, "/results/<int>").methods("GET"_method)([&db](int electionId)
                                                            {
    if (!db.isConnected()) 
        return crow::response(500, "Database not connected.");

    crow::json::wvalue results = db.getResultsJson(electionId);
    return crow::response(results); });

    CROW_ROUTE(app, "/parties").methods("GET"_method)([&db]()
                                                      { return crow::response(db.getAllPartiesJson()); });

    CROW_ROUTE(app, "/elections").methods("GET"_method)([&db]()
                                                        { return crow::response(db.getAllElectionsJson()); });

    cout << "Server is running at http://localhost:18080" << endl;
    app.port(18080).multithreaded().run();
    db.close();
    return 0;
}
