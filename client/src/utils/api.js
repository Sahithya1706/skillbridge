const API_URL = "https://skillbridge-backend-hz7v.onrender.com/api";

/* ---------------- AUTH ---------------- */

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* ---------------- GIGS ---------------- */

export const createGig = async (data) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/gigs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const fetchGigs = async () => {
  const res = await fetch(`${API_URL}/gigs`);
  return res.json();
};

export const fetchGigById = async (id) => {
  const res = await fetch(`${API_URL}/gigs/${id}`);
  return res.json();
};

export const fetchMyGigs = async () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/gigs/my`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};

export const deleteGig = async (id) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/gigs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};

/* ---------------- ORDERS ---------------- */

export const createOrder = async (data) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

/* ---------------- REVIEWS ---------------- */

export const fetchReviews = async (gigId) => {
  const res = await fetch(`${API_URL}/reviews/${gigId}`);
  return res.json();
};

export const createReview = async (data) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user || !user.token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};



/* ---------------- DASHBOARD ---------------- */

export const fetchFreelancerDashboard = async () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/dashboard/freelancer`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};

export const fetchMonthlyEarnings = async () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(
    `${API_URL}/dashboard/freelancer/monthly-earnings`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  return res.json();
};

/* ---------------- UPDATE ORDER STATUS ---------------- */

export const updateOrderStatus = async (id, status) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({ status }),
  });

  return res.json();
};

/* ---------------- ADMIN ---------------- */

export const fetchAdminDashboard = async () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};

export const fetchAllUsers = async () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};

export const toggleBanUser = async (id) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/admin/users/${id}/ban`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};

export const fetchAllGigsAdmin = async () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/admin/gigs`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};

export const deleteGigAdmin = async (id) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/admin/gigs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};
  
export const getGigById = async (id) => {
  const res = await fetch(`${API_URL}/gigs/${id}`);
  return res.json();
};

export const updateGig = async (id, data) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/gigs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// 🧑‍💼 ADMIN - FETCH ALL REVIEWS
export const fetchAllReviewsAdmin = async () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const res = await fetch(`${API_URL}/reviews`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return res.json();
};

