import React from "react";
import { Info, Book, Image, Calendar } from "react-feather";
import "../../routes/Navigation/NavBar.css"; 
import tabLogo from "../../assets/static/logo.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={tabLogo} alt="Vertex Studio Logo" className="logo" />
        <h1>Vertex Studio</h1>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#about">
              <Info size={16} /> About
            </a>
          </li>
          <li>
            <a href="#login">
              <Image size={16} /> Login
            </a>
          </li>
          <li>
            <button
              onClick={() => window.open("/forum", "_blank")}
              className="nav-button"
              aria-label="Open forum in new tab"
            >
              <Calendar size={16} /> Forum
            </button>
          </li>
          <li>
          <button
              onClick={() => window.open("http://localhost:3000/contact", "_blank")}
              className="nav-button"
              aria-label="Open Contact Us in new tab"
            >
              <Book size={16} /> Contact Us
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
