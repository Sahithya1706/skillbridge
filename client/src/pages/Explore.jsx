import { useEffect, useState } from "react";
import { fetchGigs } from "../utils/api";
import GigCard from "../components/GigCard";

const Explore = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGigs = async () => {
      try {
        const data = await fetchGigs();
        setGigs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadGigs();
  }, []);

  return (
    <div className="gig-section">
      <h2>Explore Gigs</h2>

      {loading ? (
        <p>Loading gigs...</p>
      ) : gigs.length === 0 ? (
        <p>No gigs found</p>
      ) : (
        <div className="gig-grid">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
