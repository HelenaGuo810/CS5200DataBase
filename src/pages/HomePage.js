import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../routes/Navigation/NavBar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/footer/Footer";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Fixed Navbar (position: fixed in Navbar.css) */}
      <Navbar />

      {/* Hero / Assessment Form */}
      <HeroSection />

      {/* content section */}
      <main className="content-grid button-sections">
        <section id="portfolio">
          <h2>Portfolio Progress</h2>
          <p>Manage your work, set goals, and track your progress.</p>
          <button
            className="modern-button black-button"
            onClick={() => navigate('/login')}
          >
            Student Login
          </button>
        </section>
       
        <section id="appointments">
          <h2>Book a Tutor</h2>
          <p>Internal students can book 1-1 appointments with our tutors.</p>
          <button
            className="modern-button black-button"
            onClick={() => navigate('/appointment')}
          >
            Appoint Now
          </button>
        </section>
        
        <section id="forum">
          <h2>Community</h2>
          <p>The forum for application is now open to the public!</p>
          <button
            className="modern-button black-button"
            onClick={() => navigate('/forum')}
          >
            Visit Community
          </button>
        </section>
        
        <section id="study-cases">
          <h2>Resources</h2>
          <p>Explore study cases, stock images, and video tutorials.</p>
          <button
            className="modern-button black-button"
            onClick={() => navigate('/resources')}
          >
            Explore Resources
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
