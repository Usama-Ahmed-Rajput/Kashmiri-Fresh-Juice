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

  const flyToCart = (product, e) => {
    const card = e.currentTarget.closest('.card');
    const productImg = card.querySelector('.product-img-wrap img');
    const cartBtn = document.querySelector('.cart-top');

    if (!productImg || !cartBtn) {
      addToCart(product);
      return;
    }

    const imgRect = productImg.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    const flyingImg = document.createElement('img');
    flyingImg.src = product.image;
    flyingImg.className = 'fly-cart-img';

    flyingImg.style.left = `${imgRect.left}px`;
    flyingImg.style.top = `${imgRect.top}px`;
    flyingImg.style.width = `${imgRect.width}px`;
    flyingImg.style.height = `${imgRect.height}px`;

    document.body.appendChild(flyingImg);

    flyingImg.animate(
      [
        {
          left: `${imgRect.left}px`,
          top: `${imgRect.top}px`,
          width: `${imgRect.width}px`,
          height: `${imgRect.height}px`,
          opacity: 1,
          transform: 'rotate(0deg) scale(1)',
        },
        {
          left: `${cartRect.left + cartRect.width / 2}px`,
          top: `${cartRect.top + cartRect.height / 2}px`,
          width: '25px',
          height: '25px',
          opacity: 0.2,
          transform: 'rotate(360deg) scale(0.25)',
        },
      ],
      {
        duration: 750,
        easing: 'cubic-bezier(.2,.8,.2,1)',
      }
    );

    setTimeout(() => {
      flyingImg.remove();
      addToCart(product);
      cartBtn.classList.add('cart-bounce');
      setTimeout(() => cartBtn.classList.remove('cart-bounce'), 450);
    }, 720);
  };

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
      <motion.p className="script">Our Special <i className="fa-solid fa-seedling"></i></motion.p>

      <motion.h2>
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
            <span className="card-bg-circle"></span>
            <label>{product.badge || 'FRESH'}</label>

            <div className="product-img-wrap">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-content">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>Rs. {product.price}</strong>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={(e) => flyToCart(product, e)}
              >
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
