import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import loginImg from "../assets/login-illustration.png";
import "../index.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    if (loading) return; // prevent double click

    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      console.log("Login Response:", response); // DEBUG

      if (response && response.token) {
        // Save user
        localStorage.setItem("userInfo", JSON.stringify(response));

        // Role based redirect
        if (response.role === "client") {
          navigate("/client/dashboard");
        } 
        else if (response.role === "freelancer") {
          navigate("/freelancer/dashboard");
        } 
        else if (response.role === "admin") {
          navigate("/admin/dashboard");
        } 
        else {
          alert("Unknown role");
        }

      } else {
        alert(response?.message || "Login failed");
      }

    } catch (err) {
      console.error("Login Error:", err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* IMAGE SIDE */}
        <div className="auth-image">
          <img src={loginImg} alt="Login illustration" />
        </div>

        {/* FORM SIDE */}
        <div className="auth-form">
          <h2>Welcome back</h2>
          <p>Please login to your account</p>

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
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="link-text">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")}>
              Sign up
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
