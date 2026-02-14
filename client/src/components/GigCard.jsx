import { useNavigate } from "react-router-dom";
import laptopImg from "../assets/hero-laptop.jpg"; // 👈 your image name

const GigCard = ({ gig }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo")); // ✅ ADDED

  return (
    <div className="premium-gig-card" style={card}>
      
      {/* IMAGE */}
      <div className="gig-image-wrapper" style={imageWrapper}>
        <img
          src={gig.images?.[0] || laptopImg}
          alt={gig.title}
          className="gig-image"
          style={image}
        />

        <div className="rating-badge" style={ratingBadge}>
          ⭐ {gig.rating || "4.8"}
        </div>
      </div>

      {/* BODY */}
      <div className="gig-content" style={content}>
        <h3 className="gig-title" style={title}>{gig.title}</h3>

        <p className="gig-description" style={desc}>
          {gig.description?.slice(0, 90)}...
        </p>

        <div className="gig-meta-row" style={metaRow}>
          <span className="gig-category" style={category}>
            {gig.category}
          </span>

          <span className="gig-price" style={price}>
            ₹{gig.price}
          </span>
        </div>

        <p className="gig-seller" style={seller}>
          By {gig.user?.name}
        </p>

        {/* BUTTON ROW */}
        <div style={buttonRow}>
          <button
            className="view-button"
            style={viewBtn}
            onClick={() => navigate(`/gigs/${gig._id}`)}
          >
            View Details
          </button>

          {/* ✅ EDIT BUTTON */}
          {user &&
            (user._id === gig.user?._id || user.role === "admin") && (
              <button
                className="edit-button"
                style={editBtn}
                onClick={() => navigate(`/edit-gig/${gig._id}`)}
              >
                ✏️ Edit
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

/* ---------- INLINE STYLES ---------- */

const card = {
  background: "#fff",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
};

const imageWrapper = {
  position: "relative",
};

const image = {
  width: "100%",
  height: 200,
  objectFit: "cover",
};

const ratingBadge = {
  position: "absolute",
  top: 12,
  right: 12,
  background: "#fff",
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
};

const content = {
  padding: 16,
};

const title = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 6,
};

const desc = {
  fontSize: 14,
  color: "#555",
  marginBottom: 10,
};

const metaRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
};

const category = {
  background: "#eef2ff",
  color: "#4f46e5",
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
};

const price = {
  fontWeight: 600,
};

const seller = {
  fontSize: 13,
  color: "#777",
  marginBottom: 12,
};

const buttonRow = {
  display: "flex",
  gap: 10,
};

const viewBtn = {
  flex: 1,
  padding: "10px 0",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 500,
};

const editBtn = {
  padding: "10px 14px",
  background: "#f3f4f6",
  color: "#111",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 500,
};

export default GigCard;
