import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateGig from "./pages/CreateGig";
import GigDetail from "./pages/GigDetail";

import ClientDashboard from "./pages/client/Dashboard";
import FreelancerDashboard from "./pages/freelancer/Dashboard";

import ClientOrders from "./pages/client/Orders";
import FreelancerOrders from "./pages/freelancer/Orders";
import MyGigs from "./pages/freelancer/MyGigs";

import Chat from "./pages/Chat";

// ✅ ADMIN
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminGigs from "./pages/admin/Gigs";
import AdminReviews from "./pages/admin/Reviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARDS */}
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />

        {/* FREELANCER */}
        <Route path="/freelancer/create-gig" element={<CreateGig />} />
        <Route path="/freelancer/my-gigs" element={<MyGigs />} />
        <Route path="/freelancer/orders" element={<FreelancerOrders />} />

        {/* CLIENT */}
        <Route path="/client/orders" element={<ClientOrders />} />

        {/* GIG DETAIL */}
        <Route path="/gigs/:id" element={<GigDetail />} />

        {/* CHAT */}
        <Route path="/chat/:userId" element={<Chat />} />

        {/* 🛠 ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/gigs" element={<AdminGigs />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
