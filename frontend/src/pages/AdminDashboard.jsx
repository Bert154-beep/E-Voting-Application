import React, { useState } from 'react';
import { Plus, Edit, Trash2, LogOut, User, X, Check } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('elections');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  const [elections, setElections] = useState([
    {
      id: 1,
      title: "Presidential Election 2025",
      date: "2025-11-05",
      status: "Active"
    },
    {
      id: 2,
      title: "Senate Election 2025",
      date: "2025-11-05",
      status: "Active"
    }
  ]);

  const [candidates, setCandidates] = useState([
    { id: 101, name: "Sarah Johnson", party: "Democratic Party", electionId: 1 },
    { id: 102, name: "Michael Chen", party: "Republican Party", electionId: 1 },
    { id: 201, name: "Robert Martinez", party: "Democratic Party", electionId: 2 }
  ]);

  const [parties, setParties] = useState([
    { id: 1, name: "Democratic Party", color: "bg-blue-500", seats: 45, members: 125000 },
    { id: 2, name: "Republican Party", color: "bg-red-500", seats: 42, members: 118000 },
    { id: 3, name: "Independent Party", color: "bg-green-500", seats: 8, members: 45000 }
  ]);

  const [formData, setFormData] = useState({});

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (modalType === 'election') {
      if (!formData.title || !formData.date || !formData.status) {
        alert('Please fill all fields');
        return;
      }
      const newElection = {
        id: Date.now(),
        title: formData.title,
        date: formData.date,
        status: formData.status
      };
      setElections([...elections, newElection]);
    } else if (modalType === 'candidate') {
      if (!formData.name || !formData.party || !formData.electionId) {
        alert('Please fill all fields');
        return;
      }
      const newCandidate = {
        id: Date.now(),
        name: formData.name,
        party: formData.party,
        electionId: parseInt(formData.electionId)
      };
      setCandidates([...candidates, newCandidate]);
    } else if (modalType === 'party') {
      if (!formData.name || !formData.color || !formData.seats || !formData.members) {
        alert('Please fill all fields');
        return;
      }
      const newParty = {
        id: Date.now(),
        name: formData.name,
        color: formData.color,
        seats: parseInt(formData.seats),
        members: parseInt(formData.members)
      };
      setParties([...parties, newParty]);
    }
    
    closeModal();
  };

  const deleteElection = (id) => {
    if (confirm('Are you sure you want to delete this election?')) {
      setElections(elections.filter(e => e.id !== id));
      setCandidates(candidates.filter(c => c.electionId !== id));
    }
  };

  const deleteCandidate = (id) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      setCandidates(candidates.filter(c => c.id !== id));
    }
  };

  const deleteParty = (id) => {
    if (confirm('Are you sure you want to delete this party?')) {
      setParties(parties.filter(p => p.id !== id));
    }
  };

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-orange-500', label: 'Orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">TrueVote Admin</h1>
            <p className="text-sm text-gray-600">Manage Elections & Candidates</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <User size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('elections')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'elections'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Elections
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'candidates'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveTab('parties')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'parties'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Parties
          </button>
        </div>

        {activeTab === 'elections' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Elections</h2>
              <button
                onClick={() => openModal('election')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
              >
                <Plus size={20} />
                Create Election
              </button>
            </div>

            <div className="grid gap-4">
              {elections.map(election => (
                <div key={election.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{election.title}</h3>
                      <p className="text-gray-600 mb-2">Date: {election.date}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        election.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {election.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => deleteElection(election.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Candidates</h2>
              <button
                onClick={() => openModal('candidate')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
              >
                <Plus size={20} />
                Add Candidate
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {candidates.map(candidate => {
                const election = elections.find(e => e.id === candidate.electionId);
                return (
                  <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{candidate.name}</h3>
                        <p className="text-gray-600 mb-2">{candidate.party}</p>
                        <p className="text-sm text-gray-500">Election: {election?.title || 'N/A'}</p>
                      </div>
                      <button 
                        onClick={() => deleteCandidate(candidate.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'parties' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Parties</h2>
              <button
                onClick={() => openModal('party')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
              >
                <Plus size={20} />
                Add Party
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {parties.map(party => (
                <div key={party.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`${party.color} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                        {party.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{party.name}</h3>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Seats: {party.seats}</p>
                          <p className="text-sm text-gray-600">Members: {party.members.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteParty(party.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                {modalType === 'election' && 'Create New Election'}
                {modalType === 'candidate' && 'Add New Candidate'}
                {modalType === 'party' && 'Add New Party'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {modalType === 'election' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Election Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Presidential Election 2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Election Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </>
              )}

              {modalType === 'candidate' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Party</label>
                    <select
                      name="party"
                      value={formData.party || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Party</option>
                      {parties.map(party => (
                        <option key={party.id} value={party.name}>{party.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Election</label>
                    <select
                      name="electionId"
                      value={formData.electionId || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Election</option>
                      {elections.map(election => (
                        <option key={election.id} value={election.id}>{election.title}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {modalType === 'party' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Party Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Democratic Party"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <select
                      name="color"
                      value={formData.color || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Color</option>
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>{color.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Seats</label>
                    <input
                      type="number"
                      name="seats"
                      value={formData.seats || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Members</label>
                    <input
                      type="number"
                      name="members"
                      value={formData.members || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
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