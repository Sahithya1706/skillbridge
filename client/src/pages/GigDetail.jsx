import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchGigById,
  createOrder,
  fetchReviews,
  createReview,
} from "../utils/api";

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const gigData = await fetchGigById(id);
      const reviewData = await fetchReviews(id);
      setGig(gigData);
      setReviews(reviewData);
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const res = await createOrder({
      gigId: gig._id,
      sellerId: gig.user._id,
      price: gig.price,
    });

    if (res._id) {
      alert("Order placed successfully 🎉");
      navigate("/client/dashboard");
    }
  };

const handleReviewSubmit = async () => {
  if (!user) {
    alert("Please login first");
    return;
  }

  if (!comment.trim()) {
    alert("Please write a review");
    return;
  }

  try {
    const res = await createReview({
      gigId: gig._id,
      rating,
      comment,
    });

    if (res._id) {
      setReviews([...reviews, res]);
      setComment("");
      setRating(5);
    } else {
      alert(res.message || "Review failed");
    }
  } catch (err) {
    alert(err.message || "Something went wrong while submitting review");
  }
};


  if (loading) return <p style={center}>Loading...</p>;
  if (!gig) return <p style={center}>Gig not found</p>;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <>
      {/* NAVBAR */}
      <div style={navbar}>
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          SkillBridge
        </h2>

        <div>
          {!user ? (
            <>
              <button style={navBtn} onClick={() => navigate("/login")}>
                Login
              </button>
              <button
                style={navBtnOutline}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <button
                style={navBtn}
                onClick={() =>
                  navigate(
                    user.role === "freelancer"
                      ? "/freelancer/dashboard"
                      : "/client/dashboard"
                  )
                }
              >
                Dashboard
              </button>

              <button
                style={navBtnOutline}
                onClick={() => {
                  localStorage.removeItem("userInfo");
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* PAGE */}
      <div style={page}>
        <div style={container}>
          <p style={back} onClick={() => navigate(-1)}>
            ← Back to gigs
          </p>

          <h1 style={title}>{gig.title}</h1>

          {averageRating && (
            <p style={ratingStyle}>
              ⭐ {averageRating} ({reviews.length} reviews)
            </p>
          )}

          <div style={grid}>
            {/* LEFT */}
            <div>
              <div style={card}>
                <span style={category}>{gig.category}</span>
                <h3>Description</h3>
                <p style={description}>{gig.description}</p>
              </div>

              <div style={card}>
                <h3>About the Freelancer</h3>
                <p><strong>{gig.user?.name}</strong></p>
                <p style={{ color: "#6b7280" }}>{gig.user?.email}</p>
              </div>

              <div style={card}>
                <h3>Customer Reviews</h3>

                {reviews.length === 0 ? (
                  <p style={{ color: "#6b7280" }}>No reviews yet</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} style={reviewRow}>
                      <strong>{r.user?.name}</strong>
                      <div style={{ color: "#f59e0b" }}>
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </div>
                      <p style={{ color: "#6b7280" }}>{r.comment}</p>
                    </div>
                  ))
                )}
              </div>

              <div style={card}>
                <h3>Leave a Review</h3>

                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={input}
                >
                  <option value={5}>★★★★★</option>
                  <option value={4}>★★★★</option>
                  <option value={3}>★★★</option>
                  <option value={2}>★★</option>
                  <option value={1}>★</option>
                </select>

                <textarea
                  placeholder="Write your feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={textarea}
                />

                <button style={reviewBtn} onClick={handleReviewSubmit}>
                  Submit Review
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div style={priceCard}>
              <h2>₹{gig.price}</h2>
              <button style={purchaseBtn} onClick={handlePurchase}>
                Continue & Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ================= STYLES ================= */

const center = {
  padding: 100,
  textAlign: "center",
};

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
  marginRight: 10,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
};

const navBtnOutline = {
  padding: "8px 18px",
  borderRadius: 20,
  border: "1px solid #4f46e5",
  background: "white",
  color: "#4f46e5",
  cursor: "pointer",
};

const page = {
  background: "#f9fafb",
  minHeight: "100vh",
  padding: "40px 20px",
};

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const back = {
  color: "#4f46e5",
  cursor: "pointer",
  marginBottom: 20,
};

const title = {
  fontSize: 34,
  marginBottom: 8,
};

const ratingStyle = {
  color: "#6b7280",
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 30,
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 14,
  marginBottom: 30,
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};

const category = {
  display: "inline-block",
  background: "#eef2ff",
  padding: "6px 14px",
  borderRadius: 20,
  color: "#4f46e5",
  marginBottom: 10,
};

const description = {
  color: "#374151",
  lineHeight: 1.6,
};

const priceCard = {
  background: "white",
  padding: 30,
  borderRadius: 16,
  height: "fit-content",
  position: "sticky",
  top: 100,
  boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
};

const purchaseBtn = {
  width: "100%",
  marginTop: 20,
  padding: "14px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: 30,
  fontSize: 16,
  cursor: "pointer",
};

const reviewRow = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px 0",
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
};

const textarea = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  marginBottom: 10,
};

const reviewBtn = {
  padding: "10px 24px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: 20,
  cursor: "pointer",
};

export default GigDetail;
