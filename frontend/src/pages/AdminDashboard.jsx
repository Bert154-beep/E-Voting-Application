import React, { useState, useEffect } from "react";
import { Plus, Trash2, LogOut, User, X, CircleChevronRight } from "lucide-react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../Contexts/AdminContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("elections");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});

  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    elections,
    candidates,
    parties,
    fetchElections,
    fetchCandidates,
    fetchParties,
    createElection,
    createCandidate,
    createParty,
    deleteElection,
    deleteCandidate,
    deleteParty,
    finalizeElection
  } = useAdmin();

  useEffect(() => {
    fetchElections();
    fetchCandidates();
    fetchParties();
  }, []);

  console.log(elections)
  console.log(candidates)

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (modalType === "election") {
        await createElection(formData);
      } else if (modalType === "candidate") {
        await createCandidate(formData);
      } else if (modalType === "party") {
        await createParty(formData);
      }
      closeModal();
    } catch {
    }
  };



  const colorOptions = [
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-red-500", label: "Red" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-yellow-500", label: "Yellow" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-orange-500", label: "Orange" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">TrueVote Admin</h1>
            <p className="text-sm text-gray-600">
              Manage Elections, Candidates & Parties
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <User size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {["elections", "candidates", "parties"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition ${activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "elections" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Elections</h2>
              <button
                onClick={() => openModal("election")}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
              >
                <Plus size={20} /> Create Election
              </button>
            </div>

            <div className="grid gap-4">
              {elections.map((e) => (
                <div
                  key={e.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{e.name}</h3>
                      <p className="text-gray-600">{e.description}</p>
                      <p className="text-gray-600">
                        Election Date: {e.date}
                      </p>

                      <p
                        className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${e.status === "active"
                            ? "bg-green-100 text-green-700"
                            : e.status === "upcoming"
                              ? "bg-yellow-100 text-yellow-700"
                              : e.status === "Ended"
                                ? "bg-gray-200 text-gray-800" 
                                : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {e.status === "Ended" ? "Finalized" : e.status}
                      </p>

                    </div>
                    <div className="flex flex-col">
                      <button
                        onClick={() => deleteElection(e.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={() => finalizeElection(e.id)}
                        className="hover:bg-green-50 text-green-700 p-2 rounded-lg"
                      >
                        <CircleChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "candidates" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Candidates
              </h2>
              <button
                onClick={() => openModal("candidate")}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
              >
                <Plus size={20} /> Add Candidate
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{c.name}</h3>
                      <p className="text-gray-600">{c.party}</p>
                      <p className="text-sm text-gray-500">
                        Election:{" "}
                        {elections.find((e) => e.id === c.election_id)?.name ||
                          "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCandidate(c.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "parties" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Parties</h2>
              <button
                onClick={() => openModal("party")}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
              >
                <Plus size={20} /> Add Party
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {parties.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className={`${p.color} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold`}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{p.name}</h3>
                        <p className="text-sm text-gray-600">
                          Seats: {p.seats}
                        </p>
                        <p className="text-sm text-gray-600">
                          Members: {p.members}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteParty(p.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalType === "election" && "Create New Election"}
                {modalType === "candidate" && "Add New Candidate"}
                {modalType === "party" && "Add New Party"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {modalType === "election" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Election Name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <textarea
                    name="description"
                    placeholder="Election Description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="date"
                    name="election_date"
                    value={formData.election_date || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Official Election Date"
                  />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Voting Start Date"
                  />
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Voting End Date"
                  />

                  <select
                    name="status"
                    value={formData.status || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </>
              )}


              {modalType === "candidate" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Candidate Name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <select
                    name="party"
                    value={formData.party || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Party</option>
                    {parties.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="electionId"
                    value={formData.electionId || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Election</option>
                    {elections.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {modalType === "party" && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Party Name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <select
                    name="color"
                    value={formData.color || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Color</option>
                    {colorOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="seats"
                    placeholder="Seats"
                    value={formData.seats || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    name="members"
                    placeholder="Members"
                    value={formData.members || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border rounded-full text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
