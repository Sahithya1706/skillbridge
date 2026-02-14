import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        const res = await fetch(
          "https://skillbridge-backend-hz7v.onrender.com/api/reviews",
          {
            headers: {
              Authorization: `Bearer ${user.token}`, // ✅ IMPORTANT
            },
          }
        );

        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <AdminLayout>
      <h1 style={title}>All Reviews</h1>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found</p>
      ) : (
        <div style={list}>
          {reviews.map((r) => (
            <div key={r._id} style={card}>
              <p style={{ fontWeight: "bold" }}>
                ⭐ {r.rating} / 5
              </p>

              <p>{r.comment}</p>

              {r.buyer && (
                <p style={meta}>
                  Buyer: <b>{r.buyer.name}</b>
                </p>
              )}

              {r.seller && (
                <p style={meta}>
                  Seller: <b>{r.seller.name}</b>
                </p>
              )}

              {r.gig && (
                <p style={meta}>
                  Gig: <b>{r.gig.title}</b>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

/* styles */
const title = {
  fontSize: 28,
  marginBottom: 20,
};

const list = {
  display: "grid",
  gap: 20,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
};

const meta = {
  fontSize: 14,
  color: "#555",
  marginTop: 6,
};

export default AdminReviews;
