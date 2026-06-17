import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getApprovedFirebaseReviews,
  submitFirebaseReview,
} from '../../firebase/firebaseApi';
import './Testimonials.css';

const fallbackReviews = [
  { id: '1', name: 'Ali Raza', message: 'Best fresh juice in town. Taste bilkul natural hai.', rating: 5 },
  { id: '2', name: 'Hamza Khan', message: 'Mango shake aur orange juice dono premium quality ke thay.', rating: 5 },
  { id: '3', name: 'Ayesha Noor', message: 'Fast delivery, fresh taste aur packaging bhi clean thi.', rating: 5 },
  { id: '4', name: 'Bilal Ahmed', message: 'Healthy drinks ke liye best option. Highly recommended.', rating: 5 },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [form, setForm] = useState({ name: '', rating: 5, message: '' });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadReviews = async () => {
    try {
      const firebaseReviews = await getApprovedFirebaseReviews();
      if (firebaseReviews.length) setReviews(firebaseReviews);
    } catch (err) {
      console.warn('Reviews load failed:', err.message);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    setNotice('');
    setError('');
    setLoading(true);

    try {
      await submitFirebaseReview(form);
      setForm({ name: '', rating: 5, message: '' });
      setNotice('The review is successfully submitted.');
    } catch (err) {
      setError(err.message || 'Review submit nahi ho saka.');
    } finally {
      setLoading(false);
    }
  };

  const visibleReviews = reviews.length ? [...reviews, ...reviews] : [];

  return (
    <section className="testimonials-section">
      <p className="script">Customer Love <i className="fa-solid fa-heart"></i></p>
      <h2 className="section-title">What People <span>Say</span></h2>

      <div className="reviews-track">
        {visibleReviews.map((review, index) => (
          <motion.div
            className="review-card"
            key={`${review.id || review.name}-${index}`}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="stars">{'★'.repeat(Number(review.rating || 5))}</div>
            <p>"{review.message || review.text}"</p>
            <b>{review.name}</b>
          </motion.div>
        ))}
      </div>

      <form className="review-form" onSubmit={submitReview}>
        <h3>Add Your Review</h3>

        <div className="review-row">
          <input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <textarea
          placeholder="Write your review..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />

        {notice && <p className="review-success">{notice}</p>}
        {error && <p className="review-error">{error}</p>}

        <button className="whatsapp" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </section>
  );
}
