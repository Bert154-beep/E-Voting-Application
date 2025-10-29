import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import VotingDashboard from "../pages/VoterDashboard";
import AdminDashboard from "../pages/AdminDashboard";


const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage/>
    },
    {
        path: '/aboutus',
        element: <About/>
    },
    {
        path: '/contactus',
        element: <Contact/>
    },
    {
        path: '/signup',
        element: <SignUp/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/VoterDashboard',
        element: <VotingDashboard/>
    },
    {
        path: '/AdminDashboard',
        element: <AdminDashboard/>
    }
])

export default router