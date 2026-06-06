import { motion } from 'framer-motion';
import './Testimonials.css';

const reviews = [
  { name: 'Ali Raza', text: 'Best fresh juice in town. Taste bilkul natural hai.' },
  { name: 'Hamza Khan', text: 'Mango shake aur orange juice dono premium quality ke thay.' },
  { name: 'Ayesha Noor', text: 'Fast delivery, fresh taste aur packaging bhi clean thi.' },
  { name: 'Bilal Ahmed', text: 'Healthy drinks ke liye best option. Highly recommended.' },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <p className="script">Customer Love <i className="fa-solid fa-heart"></i></p>
      <h2 className="section-title">What People <span>Say</span></h2>

      <div className="reviews-track">
        {[...reviews, ...reviews].map((review, index) => (
          <motion.div
            className="review-card"
            key={`${review.name}-${index}`}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="stars">★★★★★</div>
            <p>"{review.text}"</p>
            <b>{review.name}</b>
          </motion.div>
        ))}
      </div>
    </section>
  );
}