import React, { useState, useEffect } from "react";
import Loader from "./loader";
import "./about.css";

function About() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);   // 300–600ms rule
  }, []);

  return (
    <div className="about-container">

      {loading && <Loader />}

      <div className="about-card">
        <h2> <b>Maa Bhavani Enterprises </b> </h2>
        <p>
          <i> Established since </i> : 1975 <br/>
          <i>Location </i>: Ranigunj <br/>
          near Lalagudi Temple <br/>
          Secunderabad 500003 <br/>
          Telangana, India <br/>
          Lala Commercial complex, shop no. 14, shiva temple <br/><br/>

          <b>Agricultural purpose valves and fittings ci, gi, pvc and brass,  
          all types of fittings useful to farmers in fields.</b>
        </p>
      </div>

    </div>
  );
}

export default About;
