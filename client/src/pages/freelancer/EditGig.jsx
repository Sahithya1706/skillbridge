import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGigById, updateGig } from "../../utils/api";
import "../../index.css";

const EditGig = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await getGigById(id);

        // 🔹 handle both response types
        const gig = res.gig || res;

        if (!gig) {
          setError("Gig not found");
          return;
        }

        setForm({
          title: gig.title || "",
          description: gig.description || "",
          price: gig.price || "",
          category: gig.category || "",
          images: gig.images ? gig.images.join(", ") : "",
        });
      } catch (err) {
        setError("Failed to load gig");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

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
      const response = await updateGig(id, {
        ...form,
        images: form.images
          ? form.images.split(",").map((img) => img.trim())
          : [],
      });

      if (response._id || response.gig) {
        alert("Gig updated successfully ✨");
        navigate("/freelancer/my-gigs");
      } else {
        setError("Update failed");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  // 🔹 loading UI (prevents blank screen)
  if (loading) {
    return <p style={{ padding: "40px" }}>Loading gig...</p>;
  }

  // 🔹 error UI
  if (error) {
    return (
      <p style={{ padding: "40px", color: "red" }}>
        {error}
      </p>
    );
  }

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
          Edit Gig
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Gig Title"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Gig Description"
            style={{ height: "120px" }}
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
          />

          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="Image URLs (comma separated)"
          />

          <button type="submit">Update Gig</button>
        </form>
      </div>
    </div>
  );
};

export default EditGig;
