import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { fetchAllGigsAdmin, deleteGigAdmin } from "../../utils/api";

const AdminGigs = () => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllGigsAdmin();
      setGigs(data);
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gig permanently?")) return;

    await deleteGigAdmin(id);
    setGigs(gigs.filter((g) => g._id !== id));
  };

  return (
    <AdminLayout>
      <h1 style={title}>Gigs Management</h1>
      <p style={subtitle}>Monitor and remove inappropriate gigs</p>

      <div style={grid}>
        {gigs.map((gig) => (
          <div key={gig._id} style={card}>
            <h3>{gig.title}</h3>
            <p>₹{gig.price}</p>
            <p style={{ color: "#6b7280" }}>
              Freelancer: {gig.user?.name}
            </p>

            <button
              style={deleteBtn}
              onClick={() => handleDelete(gig._id)}
            >
              Delete Gig
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

/* ===== styles ===== */

const title = { fontSize: 28, marginBottom: 4 };
const subtitle = { color: "#6b7280", marginBottom: 30 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 24,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

const deleteBtn = {
  marginTop: 14,
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: 20,
  cursor: "pointer",
};

export default AdminGigs;
