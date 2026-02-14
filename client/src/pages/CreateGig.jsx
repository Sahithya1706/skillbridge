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
    files: null,
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

      // ✅ FORM DATA
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);

      // ✅ FILE UPLOAD
      if (form.files) {
        Array.from(form.files).forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await createGig(formData);

      if (response._id) {
        alert("Gig created successfully 🎉");
        navigate("/freelancer/my-gigs");
      } else {
        setError(response.message || "Failed to create gig");
      }
    } catch (err) {
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

          {/* ✅ IMAGE UPLOAD */}
          <input
            type="file"
            multiple
            accept="image/*"
            style={{
              marginBottom: "18px",
              padding: "12px",
              border: "2px dashed #c7d2fe",
              borderRadius: "12px",
              background: "#f9fafb",
              cursor: "pointer",
            }}
            onChange={(e) =>
              setForm({ ...form, files: e.target.files })
            }
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
