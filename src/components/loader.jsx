import "./loader.css";

function Loader() {
  return (
    // <div className="loader-overlay">
    //   <div className="spinner"></div>
    //   <p>Loading...</p>
    // </div>
    <div className="loader-container">
      <img src="/MB-logo.png" alt="Loading..." className="loader-icon" />
    </div>
  );
}

export default Loader;
