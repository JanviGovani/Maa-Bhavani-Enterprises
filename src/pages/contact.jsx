import React, { useState, useEffect } from "react";
import Loader from "../components/loader";
import { db } from "../firebase"; // 1. Import db
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // 2. Import firestore methods
import "./contact.css";

function Contact() {

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // 3. Add states for feedback inputs
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  // 4. Update handleSubmit to save into Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "feedbacks"), {
        name: name,
        mobile: mobile,
        message: message,
        timestamp: serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving feedback: ", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };


  return (
    <div className="contact-container">

      {loading && <Loader />}

      <div className="contact-card">

        <b>Contact number</b>

        <ul className="contact-numbers">
          <li><a href="tel:9652108320" style={{ textDecoration: 'none', color: 'inherit' }}>9652108320</a></li>
          <li><a href="tel:9652192736" style={{ textDecoration: 'none', color: 'inherit' }}>9652192736</a></li>
          <li><a href="tel:9949273082" style={{ textDecoration: 'none', color: 'inherit' }}>9949273082</a></li>
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
                value={name} // <-- Must be bound
                onChange={(e) => setName(e.target.value)} // <-- Must update state
                required
            />

            <label><b>Mobile Number:</b></label>
            <input
                type="tel"
                pattern="[0-9]{10}"
                title="Enter a 10-digit mobile number"
                placeholder="Type your phone number here"
                value={mobile} // <-- Must be bound
                onChange={(e) => setMobile(e.target.value)} // <-- Must update state
                required
            />

            <label><b>Message:</b></label>
            <textarea 
              rows="5" 
              placeholder="Type feedback message here" 
              value={message} // <-- Must be bound
              onChange={(e) => setMessage(e.target.value)} // <-- Must update state
              required 
            />

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