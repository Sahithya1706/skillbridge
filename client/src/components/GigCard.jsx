import { useNavigate } from "react-router-dom";
import laptopImg from "../assets/hero-laptop.jpg"; // 👈 your image name

const GigCard = ({ gig }) => {
  const navigate = useNavigate();

  return (
    <div className="premium-gig-card">
      
      {/* IMAGE */}
      <div className="gig-image-wrapper">
        <img
          src={gig.images?.[0] || laptopImg}
          alt={gig.title}
          className="gig-image"
        />

        <div className="rating-badge">
          ⭐ {gig.rating || "4.8"}
        </div>
      </div>

      {/* BODY */}
      <div className="gig-content">
        <h3 className="gig-title">{gig.title}</h3>

        <p className="gig-description">
          {gig.description?.slice(0, 90)}...
        </p>

        <div className="gig-meta-row">
          <span className="gig-category">
            {gig.category}
          </span>

          <span className="gig-price">
            ₹{gig.price}
          </span>
        </div>

        <p className="gig-seller">
          By {gig.user?.name}
        </p>

        <button
          className="view-button"
          onClick={() => navigate(`/gigs/${gig._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default GigCard;
