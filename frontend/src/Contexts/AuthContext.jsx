import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export const AuthContext = createContext({});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("evoting_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (data) => {
    try {
      const response = await api.post("/login", data);
      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem("evoting_user", JSON.stringify(userData));
        toast.success(`Welcome, ${userData.fullname || "User"}!`);
        return userData;
      }
    } catch (error) {
      const message =
        error.response?.data || "Invalid credentials. Please try again.";
      toast.error(message);
    }
  };

  const signup = async (data) => {
    try {
      const response = await api.post("/register", data);
      if (response.status === 200) {
        toast.success(response.data || "Registration successful!");
      }
    } catch (error) {
      const message =
        error.response?.data || "Signup failed. Please try again.";
      toast.error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("evoting_user");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
