import React, { useEffect, useState } from "react";
import {
  Vote,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowLeft,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../Contexts/AuthContext";
import { useVoting } from "../Contexts/VotingContext";
import { useNavigate } from "react-router-dom";

const VotingDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    elections,
    parties,
    candidates,
    results,
    fetchElections,
    fetchParties,
    fetchCandidates,
    fetchResults,
    castVote,
    checkVoteStatus
  } = useVoting();

  const [activeTab, setActiveTab] = useState("elections");
  const [selectedElection, setSelectedElection] = useState(null);
  const [hasVoted, setHasVoted] = useState({});

  useEffect(() => {
    fetchElections();
    fetchParties();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleElectionSelect = async (election) => {
    setSelectedElection(election);
    await fetchCandidates(election.id);
    await fetchResults(election.id);

    const voted = await checkVoteStatus(user?.cnic_number, election?.id);
    setHasVoted((prev) => ({
      ...prev,
      [election.id]: voted,
    }));
  };


 const handleVote = async (electionId, candidateId) => {
  if (hasVoted[electionId]) return alert("You have already voted!");

  await castVote({
    cnic: user.cnic_number,
    election_id: electionId,
    candidate_id: candidateId,
  });

  await fetchResults(electionId);
  const voted = await checkVoteStatus(user?.cnic_number, electionId);
  setHasVoted((prev) => ({ ...prev, [electionId]: voted }));

  alert("Vote submitted successfully!");
};

  const getVoteCount = (candidateId) => {
    if (!results) return 0;
    return results[candidateId] || 0;
  };

  const getTotalVotes = () => {
    if (!results) return 0;
    return Object.values(results).reduce((sum, v) => sum + v, 0);
  };

  const getVotePercentage = (candidateId) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return ((getVoteCount(candidateId) / total) * 100).toFixed(1);
  };

  if (selectedElection) {
    const electionCandidates = candidates[selectedElection.id] || [];

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedElection(null)}
                className="text-gray-600 hover:text-gray-900"
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedElection.title}
            </h2>
            <p className="text-gray-600">
              Election Date: {selectedElection.date}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 font-medium">
                {selectedElection.status}
              </span>
            </div>
          </div>

          {hasVoted[selectedElection.id] && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-green-800 font-medium">
                You have already voted in this election
              </span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {electionCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {candidate.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Party: {candidate.party_name}
                    </p>

                    <button
                      onClick={() =>
                        handleVote(selectedElection.id, candidate.id)
                      }
                      disabled={hasVoted[selectedElection.id]}
                      className={`w-full py-3 px-6 rounded-full font-semibold transition ${hasVoted[selectedElection.id]
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                      {hasVoted[selectedElection.id]
                        ? "Already Voted"
                        : "Vote Now"}
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

  // Main voter dashboard
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
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Be A Part Of Decision
          </h2>
          <p className="text-2xl font-bold text-blue-600 mb-4">Vote Today</p>
          <p className="text-gray-600">
            Secure and transparent e-voting at your fingertips. Make your voice
            heard.
          </p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("elections")}
            className={`px-6 py-3 font-semibold transition ${activeTab === "elections"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <div className="flex items-center gap-2">
              <Vote size={20} /> Elections
            </div>
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-6 py-3 font-semibold transition ${activeTab === "results"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={20} /> Results
            </div>
          </button>
          <button
            onClick={() => setActiveTab("parties")}
            className={`px-6 py-3 font-semibold transition ${activeTab === "parties"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} /> Parties
            </div>
          </button>
        </div>

        {activeTab === "elections" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <div
                key={election.id}
                onClick={() =>
                  election.status === "active" && handleElectionSelect(election)
                }
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition ${election.status === "active"
                  ? "hover:shadow-lg cursor-pointer"
                  : "opacity-60"
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Vote className="text-blue-600" size={32} />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${election.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {election.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {election.name}
                </h3>
                <p className="text-gray-600 mb-4">{election.date}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "results" && (
          <div className="space-y-6">
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Select Election:
              </label>
              <select
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  if (id) fetchResults(id);
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Choose an election --
                </option>
                {elections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.name}
                  </option>
                ))}
              </select>
            </div>

            {Object.keys(results).length === 0 ? (
              <p className="text-gray-600">No results loaded yet.</p>
            ) : (
              Object.values(results).map((electionResults) => {
                const { election, candidates } = electionResults;

                if (!candidates?.length) {
                  return (
                    <div
                      key={election.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {election.name}
                      </h3>
                      <p className="text-gray-600">No results available yet.</p>
                    </div>
                  );
                }

                const totalVotes = candidates.reduce(
                  (sum, c) => sum + (c.votes || 0),
                  0
                );

                return (
                  <div
                    key={election.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {election.name}
                    </h3>

                    {candidates.map((candidate) => {
                      const percentage = totalVotes
                        ? ((candidate.votes / totalVotes) * 100).toFixed(1)
                        : 0;

                      return (
                        <div key={candidate.id} className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span>{candidate.name}</span>
                            <span>
                              {candidate.votes} votes ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div
                              className="bg-blue-600 h-3 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        )}



        {activeTab === "parties" && (
          <div className="grid md:grid-cols-2 gap-6">
            {parties.map((party, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                    {party.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {party.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Seats</span>
                        <span className="font-semibold text-gray-900">
                          {party.seats}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Members</span>
                        <span className="font-semibold text-gray-900">
                          {party.members.toLocaleString()}
                        </span>
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
