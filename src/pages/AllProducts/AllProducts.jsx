import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';
import Cart from '../../components/Cart/Cart';
import Footer from '../../components/Footer/Footer';
import { getProducts } from '../../utils/storage';
import { getFirebaseProducts, saveFirebaseOrder } from '../../firebase/firebaseApi';
import orangeImg from '../../assets/orange.png';
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

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');

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
        if (active && firebaseProducts.length) setProducts(firebaseProducts);
      } catch (error) {
        console.warn('Firebase products load failed:', error.message);
        if (active) setProducts(fallbackProducts);
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
    () => category === 'All' ? products : products.filter((p) => p.category === category),
    [products, category]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

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
    const card = e.currentTarget.closest('.card');
    const productImg = card.querySelector('img');
    const cartBtn = document.querySelector('.cart-top');

    if (!productImg || !cartBtn) {
      addToCart(product);
      return;
    }

    const imgRect = productImg.getBoundingClientRect();

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
      block: 'center',
      inline: 'center',
    });

    setTimeout(() => {
      const cartRect = cartBtn.getBoundingClientRect();

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
            left: `${cartRect.left + cartRect.width / 2 - 15}px`,
            top: `${cartRect.top + cartRect.height / 2 - 15}px`,
            width: '30px',
            height: '30px',
            opacity: 0.2,
            transform: 'rotate(360deg) scale(0.25)',
          },
        ],
        {
          duration: 1300,
          easing: 'cubic-bezier(.25,.8,.25,1)',
          fill: 'forwards',
        }
      );

      setTimeout(() => {
        flyingImg.remove();
        addToCart(product);

        cartBtn.classList.add('cart-bounce');
        setTimeout(() => cartBtn.classList.remove('cart-bounce'), 450);
      }, 1280);
    }, 650);
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
              {item}
            </button>
          ))}
        </div>

        <div className="cards all-products-cards">
          {filteredProducts.map((product, index) => (
            <motion.article
              className="card"
              key={product.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -10, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            >
              <label>{product.badge || 'FRESH'}</label>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>Rs. {product.price}</strong>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={(e) => flyToCart(product, e)}
              >
                <i className="fa-solid fa-cart-plus"></i> Add to Cart
              </motion.button>
            </motion.article>
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
    </main>
  );
}
