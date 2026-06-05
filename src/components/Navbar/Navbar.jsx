import "./Navbar.css";

export default function Navbar({ cartCount, onCartClick, whatsappNumber }) {
  return (
    <nav className="navbar">
      <a href="#home" className="brand">
        <img
          src="/logo.png"
          alt="Kashmiri Fresh Juice"
          className="brand-logo"
        />
      </a>

      <div className="nav-links">
        <a className="active" href="#home">Home</a>
        <a href="#menu">Menu</a>
        <a href="#about">About Us</a>
        <a href="#benefits">Benefits</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
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
      </div>
    </nav>
  );
}
