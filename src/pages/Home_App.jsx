import { useState, useEffect } from 'react'
import './Home.css'
import Loader from '../components/loader';   // 👈 ADDED
import { useNavigate } from 'react-router-dom';
import { CartProvider } from '../components/cartContext';

const items = [
  { id: 1, name: "Thunder Hose Pipe", hasSizes:true, image: "/thunder_hose_pipe.png" },
  { id: 2, name: "Canvas Hose Pipes", hasSizes:false, image: "/canvas_hose_pipe.png" },
  { id: 3, name: "Section Pipes", hasSizes:true, image: "/section-pipe.png" },
  { id: 4, name: "Butyl Water Proofing Tapes for ceiling(SHED) repairs", hasSizes:true, image: "/butyl-waterproofing-tape.png" },
  { id: 5, name: "Tractor Pumps", hasSizes:false, image: "/tractor-pump.png" },
  { id: 6, name: "Water Circulation Pumps", hasSizes:false, image: "/water-circulation-pump.png" },
  { id: 7, name: "Rubber Flange Washers", hasSizes:false, image: "/rubber-flange-washer.png" },
  { id: 8, name: "Square CI Flanges", hasSizes:false, image: "/square-ci-flange.png" },
  { id: 9, name: "Round CI Flanges", hasSizes:true, image: "/round-ci-flange.png" },
  { id: 10, name: "Bends", hasSizes:true, image: "/bend.png" },
  { id: 11, name: "Grove Bends", hasSizes:false, image: "/grove-bend.png" },
  { id: 12, name: "CI Hose Collars", hasSizes:true, image: "/ci-hose-collar.png" },
  { id: 14, name: "Hose Clamps", hasSizes:false, image: "/hose-clamp.png" },
  { id: 15, name: "Worm Drive Clamps", hasSizes:true, image: "/worm-drive-clamp.png" },
  { id: 16, name: "All Agriculture Pipe Clamps", hasSizes:false, image: "/all-agriculture-pipe-clamp.png" },
  { id: 17, name: "Niko Clamps", hasSizes:false, image: "/niko-clamp.png" },
  { id: 18, name: "CPVC Clamps", hasSizes:false, image: "/cpvc-clamp.png" },
  { id: 19, name: "Nail Clamps", hasSizes:true, image: "/nail-clamp.png" },
  { id: 20, name: "Agriculture Pump Foot Valves CI", hasSizes:false, image: "/agriculture-pump-foot-valve-ci.png" },
  { id: 21, name: "Ball Model A/T N.R. Valves", hasSizes:true, image: "/Ball-Model-A.T-N.R-Valves-1.png" }
  
];

function Home({ searchTerm }) {

  // 👇 LOADING STATE ADDED
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    // simulate network / image load delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);          // 0.3 sec – good UX

    return () => clearTimeout(timer);
  }, []);

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

      // 2. Scroll to the item
      // We use a tiny timeout to ensure the DOM is ready
      setTimeout(() => {
        const element = document.getElementById(`product-${foundItem.id}`);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center", // Moves the found item to the middle of the screen
          });
        }
      }, 100);
    } else {
      setHighlightedId(null);
    }
}, [searchTerm]);

  const navigate = useNavigate();

  const handleItemClick = (item) => {
      navigate(`/product/${item.id}`); // Redirects to size details page
  };

  if (loading) return <Loader />;

   return (
    <>
      <div className="app-content">
        <h2>Welcome to Maa Bhavani Enterprises!</h2>
        <div className="items-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", padding: "1rem" }}>
          {items.map(item => (
            <div
              key={item.id}
              id={`product-${item.id}`}
              onClick={() => handleItemClick(item)}
              className={`item-card ${highlightedId === item.id ? 'highlight' : ''}`}
              style={{
                cursor: 'pointer',
                border: highlightedId === item.id ? '3px solid orange' : '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                width: '200px',
                textAlign: 'center',
                transition: 'border 0.3s ease',
              }}
            >
              <img src={item.image} alt={item.name} style={{ width: "100%", height: "150px", objectFit: "contain" }} />
              <h3>{item.name}</h3>
            </div>
          ))}
        </div >
      </div>
    </>
  );
}

export default Home;
