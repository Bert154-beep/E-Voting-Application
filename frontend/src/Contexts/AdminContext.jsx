import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export const AdminContext = createContext({});

export default function AdminContextProvider({ children }) {
  const [parties, setParties] = useState([]);
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const fetchParties = async () => {
    try {
      const res = await api.get("/parties");
      const data = res.data.parties || res.data;
      setParties(data);
    } catch {
      toast.error("Failed to fetch parties!");
    }
  };

  const fetchElections = async () => {
    try {
      const res = await api.get("/elections");
      const data = res.data.elections || res.data;
      setElections(data);
    } catch {
      toast.error("Failed to fetch elections!");
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/candidates");
      const data = res.data.candidates || res.data;
      setCandidates(data);
    } catch {
      toast.error("Failed to fetch candidates!");
    }
  };

  const createParty = async (data) => {
    try {
      const res = await api.post("/party/create", data);
      toast.success(res.data || "Party created successfully!");
      fetchParties();
    } catch (error) {
      toast.error(error.response?.data || "Failed to create party!");
    }
  };

  const deleteParty = async (id) => {
    try {
      const res = await api.delete(`/party/delete/${id}`);
      toast.success(res.data || "Party deleted successfully!");
      fetchParties();
    } catch (error) {
      toast.error(error.response?.data || "Failed to delete party!");
    }
  };

  const createElection = async (data) => {
    try {
      const res = await api.post("/election/create", data);
      toast.success(res.data || "Election created successfully!");
      fetchElections();
    } catch (error) {
      toast.error(error.response?.data || "Failed to create election!");
    }
  };

  const deleteElection = async (id) => {
    try {
      const res = await api.delete(`/election/delete/${id}`);
      toast.success(res.data || "Election deleted successfully!");
      fetchElections();
    } catch (error) {
      toast.error(error.response?.data || "Failed to delete election!");
    }
  };

  const createCandidate = async (data) => {
    try {
      const res = await api.post("/candidate/create", data);
      toast.success(res.data || "Candidate created successfully!");
      fetchCandidates();
    } catch (error) {
      toast.error(error.response?.data || "Failed to create candidate!");
    }
  };

  const deleteCandidate = async (id) => {
    try {
      const res = await api.delete(`/candidate/delete/${id}`);
      toast.success(res.data || "Candidate deleted successfully!");
      fetchCandidates();
    } catch (error) {
      toast.error(error.response?.data || "Failed to delete candidate!");
    }
  };

  const finalizeElection = async (electionId) => {
  try {
    const res = await api.post(`/election/finalize/${electionId}`);
    setResults((prev) => ({
      ...prev,
      [electionId]: res.data.candidates || [],
    }));
    toast.success(res.data.message || "Election finalized!");
  } catch {
    toast.error("Failed to finalize election!");
  }
};




  return (
    <AdminContext.Provider
      value={{
        parties,
        elections,
        candidates,
        fetchParties,
        fetchElections,
        fetchCandidates,
        createParty,
        deleteParty,
        createElection,
        deleteElection,
        createCandidate,
        deleteCandidate,
        finalizeElection
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
