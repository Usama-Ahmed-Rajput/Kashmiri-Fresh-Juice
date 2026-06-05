import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ cartCount, onCartClick, whatsappNumber }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <a href="#home" className="brand" onClick={closeMenu}>
        <img
          src="/logo.png"
          alt="Kashmiri Fresh Juice"
          className="brand-logo"
        />
      </a>

      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <a className="active" href="#home" onClick={closeMenu}>Home</a>
        <a href="#menu" onClick={closeMenu}>Menu</a>
        <a href="#about" onClick={closeMenu}>About Us</a>
        <a href="#benefits" onClick={closeMenu}>Benefits</a>
        <a href="#gallery" onClick={closeMenu}>Gallery</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>

        <a
          className="mobile-whatsapp"
          href={`https://wa.me/${whatsappNumber}?text=Hi%20Kashmiri%20Fresh%20Juices%2C%20I%20want%20to%20order`}
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
        >
          <i className="fa-brands fa-whatsapp"></i> Order on WhatsApp
        </a>
      </div>

      <div className="nav-actions">
        <button className="cart-top" onClick={onCartClick}>
          <i className="fa-solid fa-bag-shopping"></i>
          <span>{cartCount}</span>
        </button>

        <a
          className="whatsapp top"
          href={`https://wa.me/${whatsappNumber}?text=Hi%20Kashmiri%20Fresh%20Juices%2C%20I%20want%20to%20order`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-brands fa-whatsapp"></i> Order on WhatsApp
        </a>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
