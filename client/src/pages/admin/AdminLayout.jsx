import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  // ✅ Redirect logic SAFE place
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null; // render nothing until redirect
  }

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <div style={navbar}>
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          🔐 SkillBridge <span style={{ fontWeight: 400 }}>(Admin)</span>
        </h2>

        <div>
          <button style={navBtn} onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </button>
          <button style={navBtn} onClick={() => navigate("/admin/users")}>
            Users
          </button>
          <button style={navBtn} onClick={() => navigate("/admin/gigs")}>
            Gigs
          </button>
          <button style={navBtn} onClick={() => navigate("/admin/reviews")}>
            Reviews
          </button>
          <button style={logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={page}>{children}</div>
    </>
  );
};

/* ================= STYLES ================= */

const navbar = {
  height: "70px",
  background: "white",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 40px",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const navBtn = {
  marginRight: 15,
  background: "transparent",
  border: "none",
  fontSize: 15,
  cursor: "pointer",
};

const logoutBtn = {
  padding: "8px 18px",
  borderRadius: 20,
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};

const page = {
  background: "#f9fafb",
  minHeight: "calc(100vh - 70px)",
  padding: "40px",
};

export default AdminLayout;
