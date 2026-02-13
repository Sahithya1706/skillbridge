import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchFreelancerDashboard,
  fetchMonthlyEarnings,
} from "../../utils/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [dashboardData, setDashboardData] = useState(null);
  const [earningsData, setEarningsData] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "freelancer") {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      const data = await fetchFreelancerDashboard();
      setDashboardData(data);
    };

    const loadEarnings = async () => {
      const data = await fetchMonthlyEarnings();
      setEarningsData(data || []);
    };

    loadDashboard();
    loadEarnings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (!dashboardData) {
    return <div style={{ padding: "60px" }}>Loading...</div>;
  }

  const recentOrders = dashboardData.recentOrders || [];

  const monthNames = [
    "",
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const chartData = {
    labels: earningsData.map((e) => monthNames[e._id]),
    datasets: [
      {
        label: "Monthly Earnings",
        data: earningsData.map((e) => e.total),
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div style={pageStyle}>

      {/* ===== NAVBAR ===== */}
      <div style={navbar}>
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          💼 SkillBridge
        </h2>

        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <span style={{ color: "#6b7280" }}>
            Welcome, <strong>{user.name}</strong>
          </span>

          <button style={navBtn} onClick={() => navigate("/")}>Home</button>
          <button style={navBtn} onClick={() => navigate("/freelancer/my-gigs")}>My Gigs</button>
          <button style={navBtn} onClick={() => navigate("/freelancer/orders")}>Orders</button>
          <button style={logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section style={heroSection}>
        <h1 style={heroTitle}>Freelancer Dashboard</h1>
        <p style={heroSub}>
          Track your gigs, orders, earnings and performance.
        </p>
      </section>

      {/* ===== STATS ===== */}
      <section style={statsSection}>
        <Stat title="Total Gigs" value={dashboardData.totalGigs || 0} />
        <Stat title="Active Orders" value={dashboardData.activeOrders || 0} />
        <Stat title="Gross Earnings" value={`₹${dashboardData.grossEarnings || 0}`} />
        <Stat title="Net Earnings" value={`₹${dashboardData.totalEarnings || 0}`} />
        <Stat title="Platform Fee" value={`₹${dashboardData.platformRevenue || 0}`} />
        <Stat
          title="Rating"
          value={`${dashboardData.rating || 0} ⭐ (${dashboardData.reviewCount || 0})`}
        />
      </section>

      {/* ===== CHART ===== */}
      <section style={section}>
        <h2 style={sectionTitle}>Monthly Earnings</h2>
        {earningsData.length === 0 ? (
          <p>No completed orders yet.</p>
        ) : (
          <Bar data={chartData} />
        )}
      </section>

      {/* ===== RECENT ORDERS ===== */}
      <section style={section}>
        <h2 style={sectionTitle}>Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <div>
            {recentOrders.map((order) => (
              <div key={order._id} style={orderRow}>
                <div>
                  <strong>{order.gig?.title || "Deleted Gig"}</strong>
                  <p style={{ fontSize: "13px", color: "#6b7280" }}>
                    Client: {order.buyer?.name || "Unknown"}
                  </p>
                </div>

                <span style={statusBadge}>{order.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ title, value }) => (
  <div style={statBox}>
    <p style={{ fontSize: "14px", color: "#6b7280" }}>{title}</p>
    <h2 style={{ marginTop: "5px" }}>{value}</h2>
  </div>
);

/* ================= STYLES ================= */

const pageStyle = { minHeight: "100vh", background: "#f9fafb" };
const navbar = {
  background: "white",
  padding: "18px 50px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
};
const navBtn = { background: "transparent", border: "none", cursor: "pointer" };
const logoutBtn = {
  background: "#ef4444",
  border: "none",
  color: "white",
  padding: "6px 16px",
  borderRadius: "20px",
  cursor: "pointer",
};
const heroSection = { padding: "60px 80px 30px" };
const heroTitle = { fontSize: "36px" };
const heroSub = { marginTop: "10px", color: "#6b7280" };
const statsSection = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "25px",
  padding: "40px 80px",
};
const statBox = {
  background: "white",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};
const section = { padding: "40px 80px" };
const sectionTitle = { fontSize: "22px", marginBottom: "20px" };
const orderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 0",
  borderBottom: "1px solid #e5e7eb",
};
const statusBadge = {
  background: "#e0e7ff",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "13px",
};

export default FreelancerDashboard;
