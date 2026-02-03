import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/loader'; 
import './home.css';

const items = [
  { id: 1, name: "Thunder Hose Pipe", hasSizes: true, image: "/thunder_hose_pipe.png" },
  { id: 2, name: "Canvas Hose Pipes", hasSizes: false, image: "/canvas_hose_pipe.png" },
  { id: 3, name: "Section Pipes", hasSizes: true, image: "/section-pipe.png" },
  { id: 4, name: "Butyl Water Proofing Tapes for ceiling(SHED) repairs", hasSizes: true, image: "/butyl-waterproofing-tape.png" },
  { id: 5, name: "Tractor Pumps", hasSizes: false, image: "/tractor-pump.png" },
  { id: 6, name: "Water Circulation Pumps", hasSizes: false, image: "/water-circulation-pump.png" },
  { id: 7, name: "Rubber Flange Washers", hasSizes: false, image: "/rubber-flange-washer.png" },
  { id: 8, name: "Square CI Flanges", hasSizes: false, image: "/square-ci-flange.png" },
  { id: 9, name: "Round CI Flanges", hasSizes: true, image: "/round-ci-flange.png" },
  { id: 10, name: "Bends", hasSizes: true, image: "/bend.png" },
  { id: 11, name: "Grove Bends", hasSizes: false, image: "/grove-bend.png" },
  { id: 12, name: "CI Hose Collars", hasSizes: true, image: "/ci-hose-collar.png" },
  { id: 14, name: "Hose Clamps", hasSizes: false, image: "/hose-clamp.png" },
  { id: 15, name: "Worm Drive Clamps", hasSizes: true, image: "/worm-drive-clamp.png" },
  { id: 16, name: "All Agriculture Pipe Clamps", hasSizes: false, image: "/all-agriculture-pipe-clamp.png" },
  { id: 17, name: "Niko Clamps", hasSizes: false, image: "/niko-clamp.png" },
  { id: 18, name: "CPVC Clamps", hasSizes: false, image: "/cpvc-clamp.png" },
  { id: 19, name: "Nail Clamps", hasSizes: true, image: "/nail-clamp.png" },
  { id: 20, name: "Agriculture Pump Foot Valves CI", hasSizes: false, image: "/agriculture-pump-foot-valve-ci.png" },
  { id: 21, name: "Ball Model A/T N.R. Valves", hasSizes: true, image: "/Ball-Model-A.T-N.R-Valves-1.png" }
];

const slideImages = [
  "/thunder_hose_pipe.png",
  "/canvas_hose_pipe.png",
  "/section-pipe.png",
  "/tractor-pump.png",
  "/agriculture-pump-foot-valve-ci.png"
];

function Home({ searchTerm, favorites, toggleFavorite }) {
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const navigate = useNavigate();

  // 1. Initial Page Load Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); 
    return () => clearTimeout(timer);
  }, []);

  // 2. Search & Scroll Logic
  useEffect(() => {
    if (!searchTerm) {
      setHighlightedId(null);
      return;
    }

    const foundItem = items.find(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    
    if (foundItem) {
      setHighlightedId(foundItem.id);

      // Scroll to the item if found
      setTimeout(() => {
        const element = document.getElementById(`product-${foundItem.id}`);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } else {
      setHighlightedId(null);
    }
  }, [searchTerm]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
    }, 4000); // Changes every 4 seconds
    return () => clearInterval(slideTimer);
  }, []);

  const handleItemClick = (item) => {
      navigate(`/product/${item.id}`); 
  };

  if (loading) return <Loader />;

  return (
  <div className="app-content">
    {/* 1. The Slider Section (Placed at the very top of content) */}
    <div className="hero-slider">
      {slideImages.map((img, index) => {
        let position = "nextSlide";
        if (index === currentSlide) {
          position = "activeSlide";
        }
        if (
          index === currentSlide - 1 ||
          (currentSlide === 0 && index === slideImages.length - 1)
        ) {
          position = "lastSlide";
        }

        return (
          <div
            key={index}
            className={`slide ${position}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        );
      })}
    <div className="hero-overlay">
    <h2 className="home-title">Welcome to Maa Bhavani Enterprises!</h2>
  </div>
</div>

    {/* 2. Your Existing Grid Section (Starts immediately after the slider) */}
    <div className="items-container">
      {items.map(item => (
        <div
          key={item.id}
          id={`product-${item.id}`}
          onClick={() => handleItemClick(item)}
          className={`item-card ${highlightedId === item.id ? 'highlight' : ''}`}
          style={{
            border: highlightedId === item.id ? '3px solid orange' : '1px solid #ccc',
            boxShadow: highlightedId === item.id ? '0 0 15px rgba(255, 165, 0, 0.5)' : 'none'
          }}
        >
          <div className="favorite-icon" onClick={(e) => {
            e.stopPropagation(); // Prevents clicking the heart from opening the product page
            toggleFavorite(item);
          }}>
            <span style={{ color: favorites.some(fav => fav.id === item.id) ? 'red' : 'gray' }}>
              {favorites.some(fav => fav.id === item.id) ? '❤️' : '🤍'}
            </span>
          </div>
          <img 
            src={item.image} 
            alt={item.name} 
            className="item-image"
          />
          <h3 className="item-name">{item.name}</h3>
        </div>
      ))}
    </div>
  </div>
);
}

export default Home;