import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, [token]);

  const toggleBan = async (id) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}/ban`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(
      users.map((u) =>
        u._id === id ? { ...u, isBanned: !u.isBanned } : u
      )
    );
  };

  return (
    <AdminLayout>
      <h1 style={title}>Users Management</h1>
      <p style={subtitle}>View and control platform users</p>

      <div style={tableWrap}>
        <div style={tableHead}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {users.map((u) => (
          <div key={u._id} style={row}>
            <span>{u.name}</span>
            <span>{u.email}</span>
            <span>{u.role}</span>
            <span style={{ color: u.isBanned ? "#dc2626" : "#16a34a" }}>
              {u.isBanned ? "Banned" : "Active"}
            </span>
            <button
              style={u.isBanned ? unbanBtn : banBtn}
              onClick={() => toggleBan(u._id)}
            >
              {u.isBanned ? "Unban" : "Ban"}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

/* ================= STYLES ================= */

const title = {
  fontSize: 28,
  marginBottom: 6,
};

const subtitle = {
  color: "#6b7280",
  marginBottom: 30,
};

const tableWrap = {
  background: "white",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};

const tableHead = {
  display: "grid",
  gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr",
  padding: "16px",
  background: "#f3f4f6",
  fontWeight: "bold",
};

const row = {
  display: "grid",
  gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr",
  padding: "16px",
  borderTop: "1px solid #e5e7eb",
  alignItems: "center",
};

const banBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 14px",
  borderRadius: 20,
  cursor: "pointer",
};

const unbanBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "6px 14px",
  borderRadius: 20,
  cursor: "pointer",
};

export default AdminUsers;
