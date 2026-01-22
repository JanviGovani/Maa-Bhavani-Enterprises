import React, { useState, useEffect } from "react";
import Loader from "./loader";
import "./contact.css";

function Contact() {

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  const handleSubmit = (e) => {
  e.preventDefault();
  setSubmitted(true);
  };


  return (
    <div className="contact-container">

      {loading && <Loader />}

      <div className="contact-card">

        <b>Contact number</b>

        <ul className="contact-numbers">
          <li>9652108320</li>
          <li>9652192736</li>
          <li>9949273082</li>
        </ul>

        <h3>Feedback</h3>

        {submitted ? (

        <div style={{ marginTop: "20px", fontWeight: "bold" }}>
            Thankyou! for your feedback. <br/>
            It will help us enhance your experience.
        </div>

        ) : (
            <form className="feedback-form" onSubmit={handleSubmit}>
            <label><b>Name:</b></label>
            <input
                type="text"
                pattern="[A-Za-z ]+"
                title="Only alphabets allowed"
                placeholder="Type your full-name here"
                required
            />

            <label><b>Mobile Number:</b></label>
            <input
                type="tel"
                pattern="[0-9]{10}"
                title="Enter a 10-digit mobile number"
                placeholder="Type your phone number here"
                required
            />

            <label><b>Message:</b></label>
            <textarea rows="5" placeholder="Type feedback message here" required />

            <div></div>

            <button type="submit" className="submit-btn">
                Submit
            </button>
            </form>
        )}
      </div>
    </div>
  );
}

export default Contact;