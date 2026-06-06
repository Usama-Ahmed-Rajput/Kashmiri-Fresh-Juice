import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import './Stats.css';

function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1600 });
  const display = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return (
    <motion.b ref={ref}>
      <motion.span>{display}</motion.span>{suffix}
    </motion.b>
  );
}

export default function Stats() {
  const stats = [
    { value: 5000, suffix: '+', label: 'Orders Served', icon: 'fa-bag-shopping' },
    { value: 100, suffix: '%', label: 'Fresh Ingredients', icon: 'fa-seedling' },
    { value: 50, suffix: '+', label: 'Flavours', icon: 'fa-glass-water' },
    { value: 49, suffix: '/10', label: 'Customer Rating', icon: 'fa-star' },
  ];

  return (
    <section className="stats-section">
      {stats.map((item, index) => (
        <motion.div
          className="stat-card"
          key={item.label}
          initial={{ opacity: 0, y: 30, rotateX: 12 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: index * 0.08, duration: 0.45 }}
          whileHover={{ y: -8, scale: 1.03 }}
        >
          <i className={`fa-solid ${item.icon}`}></i>
          <Counter value={item.value} suffix={item.suffix} />
          <span>{item.label}</span>
        </motion.div>
      ))}
    </section>
  );
}
