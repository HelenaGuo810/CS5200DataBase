import React, { useState } from "react";
import "./HeroSection.css"; 

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false);
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [region, setRegion] = useState("");
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleGetStartedClick = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && year && major && region) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setShowForm(false);
        // Reset form
        setEmail("");
        setYear("");
        setMajor("");
        setRegion("");
      }, 2000);
    }
  };

  return (
    <section className="hero">
      <h2>Welcome to Vertex Studio</h2>
      <p>Your journey to the best design starts here.</p>
      <button className="modern-button" onClick={handleGetStartedClick}>
        Free Consultation
      </button>

      {showForm && (
        <div className="application-form">
          <h3>Assessment</h3>
          <form onSubmit={handleSubmit} className="form-group">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </label>
            <label>
              Year
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">Select Year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </label>
            <label>
              Major
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              >
                <option value="">Select Major</option>
                <option value="Urban Design">Urban Design</option>
                <option value="Architecture">Architecture</option>
                <option value="Landscape Architecture">
                  Landscape Architecture
                </option>
                <option value="City Planning">City Planning</option>
              </select>
            </label>
            <label>
              Region
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
              >
                <option value="">Select Region</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Britain">Britain</option>
                <option value="Asia">Asia</option>
              </select>
            </label>
            <button type="submit" className="submit-button">
              Get Application Plan
            </button>
          </form>
        </div>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h4>Application plan sent!</h4>
            <p>Check your email for the detailed plan.</p>
          </div>
        </div>
      )}
    </section>
  );
}
