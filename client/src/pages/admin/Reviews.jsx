import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();
      setReviews(data);
    };

    fetchReviews();
  }, []);

  return (
    <AdminLayout>
      <h1 style={title}>All Reviews</h1>

      {reviews.length === 0 ? (
        <p>No reviews found</p>
      ) : (
        <div style={list}>
          {reviews.map((r) => (
            <div key={r._id} style={card}>
              <p style={{ fontWeight: "bold" }}>⭐ {r.rating}</p>
              <p>{r.comment}</p>
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

export default AdminReviews;
