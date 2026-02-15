import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "https://skillbridge-backend-hz7v.onrender.com/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const activeOrders = orders.filter(o => o.status !== "completed").length;
  const totalSpent = orders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div style={pageStyle}>
      {/* ================= NAVBAR ================= */}
      <div style={navbar}>
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          💼 SkillBridge
        </h2>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {/* ✅ FIXED HERE */}
          <span style={navItem} onClick={() => navigate("/explore")}>
            Browse
          </span>

          <span style={navItem} onClick={() => navigate("/client/orders")}>
            My Orders
          </span>

          <span style={navItem} onClick={handleLogout}>
            Logout
          </span>
        </div>
      </div>

      <div style={containerStyle}>
        {/* ================= HERO ================= */}
        <div style={heroSection}>
          <div>
            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
              Welcome back, {user.name} 👋
            </h1>
            <p style={{ color: "#6b7280" }}>
              Manage your orders and explore top freelancers.
            </p>
          </div>

          <div style={avatarCircle}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div style={statsGrid}>
          <StatCard title="Total Orders" value={totalOrders} />
          <StatCard title="Active Orders" value={activeOrders} />
          <StatCard title="Completed Orders" value={completedOrders} />
          <StatCard title="Total Spent" value={`₹${totalSpent}`} />
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div style={{ marginTop: "50px" }}>
          <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>

          <div style={actionGrid}>
            {/* ✅ FIXED HERE */}
            <ActionCard 
              title="Browse Gigs"
              onClick={() => navigate("/explore")}
            />

            <ActionCard 
              title="My Orders"
              onClick={() => navigate("/client/orders")}
            />

            <ActionCard 
              title="Logout"
              onClick={handleLogout}
              danger
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value }) => (
  <div style={statCard}>
    <p style={{ color: "#6b7280", fontSize: "14px" }}>{title}</p>
    <h2 style={{ fontSize: "22px", marginTop: "8px", color: "#4f46e5" }}>
      {value}
    </h2>
  </div>
);

const ActionCard = ({ title, onClick, danger }) => (
  <div
    onClick={onClick}
    style={{
      ...actionCard,
      border: danger ? "1px solid #ef4444" : "1px solid #e5e7eb",
      color: danger ? "#ef4444" : "#111827",
    }}
  >
    {title}
  </div>
);

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #eef2ff, #fdf4ff)",
};

const navbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 60px",
  background: "white",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const navItem = {
  cursor: "pointer",
  fontWeight: "500",
  color: "#374151",
};

const containerStyle = {
  maxWidth: "1100px",
  margin: "60px auto",
  padding: "0 20px",
};

const heroSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
};

const avatarCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#4f46e5",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: "bold",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "40px",
};

const statCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const actionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
};

const actionCard = {
  padding: "20px",
  borderRadius: "16px",
  background: "white",
  textAlign: "center",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  transition: "0.2s",
};

export default ClientDashboard;
