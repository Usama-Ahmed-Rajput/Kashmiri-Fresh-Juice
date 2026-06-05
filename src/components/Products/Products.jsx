import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import orangeImg from '../../assets/orange.png';
import './Products.css';

const cardVariants = {
  hidden: { opacity: 0, y: 38 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.08, ease: 'easeOut' },
  }),
};

export default function Products({ products, addToCart }) {
  const popularProducts = products.slice(0, 4);

  return (
    <motion.section
      className="popular"
      id="menu"
      style={{ '--orange': `url(${orangeImg})` }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45 }}
    >
      <motion.p
        className="script"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        Our Special <i className="fa-solid fa-seedling"></i>
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Popular <span>Menu</span>
      </motion.h2>

      <div className="cards">
        {popularProducts.map((product, index) => (
          <motion.article
            className="card"
            key={product.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <span className="card-glow"></span>

            <label>{product.badge || 'FRESH'}</label>

            <div className="product-img-wrap">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-content">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>Rs. {product.price}</strong>

              <motion.button whileTap={{ scale: 0.96 }} onClick={() => addToCart(product)}>
                <i className="fa-solid fa-cart-plus"></i> Add to Cart
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="full-menu-wrap">
        <Link className="full-menu" to="/all-products">
          <i className="fa-solid fa-grip"></i> View Full Menu
        </Link>
      </motion.div>
    </motion.section>
  );
}
