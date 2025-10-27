#include "e_voting.h"
#include "crow.h"
#include <iostream>
using namespace std;

int main()
{
    Database db;

    if (!db.connect())
    {
        cerr << "Failed To Connect To The Database." << endl;
        return 1;
    }

    crow::SimpleApp app;

    CROW_ROUTE(app, "/register").methods("POST"_method)([&db](const crow::request &req)
                                                        {
        auto body = crow::json::load(req.body);
      if (!body || !body.has("fullname") || !body.has("father_name") ||
            !body.has("mother_name") || !body.has("date_of_birth") ||
            !body.has("cnic_number") || !body.has("password") ||
            !body.has("email_address") || !body.has("phone_no")) {
            return crow::response(400, "Missing Required Fields!");
        }

        string fullname = body["fullname"].s();
        string father_name = body["father_name"].s();
        string mother_name = body["mother_name"].s();
        string dob = body["date_of_birth"].s();
        string cnic = body["cnic_number"].s();
        string password = body["password"].s();
        string email = body["email_address"].s();
        string phone = body["phone_no"].s();

        if (db.createUser(fullname, father_name, mother_name, dob, cnic, password, email, phone, "voter")) {
            return crow::response(200, "User Registered Successfully!");
        } else {
            return crow::response(400, "Registration Failed!");
        } });

    CROW_ROUTE(app, "/login").methods("POST"_method)([&db](const crow::request &req){
    auto body = crow::json::load(req.body);
    if (!body || !body.has("email") || !body.has("password")) {
        return crow::response(400, "Missing email or password!");
    }

    string email = body["email"].s();
    string password = body["password"].s();

    auto userOpt = db.verifyUser(email, password);
    if (userOpt) {
        auto user = *userOpt;
        crow::json::wvalue response;
        response["fullname"] = user.fullname;
        response["father_name"] = user.father_name;
        response["mother_name"] = user.mother_name;
        response["date_of_birth"] = user.date_of_birth;
        response["cnic_number"] = user.cnic_number;
        response["email_address"] = user.email_address;
        response["phone_no"] = user.phone_no;
        response["role"] = user.role;

        return crow::response{response};
    } else {
        return crow::response(401, "Invalid credentials!");
    } });

    cout << "Server is running at http://localhost:18080" << endl;
    app.port(18080).multithreaded().run();

    db.close();
    return 0;
}
