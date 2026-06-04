import "./Footer.css";

export default function Footer({ whatsappNumber }) {
  return (
    <footer>
      <a href="#home" className="footer-brand">
        <img src="/logo.png" alt="Kashmiri Fresh Juice" />
      </a>

      <div>
        <h4>Quick Links</h4>
        <p>
          <a href="#home">Home</a> | <a href="#menu">Menu</a> |{" "}
          <a href="#about">About Us</a> | <a href="#benefits">Benefits</a> |{" "}
          <a href="#gallery">Gallery</a> | <a href="#contact">Contact</a>
        </p>
      </div>

      <div>
        <h4>Follow Us</h4>
        <p className="social">
          <i className="fa-brands fa-facebook-f"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-tiktok"></i>
          <i className="fa-brands fa-whatsapp"></i>
        </p>
      </div>

      <div>
        <h4>Contact Us</h4>
        <p>
          <i className="fa-brands fa-whatsapp"></i> +{whatsappNumber}
          <br />
          <i className="fa-solid fa-location-dot"></i> Kashmir, Pakistan
        </p>
      </div>
    </footer>
  );
}
