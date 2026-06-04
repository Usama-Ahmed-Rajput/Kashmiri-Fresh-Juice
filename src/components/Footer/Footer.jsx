import "./Footer.css";

export default function Footer({ whatsappNumber }) {
  return (
    <footer className="footer">
      <div className="footer-brand-wrap">
        <a href="#home" className="footer-brand">
          <img
            src="/logo.png"
            alt="Kashmiri Fresh Juices"
            className="footer-logo"
          />
        </a>

        <p className="footer-desc">
          Fresh, Natural & Healthy Juices made with premium ingredients and
          delivered with care.
        </p>
      </div>

      <div>
        <h4>Quick Links</h4>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About Us</a>
          <a href="#benefits">Benefits</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <div>
        <h4>Follow Us</h4>

        <div className="social">
          <a href="#">
            <i className="fa-brands fa-facebook-f"></i>
          </a>

          <a href="#">
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a href="#">
            <i className="fa-brands fa-tiktok"></i>
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>

      <div>
        <h4>Contact Us</h4>

        <div className="contact-info">
          <p>
            <i className="fa-brands fa-whatsapp"></i>
            +{whatsappNumber}
          </p>

          <p>
            <i className="fa-solid fa-location-dot"></i>
            Kashmir, Pakistan
          </p>

          <p>
            <i className="fa-solid fa-clock"></i>
            Open Daily
          </p>
        </div>
      </div>
    </footer>
  );
}
