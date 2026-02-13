import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { fetchAdminDashboard } from "../../utils/api";

/* ================= CHARTS ================= */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueGrowth, setRevenueGrowth] = useState([]);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    if (!token) return;

    // 🔢 Dashboard stats
    fetchAdminDashboard().then(setStats);

    // 👤 Users growth (FIXED URL)
    fetch(
      "https://skillbridge-backend-hz7v.onrender.com/api/admin/analytics/users-growth",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then(setUserGrowth);

    // 💰 Revenue growth (FIXED URL)
    fetch(
      "https://skillbridge-backend-hz7v.onrender.com/api/admin/analytics/revenue-growth",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then(setRevenueGrowth);
  }, [token]);

  if (!stats) return <p style={{ textAlign: "center" }}>Loading...</p>;

  /* ===== MONTH NAMES ===== */
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  /* ===== USERS CHART ===== */
  const usersChartData = {
    labels: userGrowth.map((m) => monthNames[m._id - 1]),
    datasets: [
      {
        label: "Users Joined",
        data: userGrowth.map((m) => m.count),
        backgroundColor: "#6366f1",
      },
    ],
  };

  /* ===== REVENUE CHART ===== */
  const revenueChartData = {
    labels: revenueGrowth.map((m) => monthNames[m._id - 1]),
    datasets: [
      {
        label: "Revenue (₹)",
        data: revenueGrowth.map((m) => m.total),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <AdminLayout>
      <h1 style={title}>Admin Dashboard</h1>
      <p style={subtitle}>
        Monitor users, gigs, orders and platform performance
      </p>

      {/* ================= STATS ================= */}
      <div style={grid}>
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Gigs" value={stats.totalGigs} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Gross Revenue" value={`₹${stats.grossRevenue}`} />
        <StatCard
          label="Platform Revenue"
          value={`₹${stats.platformRevenue}`}
          highlight
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div style={chartGrid}>
        <div style={chartCard}>
          <h3 style={chartTitle}>Users Growth (Monthly)</h3>
          {userGrowth.length === 0 ? (
            <p>No data available</p>
          ) : (
            <Bar data={usersChartData} />
          )}
        </div>

        <div style={chartCard}>
          <h3 style={chartTitle}>Revenue Trend (Monthly)</h3>

          {revenueGrowth.length === 0 ? (
            <Line
              data={{
                labels: ["No Revenue Yet"],
                datasets: [
                  {
                    label: "Revenue (₹)",
                    data: [0],
                    borderColor: "#d1d5db",
                    backgroundColor: "rgba(209,213,219,0.4)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          ) : (
            <Line
              data={revenueChartData}
              options={{ scales: { y: { beginAtZero: true } } }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ label, value, highlight }) => (
  <div
    style={{
      ...card,
      background: highlight ? "#eef2ff" : "white",
    }}
  >
    <p style={cardLabel}>{label}</p>
    <h2 style={cardValue}>{value}</h2>
  </div>
);

/* ================= STYLES ================= */

const title = { fontSize: 32, marginBottom: 6 };
const subtitle = { color: "#6b7280", marginBottom: 30 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 24,
};

const card = {
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const cardLabel = { color: "#6b7280", marginBottom: 8 };
const cardValue = { fontSize: 28, fontWeight: "bold" };

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 30,
  marginTop: 40,
};

const chartCard = {
  background: "white",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const chartTitle = { marginBottom: 20, fontSize: 18 };

export default AdminDashboard;
