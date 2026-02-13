import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGigs } from "../utils/api";
import GigCard from "../components/GigCard";

// 🔥 HERO IMAGE
import heroImg from "../assets/hero-freelancer.png";

// 🔥 CATEGORY IMAGES
import webImg from "../assets/category-web.png";
import designImg from "../assets/category-design.png";
import writingImg from "../assets/category-writing.png";
import marketingImg from "../assets/category-marketing.png";

// 🔥 HOW IT WORKS IMAGES
import postGigImg from "../assets/post-gig.png";
import hireFreelancerImg from "../assets/hire-freelancer.png";
import workDoneImg from "../assets/work-done.png";

import "../index.css";

const Home = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  };

  // 📦 FETCH GIGS
  useEffect(() => {
    const loadGigs = async () => {
      try {
        const data = await fetchGigs();
        setGigs(data);
        setFilteredGigs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadGigs();
  }, []);

  // 🔍 SEARCH + FILTER
  useEffect(() => {
    let result = gigs;

    if (search) {
      result = result.filter((gig) =>
        gig.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter((gig) => gig.category === category);
    }

    setFilteredGigs(result);
  }, [search, category, gigs]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        <h2>💼SkillBridge</h2>

        <div className="nav-actions">
          {!userInfo ? (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button className="signup" onClick={() => navigate("/signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  navigate(
                    userInfo.role === "client"
                      ? "/client/dashboard"
                      : "/freelancer/dashboard"
                  )
                }
              >
                Dashboard
              </button>
              <button className="signup" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>

{/* ================= HERO ================= */}
<section className="hero">
  <div className="hero-left">

    {/* 👋 Logged In Greeting */}
    {userInfo ? (
      <>
        <h1>
          Welcome back, <span style={{ color: "#4f46e5" }}>
            {userInfo.name}
          </span> 👋
        </h1>

        {/* Role Based Text */}
        {userInfo.role === "client" && (
          <p>
            Ready to hire top freelancers? Browse gigs and manage your
            projects easily from your dashboard.
          </p>
        )}

        {userInfo.role === "freelancer" && (
          <p>
            Check your orders, manage your gigs and track your earnings
            from your freelancer dashboard.
          </p>
        )}

        {userInfo.role === "admin" && (
          <p>
            Monitor platform growth, manage users and control the system
            from your admin dashboard.
          </p>
        )}

        <div className="hero-buttons">
          <button
            onClick={() =>
              navigate(
                userInfo.role === "client"
                  ? "/client/dashboard"
                  : userInfo.role === "freelancer"
                  ? "/freelancer/dashboard"
                  : "/admin/dashboard"
              )
            }
          >
            Go to Dashboard
          </button>
        </div>
      </>
    ) : (
      <>
        {/* 👤 Guest View */}
        <h1>
          Find the right <br /> freelancer for your work
        </h1>

        <p>
          SkillBridge connects clients with verified freelancers across web,
          design, writing, and more.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/signup?role=client")}>
            Hire Freelancers
          </button>
          <button
            className="secondary"
            onClick={() => navigate("/signup?role=freelancer")}
          >
            Become a Freelancer
          </button>
        </div>
      </>
    )}

  </div>

  <div className="hero-right">
    <img src={heroImg} alt="Freelancer illustration" />
  </div>
</section>


      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="gig-section">
        <h2>Popular Categories</h2>

        <div className="gig-grid">
          {[
            { title: "Web Development", img: webImg },
            { title: "Design", img: designImg },
            { title: "Writing", img: writingImg },
            { title: "Marketing", img: marketingImg },
          ].map((cat) => (
            <div key={cat.title} className="gig-card category-card">
              <img src={cat.img} alt={cat.title} className="category-img" />
              <div className="gig-card-body">
                <h3>{cat.title}</h3>
                <p className="gig-desc">
                  Top freelancers available in {cat.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">
        <h2>How SkillBridge Works</h2>

        <div className="how-grid">
          <div className="how-card">
            <img src={postGigImg} alt="Post a gig" />
            <h3>1. Post a Gig</h3>
            <p>Tell us what service you need</p>
          </div>

          <div className="how-card">
            <img src={hireFreelancerImg} alt="Hire freelancer" />
            <h3>2. Hire Freelancer</h3>
            <p>Choose the best talent</p>
          </div>

          <div className="how-card">
            <img src={workDoneImg} alt="Get work done" />
            <h3>3. Get Work Done</h3>
            <p>Pay securely after completion</p>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="gig-section">
        <h2>What our users say</h2>

        <div className="gig-grid">
          <div className="gig-card">
            <div className="gig-card-body">
              <p className="gig-desc">
                “SkillBridge helped me find clients quickly and grow my income.”
              </p>
              <strong>— Freelancer</strong>
            </div>
          </div>

          <div className="gig-card">
            <div className="gig-card-body">
              <p className="gig-desc">
                “Amazing freelancers and smooth hiring process.”
              </p>
              <strong>— Client</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE GIGS (LOGIN ONLY) ================= */}
      {userInfo && (
        <section className="gig-section">
          <h2>Explore Gigs</h2>

          <div className="filters">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
            </select>
          </div>

          {loading ? (
            <p className="status-text">Loading gigs...</p>
          ) : filteredGigs.length === 0 ? (
            <p className="status-text">No gigs found</p>
          ) : (
            <div className="gig-grid">
              {filteredGigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div>
          <h3>SkillBridge</h3>
          <p>Connecting talent with opportunity.</p>
        </div>

        <ul>
          <li>About</li>
          <li>Careers</li>
          <li>Support</li>
        </ul>

        <ul>
          <li>Terms</li>
          <li>Privacy</li>
          <li>Contact</li>
        </ul>
      </footer>
    </>
  );
};

export default Home;
