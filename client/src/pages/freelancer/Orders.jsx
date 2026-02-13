import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { fetchMonthlyEarnings } from "../../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PLATFORM_COMMISSION = 0.1;

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user || user.role !== "freelancer") {
      navigate("/login");
      return;
    }
  }, [navigate, user]);

  useEffect(() => {
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
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    const fetchMonthly = async () => {
      const data = await fetchMonthlyEarnings();
      setMonthlyData(data);
    };

    fetchOrders();
    fetchMonthly();
  }, [user]);

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const grossEarnings = completedOrders.reduce(
    (sum, order) => sum + order.price,
    0
  );

  const platformFee = grossEarnings * PLATFORM_COMMISSION;
  const netEarnings = grossEarnings - platformFee;

  const getStatusColor = (status) => {
    if (status === "completed") return "#10b981";
    if (status === "in-progress") return "#f59e0b";
    return "#6b7280";
  };

  const monthNames = [
    "",
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const chartData = {
    labels: monthlyData.map((m) => monthNames[m._id]),
    datasets: [
      {
        label: "Monthly Earnings",
        data: monthlyData.map((m) => m.total),
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

        <div style={{ display: "flex", gap: "25px" }}>
          <button style={navBtn} onClick={() => navigate("/freelancer/dashboard")}>
            Dashboard
          </button>
          <button style={navBtn} onClick={() => navigate("/freelancer/my-gigs")}>
            My Gigs
          </button>
          <button style={logoutBtn} onClick={() => {
            localStorage.removeItem("userInfo");
            navigate("/login");
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== HEADER ===== */}
      <section style={heroSection}>
        <h1 style={heroTitle}>Orders & Earnings</h1>
        <p style={heroSub}>
          Track all received orders and your revenue.
        </p>
      </section>

      {/* ===== SUMMARY ===== */}
      <section style={summarySection}>
        <SummaryCard title="Gross Earnings" value={`₹${grossEarnings}`} />
        <SummaryCard title="Platform Fee (10%)" value={`₹${platformFee}`} />
        <SummaryCard title="Net Earnings" value={`₹${netEarnings}`} highlight />
      </section>

      {/* ===== ORDERS LIST ===== */}
      <section style={section}>
        <h2 style={sectionTitle}>Orders Received</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div style={emptyState}>
            <h3>No Orders Yet</h3>
            <p style={{ color: "#6b7280" }}>
              Once a client places an order, it will appear here.
            </p>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order._id} style={orderRow}>
                <div>
                  <strong>{order.gig?.title}</strong>
                  <p style={{ fontSize: "13px", color: "#6b7280" }}>
                    Client: {order.buyer?.name}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: "600" }}>
                    ₹{order.price}
                  </p>

                  <span
                    style={{
                      fontSize: "13px",
                      color: getStatusColor(order.status),
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    {order.status}
                  </span>

                  {/* 👉 CHAT BUTTON */}
                  <button
                    onClick={() => navigate(`/chat/${order.buyer?._id}`)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: "none",
                      background: "#4f46e5",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Chat
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== MONTHLY GRAPH ===== */}
      {monthlyData.length > 0 && (
        <section style={section}>
          <h2 style={sectionTitle}>Monthly Earnings</h2>
          <div style={graphBox}>
            <Bar data={chartData} />
          </div>
        </section>
      )}
    </div>
  );
};

/* ===== SMALL COMPONENTS ===== */

const SummaryCard = ({ title, value, highlight }) => (
  <div style={{
    ...summaryCard,
    color: highlight ? "#10b981" : "black"
  }}>
    <p style={{ fontSize: "14px", color: "#6b7280" }}>{title}</p>
    <h2>{value}</h2>
  </div>
);

/* ===== STYLES ===== */

const pageStyle = {
  minHeight: "100vh",
  background: "#f9fafb",
};

const navbar = {
  background: "white",
  padding: "18px 60px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
};

const navBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
};

const logoutBtn = {
  background: "#ef4444",
  border: "none",
  color: "white",
  padding: "6px 16px",
  borderRadius: "20px",
  cursor: "pointer",
};

const heroSection = {
  padding: "60px 80px 20px 80px",
};

const heroTitle = {
  fontSize: "34px",
};

const heroSub = {
  marginTop: "10px",
  color: "#6b7280",
};

const summarySection = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "25px",
  padding: "30px 80px",
};

const summaryCard = {
  background: "white",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

const section = {
  padding: "40px 80px",
};

const sectionTitle = {
  marginBottom: "20px",
};

const orderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 0",
  borderBottom: "1px solid #e5e7eb",
};

const emptyState = {
  background: "white",
  padding: "40px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

const graphBox = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

export default Orders;
