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
            <a href="/login">
              <Image size={16} /> Login
            </a>
          </li>
          <li>
            <a href="/forum" className="nav-button">
              <Calendar size={16} /> Forum
            </a>
          </li>
          <li>
            <a href="/contact" className="nav-button">
              <Book size={16} /> Contact Us
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
