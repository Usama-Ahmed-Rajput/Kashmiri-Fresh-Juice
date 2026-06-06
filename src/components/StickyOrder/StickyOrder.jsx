import './StickyOrder.css';

export default function StickyOrder({ whatsappNumber }) {
  return (
    <a
      className="sticky-order"
      href={`https://wa.me/${whatsappNumber}?text=Hi%20Kashmiri%20Fresh%20Juices%2C%20I%20want%20to%20order`}
      target="_blank"
      rel="noreferrer"
    >
      <i className="fa-brands fa-whatsapp"></i>
      Order on WhatsApp
    </a>
  );
}