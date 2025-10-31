import React, { useState } from 'react';
import { Vote, TrendingUp, Users, CheckCircle, ArrowLeft, LogOut, User } from 'lucide-react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const VotingDashboard = () => {
  const [activeTab, setActiveTab] = useState('elections');
  const [selectedElection, setSelectedElection] = useState(null);
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState({});
  const {logout, user} = useAuth()
  const navigate = useNavigate()
  console.log(user)

  const handleLogout = async ()=>{
    logout()
    navigate('/')
  }

  const elections = [
    {
      id: 1,
      title: "Presidential Election 2025",
      date: "November 5, 2025",
      status: "Active",
      totalVotes: 0
    },
    {
      id: 2,
      title: "Senate Election 2025",
      date: "November 5, 2025",
      status: "Active",
      totalVotes: 0
    },
    {
      id: 3,
      title: "Governor Election 2025",
      date: "December 1, 2025",
      status: "Upcoming",
      totalVotes: 0
    }
  ];

  const candidates = {
    1: [
      { id: 101, name: "Sarah Johnson", party: "Democratic Party", image: "SJ", color: "bg-blue-500" },
      { id: 102, name: "Michael Chen", party: "Republican Party", image: "MC", color: "bg-red-500" },
      { id: 103, name: "Emma Williams", party: "Independent Party", image: "EW", color: "bg-green-500" },
      { id: 104, name: "James Davis", party: "Reform Party", image: "JD", color: "bg-purple-500" }
    ],
    2: [
      { id: 201, name: "Robert Martinez", party: "Democratic Party", image: "RM", color: "bg-blue-500" },
      { id: 202, name: "Lisa Anderson", party: "Republican Party", image: "LA", color: "bg-red-500" },
      { id: 203, name: "David Lee", party: "Green Party", image: "DL", color: "bg-green-600" }
    ],
    3: [
      { id: 301, name: "Patricia Brown", party: "Democratic Party", image: "PB", color: "bg-blue-500" },
      { id: 302, name: "Thomas Wilson", party: "Republican Party", image: "TW", color: "bg-red-500" }
    ]
  };

  const parties = [
    { name: "Democratic Party", seats: 45, color: "bg-blue-500", members: 125000 },
    { name: "Republican Party", seats: 42, color: "bg-red-500", members: 118000 },
    { name: "Independent Party", seats: 8, color: "bg-green-500", members: 45000 },
    { name: "Reform Party", seats: 3, color: "bg-purple-500", members: 28000 },
    { name: "Green Party", seats: 2, color: "bg-green-600", members: 15000 }
  ];

  const handleVote = (electionId, candidateId) => {
    if (hasVoted[electionId]) {
      alert("You have already voted in this election!");
      return;
    }

    setVotes(prev => ({
      ...prev,
      [electionId]: {
        ...prev[electionId],
        [candidateId]: (prev[electionId]?.[candidateId] || 0) + 1
      }
    }));
    
    setHasVoted(prev => ({
      ...prev,
      [electionId]: true
    }));

    alert("Vote cast successfully!");
  };

  const getVoteCount = (electionId, candidateId) => {
    return votes[electionId]?.[candidateId] || 0;
  };

  const getTotalVotes = (electionId) => {
    const electionVotes = votes[electionId] || {};
    return Object.values(electionVotes).reduce((sum, count) => sum + count, 0);
  };

  const getVotePercentage = (electionId, candidateId) => {
    const total = getTotalVotes(electionId);
    if (total === 0) return 0;
    return ((getVoteCount(electionId, candidateId) / total) * 100).toFixed(1);
  };

  if (selectedElection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedElection(null)}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-blue-600">TrueVote</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <User size={20} className="text-gray-600" />
                {user?.fullname}
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedElection.title}</h2>
            <p className="text-gray-600">Election Date: {selectedElection.date}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 font-medium">{selectedElection.status}</span>
            </div>
          </div>

          {hasVoted[selectedElection.id] && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-green-800 font-medium">You have successfully voted in this election</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {candidates[selectedElection.id].map(candidate => (
              <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`${candidate.color} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                    {candidate.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{candidate.name}</h3>
                    <p className="text-gray-600 mb-4">{candidate.party}</p>
                    
                    <button
                      onClick={() => handleVote(selectedElection.id, candidate.id)}
                      disabled={hasVoted[selectedElection.id]}
                      className={`w-full py-3 px-6 rounded-full font-semibold transition ${
                        hasVoted[selectedElection.id]
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {hasVoted[selectedElection.id] ? 'Already Voted' : 'Vote'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">TrueVote</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <User size={20} className="text-gray-600" />
              {user?.fullname}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Be A Part Of Decision</h2>
          <p className="text-2xl font-bold text-blue-600 mb-4">Vote Today</p>
          <p className="text-gray-600">Secure and transparent e-voting at your fingertips. Make your voice heard.</p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('elections')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'elections'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Vote size={20} />
              Elections
            </div>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'results'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={20} />
              Results
            </div>
          </button>
          <button
            onClick={() => setActiveTab('parties')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'parties'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} />
              Parties
            </div>
          </button>
        </div>

        {activeTab === 'elections' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map(election => (
              <div
                key={election.id}
                onClick={() => election.status === 'Active' && setSelectedElection(election)}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition ${
                  election.status === 'Active' ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Vote className="text-blue-600" size={32} />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    election.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {election.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{election.title}</h3>
                <p className="text-gray-600 mb-4">{election.date}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Votes</span>
                  <span className="font-semibold text-gray-900">{getTotalVotes(election.id)}</span>
                </div>
                {hasVoted[election.id] && (
                  <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle size={16} />
                    <span className="font-medium">Voted</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-8">
            {elections.map(election => {
              const totalVotes = getTotalVotes(election.id);
              if (totalVotes === 0) return null;

              return (
                <div key={election.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{election.title}</h3>
                  <p className="text-gray-600 mb-6">Total Votes: {totalVotes}</p>
                  
                  <div className="space-y-4">
                    {candidates[election.id].map(candidate => {
                      const voteCount = getVoteCount(election.id, candidate.id);
                      const percentage = getVotePercentage(election.id, candidate.id);
                      
                      return (
                        <div key={candidate.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`${candidate.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                {candidate.image}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{candidate.name}</p>
                                <p className="text-sm text-gray-600">{candidate.party}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{percentage}%</p>
                              <p className="text-sm text-gray-600">{voteCount} votes</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`${candidate.color} h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {elections.every(e => getTotalVotes(e.id) === 0) && (
              <div className="text-center py-12">
                <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-600">Results will appear here once voting begins</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'parties' && (
          <div className="grid md:grid-cols-2 gap-6">
            {parties.map((party, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`${party.color} w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl`}>
                    {party.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{party.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Seats</span>
                        <span className="font-semibold text-gray-900">{party.seats}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Members</span>
                        <span className="font-semibold text-gray-900">{party.members.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default VotingDashboard;