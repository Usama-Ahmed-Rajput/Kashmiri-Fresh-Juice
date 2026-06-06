import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import orangeImg from '../../assets/orange.png';
import './Products.css';

const cardVariants = {
  hidden: { opacity: 0, y: 38 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.08,
      ease: 'easeOut',
    },
  }),
};

const getCategoryIcon = (category = '', name = '') => {
  const text = `${category} ${name}`.toLowerCase();

  if (text.includes('mango')) return '🥭';
  if (text.includes('strawberry')) return '🍓';
  if (text.includes('orange') || text.includes('citrus')) return '🍊';
  if (text.includes('lemon')) return '🍋';
  if (text.includes('shake') || text.includes('smoothie')) return '🥤';
  if (text.includes('apple')) return '🍎';
  if (text.includes('grape')) return '🍇';

  return '🍹';
};

function ProductCard({ product, index, flyToCart, openQuickView }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 180, damping: 18 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 18 });

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [9, -9]);

  const handleMouseMove = (e) => {
    if (window.innerWidth <= 980) return;

    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      className="card product-3d-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 18,
      }}
    >
      <span className="card-shine"></span>

      <label>{product.badge || 'FRESH'}</label>

      <button
        type="button"
        className="product-image-btn"
        onClick={() => openQuickView(product)}
        aria-label={`View ${product.name}`}
      >
        <span className="category-emoji">
          {getCategoryIcon(product.category, product.name)}
        </span>

        <motion.img
          src={product.image}
          alt={product.name}
          className="product-img"
          whileHover={{
            scale: 1.13,
            y: -14,
            rotateZ: -2,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        />
      </button>

      <h3>{product.name}</h3>

      <p>{product.description}</p>

      <strong>Rs. {product.price}</strong>

      <motion.button
        className="add-cart-btn"
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => flyToCart(product, e)}
      >
        <i className="fa-solid fa-cart-plus"></i>
        Add to Cart
      </motion.button>
    </motion.article>
  );
}

function QuickViewModal({ product, closeQuickView, flyToCart, addToCart }) {
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === 'Escape') closeQuickView();
    };

    document.addEventListener('keydown', closeOnEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', closeOnEsc);
      document.body.style.overflow = '';
    };
  }, [closeQuickView]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="quick-view-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeQuickView}
      >
        <motion.div
          className="quick-view-modal"
          initial={{ opacity: 0, y: 40, scale: 0.92, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="quick-close" onClick={closeQuickView} type="button">
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="quick-image-wrap">
            <span className="quick-category">
              {getCategoryIcon(product.category, product.name)} {product.category || 'Fresh Juice'}
            </span>

            <motion.img
              src={product.image}
              alt={product.name}
              initial={{ y: 20, scale: 0.9 }}
              animate={{ y: [0, -10, 0], scale: 1 }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.4 },
              }}
            />
          </div>

          <div className="quick-content">
            <small>{product.badge || 'FRESH & NATURAL'}</small>
            <h3>{product.name}</h3>
            <p>{product.description || 'Freshly prepared with premium quality fruits.'}</p>

            <strong>Rs. {product.price}</strong>

            <div className="quick-actions">
              <motion.button
                className="quick-cart"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  flyToCart(product, e);
                  closeQuickView();
                }}
                type="button"
              >
                <i className="fa-solid fa-cart-plus"></i>
                Add to Cart
              </motion.button>

              <motion.button
                className="quick-simple"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  addToCart(product);
                  closeQuickView();
                }}
                type="button"
              >
                Quick Add
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Products({ products, addToCart }) {
  const [quickProduct, setQuickProduct] = useState(null);
  const popularProducts = products.slice(0, 4);

  const closeQuickView = () => setQuickProduct(null);

  const flyToCart = (product, e) => {
    const card = e.currentTarget.closest('.card, .quick-view-modal');
    const productImg = card?.querySelector('.product-img, .quick-image-wrap img');
    const cartBtn = document.querySelector('.cart-top');

    if (!productImg || !cartBtn) {
      addToCart(product);
      return;
    }

    const imgRect = productImg.getBoundingClientRect();
    const isMobile = window.innerWidth <= 600;

    const animationDuration = isMobile ? 1700 : 1450;
    const scrollDelay = isMobile ? 420 : 300;

    const flyingImg = document.createElement('img');
    flyingImg.src = product.image;
    flyingImg.className = 'fly-cart-img';

    flyingImg.style.left = `${imgRect.left}px`;
    flyingImg.style.top = `${imgRect.top}px`;
    flyingImg.style.width = `${imgRect.width}px`;
    flyingImg.style.height = `${imgRect.height}px`;

    document.body.appendChild(flyingImg);

    cartBtn.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });

    setTimeout(() => {
      const cartRect = cartBtn.getBoundingClientRect();

      const startX = imgRect.left;
      const startY = imgRect.top;

      const endX = cartRect.left + cartRect.width / 2 - 18;
      const endY = cartRect.top + cartRect.height / 2 - 18;

      const midX = startX + (endX - startX) * 0.5;
      const midY = Math.min(startY, endY) - 130;

      flyingImg.animate(
        [
          {
            left: `${startX}px`,
            top: `${startY}px`,
            width: `${imgRect.width}px`,
            height: `${imgRect.height}px`,
            opacity: 1,
            transform:
              'translateZ(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)',
          },
          {
            left: `${midX}px`,
            top: `${midY}px`,
            width: `${imgRect.width * 0.55}px`,
            height: `${imgRect.height * 0.55}px`,
            opacity: 0.92,
            transform:
              'translateZ(80px) rotateX(18deg) rotateY(-18deg) rotateZ(180deg) scale(0.75)',
          },
          {
            left: `${endX}px`,
            top: `${endY}px`,
            width: '36px',
            height: '36px',
            opacity: 0.15,
            transform:
              'translateZ(0) rotateX(25deg) rotateY(25deg) rotateZ(360deg) scale(0.22)',
          },
        ],
        {
          duration: animationDuration,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        }
      );
    }, scrollDelay);

    setTimeout(() => {
      flyingImg.remove();
      addToCart(product);

      cartBtn.classList.add('cart-bounce');

      setTimeout(() => {
        cartBtn.classList.remove('cart-bounce');
      }, 550);
    }, animationDuration + scrollDelay);
  };

  return (
    <>
      <motion.section
        className="popular"
        id="menu"
        style={{ '--orange': `url(${orangeImg})` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.45 }}
      >
        <motion.span
          className="floating-fruit fruit-one"
          animate={{ y: [0, -24, 0], rotate: [0, 18, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.span
          className="floating-fruit fruit-two"
          animate={{ y: [0, 18, 0], rotate: [0, -16, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

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
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              flyToCart={flyToCart}
              openQuickView={setQuickProduct}
            />
          ))}
        </div>

        <motion.div
          className="full-menu-wrap"
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link className="full-menu" to="/all-products">
            <i className="fa-solid fa-grip"></i>
            View Full Menu
          </Link>
        </motion.div>
      </motion.section>

      {quickProduct && (
        <QuickViewModal
          product={quickProduct}
          closeQuickView={closeQuickView}
          flyToCart={flyToCart}
          addToCart={addToCart}
        />
      )}
    </>
  );
}
