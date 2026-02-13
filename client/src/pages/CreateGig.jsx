import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGig } from "../utils/api";
import "../index.css";

const CreateGig = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.price || !form.category) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const response = await createGig({
        ...form,
        images: form.images
          ? form.images.split(",").map((img) => img.trim())
          : [],
      });

      if (response._id) {
        alert("Gig created successfully 🎉");

        // ✅ FIX: redirect to My Gigs page
        navigate("/freelancer/my-gigs");
      } else {
        setError(response.message || "Failed to create gig");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "60px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          borderRadius: "18px",
          padding: "40px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ fontSize: "30px", marginBottom: "6px" }}>
          Create a New Gig
        </h2>

        <p style={{ color: "#6b7280", marginBottom: "30px" }}>
          Publish your service on SkillBridge
        </p>

        {error && (
          <p style={{ color: "red", marginBottom: "14px" }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Gig Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Gig Description"
            value={form.description}
            onChange={handleChange}
            style={{ height: "120px" }}
          />

          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category (Web, Design, Writing)"
            value={form.category}
            onChange={handleChange}
          />

          <input
            type="text"
            name="images"
            placeholder="Image URLs (comma separated)"
            value={form.images}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Gig"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;
