import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("userInfo"));

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
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalSpent = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.price, 0);

  const activeOrders = orders.filter(o => o.status !== "completed").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  const getStatusStyle = (status) => {
    if (status === "completed")
      return { background: "#d1fae5", color: "#065f46" };

    if (status === "in-progress")
      return { background: "#fef3c7", color: "#92400e" };

    return { background: "#e5e7eb", color: "#374151" };
  };

  return (
    <div style={pageStyle}>
      {/* NAVBAR */}
      <div style={navbar}>
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          💼 SkillBridge
        </h2>

        <div style={{ display: "flex", gap: "20px" }}>
          <span style={navItem} onClick={() => navigate("/client/dashboard")}>
            Dashboard
          </span>
          <span style={navItem} onClick={() => navigate("/")}>
            Browse
          </span>
        </div>
      </div>

      <div style={container}>
        <h1 style={title}>My Orders</h1>

        {/* SUMMARY CARDS */}
        <div style={summaryGrid}>
          <SummaryCard title="Total Spent" value={`₹${totalSpent}`} />
          <SummaryCard title="Active Orders" value={activeOrders} />
          <SummaryCard title="Completed Orders" value={completedOrders} />
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div style={emptyBox}>
            <h3>No orders yet</h3>
            <p style={{ color: "#6b7280" }}>
              Start by browsing gigs and hiring freelancers.
            </p>
            <button style={browseBtn} onClick={() => navigate("/")}>
              Browse Gigs
            </button>
          </div>
        ) : (
          <div style={cardContainer}>
            {orders.map((order) => (
              <div key={order._id} style={orderCard}>
                <div>
                  <h3 style={gigTitle}>
                    {order.gig?.title}
                  </h3>

                  <p style={sellerText}>
                    Freelancer: {order.seller?.name}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={price}>₹{order.price}</p>

                  <span
                    style={{
                      ...statusBadge,
                      ...getStatusStyle(order.status),
                    }}
                  >
                    {order.status}
                  </span>

                  <br />

                  <button
                    style={chatBtn}
                    onClick={() =>
                      navigate(`/chat/${order.seller?._id}`)
                    }
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const SummaryCard = ({ title, value }) => (
  <div style={summaryCard}>
    <p style={{ color: "#6b7280", fontSize: "14px" }}>{title}</p>
    <h2 style={{ marginTop: "8px", color: "#4f46e5" }}>{value}</h2>
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
};

const container = {
  maxWidth: "1000px",
  margin: "60px auto",
  padding: "0 20px",
};

const title = {
  fontSize: "30px",
  marginBottom: "30px",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "40px",
};

const summaryCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const emptyBox = {
  background: "white",
  padding: "50px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const browseBtn = {
  marginTop: "20px",
  padding: "10px 20px",
  borderRadius: "30px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
};

const cardContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const orderCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

const gigTitle = {
  fontSize: "18px",
  fontWeight: "600",
};

const sellerText = {
  fontSize: "14px",
  color: "#6b7280",
};

const price = {
  fontSize: "16px",
  fontWeight: "bold",
};

const statusBadge = {
  display: "inline-block",
  marginTop: "6px",
  padding: "4px 12px",
  fontSize: "12px",
  borderRadius: "20px",
};

const chatBtn = {
  marginTop: "10px",
  padding: "6px 14px",
  borderRadius: "20px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
};

export default Orders;
