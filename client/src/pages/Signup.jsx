import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerUser } from "../utils/api";
import signupImg from "../assets/login-illustration.png";
import "../index.css";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 URL se role aaye to set ho jaye
  useEffect(() => {
    const selectedRole = searchParams.get("role");
    if (selectedRole) setRole(selectedRole);
  }, [searchParams]);

  // 🔹 SIGNUP HANDLER
  const handleSignup = async () => {
    if (!name || !email || !password || !role) {
      alert("Please fill all fields and select role");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name,
        email,
        password,
        role,
      });

      if (response.token) {
        localStorage.setItem("userInfo", JSON.stringify(response));
        navigate("/");
      } else {
        alert(response.message || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LEFT IMAGE */}
        <div className="auth-image">
          <img src={signupImg} alt="Signup illustration" />
        </div>

        {/* RIGHT FORM */}
        <div className="auth-form">
          <h2>Create account</h2>
          <p>Select your role to continue</p>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ROLE BUTTONS */}
          <div className="role-box">
            <button
              type="button"
              className={`role-btn ${role === "client" ? "active" : ""}`}
              onClick={() => setRole("client")}
            >
              Client
            </button>

            <button
              type="button"
              className={`role-btn ${role === "freelancer" ? "active" : ""}`}
              onClick={() => setRole("freelancer")}
            >
              Freelancer
            </button>
          </div>

          {/* ROLE CONFIRM TEXT */}
          {role && (
            <p
              style={{
                marginBottom: "10px",
                color: "#6366f1",
                fontWeight: "500",
                fontSize: "13px",
              }}
            >
              ✅ {role === "client" ? "Client selected" : "Freelancer selected"}
            </p>
          )}

          <button onClick={handleSignup} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="link-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
