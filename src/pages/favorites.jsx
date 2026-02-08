import { useNavigate } from 'react-router-dom';

const Favorites = ({ favorites , removeFromFavorites}) => {
  const navigate = useNavigate();

  return (
    <div className="app-content">
      {/* Title section with styling adjustment */}
      <div style={{ padding: '20px 0', textAlign: 'center' }}>
        <h2 className="item-name" style={{ fontSize: '1.5rem' }}>Your Favorites ❤️</h2>
      </div>

      <div className="items-container">
        {favorites.length === 0 ? (
          <div className="no-favorites">
            <p>No items selected as favorites yet.</p>
            <button 
              onClick={() => navigate('/')}
              style={{marginTop: '15px', padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer'}}
            >
              Go to Home
            </button>
          </div>
        ) : (
          favorites.map(item => (
            <div 
              key={item.id} 
              className="item-card" 
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.image} alt={item.name} className="item-image" />
              <h3 className="item-name">{item.name}</h3>
              {/*Remove Button */}
              <button 
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents navigating to product page
                  removeFromFavorites(item.id);
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;