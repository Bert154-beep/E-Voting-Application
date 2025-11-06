import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export const VotingContext = createContext({});

export default function VotingContextProvider({ children }) {
  const [elections, setElections] = useState([]);
  const [parties, setParties] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [results, setResults] = useState({});
  const [hasVoted, setHasVoted] = useState({});

  const fetchElections = async () => {
    try {
      const res = await api.get("/elections");
      setElections(res.data.elections || []);
    } catch {
      toast.error("Failed to load elections!");
    }
  };

  const fetchParties = async () => {
    try {
      const res = await api.get("/parties");
      setParties(res.data.parties || []);
    } catch {
      toast.error("Failed to load parties!");
    }
  };

  const fetchCandidates = async (electionId) => {
    try {
      const res = await api.get("/candidates");
      const allCandidates = res.data.candidates || [];
      const filtered = allCandidates.filter(c => c.election_id === electionId);
      setCandidates(prev => ({ ...prev, [electionId]: filtered }));
    } catch {
      toast.error("Failed to load candidates!");
      setCandidates(prev => ({ ...prev, [electionId]: [] }));
    }
  };

  const castVote = async ({ cnic, candidate_id, election_id }) => {
    try {
      await api.post("/vote", { cnic, candidate_id, election_id });
      toast.success("Vote cast successfully!");
      setHasVoted(prev => ({ ...prev, [election_id]: true }));
      fetchResults(election_id);
    } catch {
      toast.error("Failed to cast vote!");
    }
  };

const fetchResults = async (electionId) => {
  try {
    const res = await api.get(`/results/${electionId}`);
    setResults((prev) => ({
      ...prev,
      [electionId]: res.data, 
    }));
  } catch {
    toast.error("Failed to load election results!");
  }
};

const checkVoteStatus = async (cnic, electionId) => {
  try {
    const res = await api.get(`/hasVoted?cnic=${cnic}&election_id=${electionId}`);
    const voted = res.data?.hasVoted ?? false;
    setHasVoted(prev => ({ ...prev, [electionId]: voted }));
    return voted;
  } catch {
    toast.error("Failed to check voting status!");
    return false;
  }
};



  return (
    <VotingContext.Provider
      value={{
        elections,
        parties,
        candidates,
        results,
        hasVoted,
        fetchElections,
        fetchParties,
        fetchCandidates,
        fetchResults,
        castVote,
        setHasVoted,
        checkVoteStatus
      }}
    >
      {children}
    </VotingContext.Provider>
  );
}

export const useVoting = () => useContext(VotingContext);
