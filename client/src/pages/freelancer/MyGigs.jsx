import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyGigs, deleteGig } from "../../utils/api";

const MyGigs = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "freelancer") {
      navigate("/login");
      return;
    }

    loadGigs();
  }, []);

  const loadGigs = async () => {
    const data = await fetchMyGigs();
    setMyGigs(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gig?")) return;

    await deleteGig(id);
    loadGigs();
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

          <button style={navBtn} onClick={() => navigate("/freelancer/orders")}>
            Orders
          </button>

          <button style={logoutBtn} onClick={() => {
            localStorage.removeItem("userInfo");
            navigate("/login");
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== PAGE HEADER ===== */}
      <section style={heroSection}>
        <div>
          <h1 style={heroTitle}>My Gigs</h1>
          <p style={heroSub}>
            Manage your services and track performance.
          </p>
        </div>

        <button
          onClick={() => navigate("/freelancer/create-gig")}
          style={createButton}
        >
          + Create Gig
        </button>
      </section>

      {/* ===== CONTENT ===== */}
      <section style={contentSection}>
        {loading ? (
          <p>Loading...</p>
        ) : myGigs.length === 0 ? (
          <div style={emptyState}>
            <h3>No Gigs Created Yet</h3>
            <p style={{ color: "#6b7280" }}>
              Start by creating your first gig to offer services.
            </p>
            <button
              style={emptyButton}
              onClick={() => navigate("/freelancer/create-gig")}
            >
              Create Your First Gig
            </button>
          </div>
        ) : (
          <div style={grid}>
            {myGigs.map((gig) => (
              <div key={gig._id} style={card}>
                
                {gig.images?.length > 0 && (
                  <img
                    src={gig.images[0]}
                    alt="gig"
                    style={image}
                  />
                )}

                <div style={{ padding: "20px" }}>
                  <h3 style={{ marginBottom: "6px" }}>
                    {gig.title}
                  </h3>

                  <span style={badge}>
                    {gig.category}
                  </span>

                  <p style={price}>₹{gig.price}</p>

                  <p style={earnings}>
                    Earnings: ₹{gig.earnings}
                  </p>

                  <p style={orders}>
                    Orders: {gig.ordersCount}
                  </p>

                  <div style={buttonRow}>
                    <button
                      onClick={() =>
                        navigate(`/freelancer/edit-gig/${gig._id}`)
                      }
                      style={editBtn}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(gig._id)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "60px 80px 20px 80px",
};

const heroTitle = {
  fontSize: "34px",
};

const heroSub = {
  marginTop: "8px",
  color: "#6b7280",
};

const createButton = {
  background: "#6366f1",
  color: "white",
  padding: "12px 22px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
};

const contentSection = {
  padding: "40px 80px",
};

const emptyState = {
  background: "white",
  padding: "60px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

const emptyButton = {
  marginTop: "20px",
  padding: "10px 18px",
  background: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "30px",
};

const card = {
  background: "white",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  transition: "0.3s",
};

const image = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
};

const badge = {
  display: "inline-block",
  padding: "5px 12px",
  fontSize: "12px",
  background: "#e0e7ff",
  color: "#4338ca",
  borderRadius: "20px",
  marginBottom: "10px",
};

const price = {
  fontWeight: "600",
  marginTop: "10px",
};

const earnings = {
  fontSize: "14px",
  color: "#10b981",
};

const orders = {
  fontSize: "13px",
  color: "#6b7280",
};

const buttonRow = {
  display: "flex",
  gap: "10px",
  marginTop: "15px",
};

const editBtn = {
  flex: 1,
  background: "#6366f1",
  color: "white",
  padding: "8px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};

const deleteBtn = {
  flex: 1,
  background: "white",
  color: "#ef4444",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ef4444",
  cursor: "pointer",
};

export default MyGigs;
