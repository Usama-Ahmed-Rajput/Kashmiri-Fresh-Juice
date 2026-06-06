import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

import Navbar from '../../components/Navbar/Navbar.jsx';
import Cart from '../../components/Cart/Cart.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import { getProducts } from '../../utils/storage';
import { getFirebaseProducts, saveFirebaseOrder } from '../../firebase/firebaseApi';

import orangeImg from '../../assets/orange.png';
import mangoImg from '../../assets/mango.png';
import strawberryImg from '../../assets/strawberry.png';
import lemonImg from '../../assets/lemon.png';

import './AllProducts.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '923079970288';

const cardVariants = {
  hidden: { opacity: 0, y: 38 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.04, ease: 'easeOut' },
  }),
};

const getCategoryImage = (category = '', name = '') => {
  const text = `${category} ${name}`.toLowerCase();

  if (text.includes('mango')) return mangoImg;
  if (text.includes('strawberry')) return strawberryImg;
  if (text.includes('orange') || text.includes('citrus')) return orangeImg;
  if (text.includes('lemon')) return lemonImg;

  return orangeImg;
};

function AllProductCard({ product, index, flyToCart, openQuickView }) {
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

  return (
    <motion.article
      className="card product-3d-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      <span className="card-shine"></span>

      <label>{product.badge || 'FRESH'}</label>

      <button
        type="button"
        className="product-image-btn"
        onClick={() => openQuickView(product)}
        aria-label={`View ${product.name}`}
      >
        <span className="category-fruit">
          <img src={getCategoryImage(product.category, product.name)} alt="" />
        </span>

        <motion.img
          src={product.image}
          alt={product.name}
          className="product-img"
          whileHover={{ scale: 1.13, y: -14, rotateZ: -2 }}
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
        <i className="fa-solid fa-cart-plus"></i> Add to Cart
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
              <img src={getCategoryImage(product.category, product.name)} alt="" />
              {product.category || 'Fresh Juice'}
            </span>

            <motion.img
              src={product.image}
              alt={product.name}
              className="product-img"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
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
                <i className="fa-solid fa-cart-plus"></i> Add to Cart
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

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [quickProduct, setQuickProduct] = useState(null);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('kfj-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kfj-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      const fallbackProducts = getProducts();
      setProducts(fallbackProducts);

      try {
        const firebaseProducts = await getFirebaseProducts();
        if (active && firebaseProducts.length) {
          setProducts(firebaseProducts);
        }
      } catch (error) {
        console.warn('Firebase products load failed:', error.message);
        if (active) {
          setProducts(fallbackProducts);
        }
      }
    }

    loadProducts();

    const refresh = () => loadProducts();
    window.addEventListener('kfj-products-updated', refresh);

    return () => {
      active = false;
      window.removeEventListener('kfj-products-updated', refresh);
    };
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(
    () => (category === 'All' ? products : products.filter((p) => p.category === category)),
    [products, category]
  );

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

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
            transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)',
          },
          {
            left: `${midX}px`,
            top: `${midY}px`,
            width: `${imgRect.width * 0.55}px`,
            height: `${imgRect.height * 0.55}px`,
            opacity: 0.92,
            transform: 'rotateX(18deg) rotateY(-18deg) rotateZ(180deg) scale(0.75)',
          },
          {
            left: `${endX}px`,
            top: `${endY}px`,
            width: '36px',
            height: '36px',
            opacity: 0.15,
            transform: 'rotateX(25deg) rotateY(25deg) rotateZ(360deg) scale(0.22)',
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
      setTimeout(() => cartBtn.classList.remove('cart-bounce'), 550);
    }, animationDuration + scrollDelay);
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const checkout = async (customer) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = { customer, cart, total };

    try {
      await saveFirebaseOrder(order);
    } catch (error) {
      console.warn('Order save failed:', error.message);
    }

    const items = cart
      .map((item) => `• ${item.name} x ${item.qty} = Rs. ${item.price * item.qty}`)
      .join('%0A');

    const message = `Hi Kashmiri Fresh Juices,%0AI want to place an order.%0A%0AName: ${encodeURIComponent(
      customer.name
    )}%0APhone: ${encodeURIComponent(
      customer.phone
    )}%0AAddress: ${encodeURIComponent(
      customer.address
    )}%0A%0AOrder:%0A${items}%0A%0ATotal: Rs. ${total}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');

    setCart([]);
    localStorage.removeItem('kfj-cart');
    setCartOpen(false);
  };

  return (
    <main className="page all-products-page">
      <Navbar
        cartCount={totalItems}
        onCartClick={() => setCartOpen(true)}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      <section className="all-products-hero" style={{ '--orange': `url(${orangeImg})` }}>
        <motion.span
          className="all-floating-fruit all-fruit-one"
          animate={{ y: [0, -24, 0], rotate: [0, 18, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.span
          className="all-floating-fruit all-fruit-two"
          animate={{ y: [0, 18, 0], rotate: [0, -16, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <p className="script">
          Complete Fresh Menu <i className="fa-solid fa-seedling"></i>
        </p>

        <h1>
          All <span>Products</span>
        </h1>

        <p className="all-products-subtitle">
          Fresh juices, shakes, smoothies aur special drinks aik separate menu page par.
        </p>

        <Link className="back-home" to="/">
          <i className="fa-solid fa-arrow-left"></i> Back to Home
        </Link>
      </section>

      <section className="all-products-list">
        <div className="menu-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'active' : ''}
              onClick={() => setCategory(item)}
              type="button"
            >
              <img className="filter-fruit-img" src={getCategoryImage(item)} alt="" />
              {item}
            </button>
          ))}
        </div>

        <div className="cards all-products-cards">
          {filteredProducts.map((product, index) => (
            <AllProductCard
              key={product.id}
              product={product}
              index={index}
              flyToCart={flyToCart}
              openQuickView={setQuickProduct}
            />
          ))}
        </div>
      </section>

      <Footer whatsappNumber={WHATSAPP_NUMBER} />

      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        changeQty={changeQty}
        removeItem={removeItem}
        checkout={checkout}
      />

      {quickProduct && (
        <QuickViewModal
          product={quickProduct}
          closeQuickView={() => setQuickProduct(null)}
          flyToCart={flyToCart}
          addToCart={addToCart}
        />
      )}
    </main>
  );
}
