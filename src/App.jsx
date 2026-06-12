import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './components/Hero/Hero.jsx';
import Products from './components/Products/Products.jsx';
import About from './components/About/About.jsx';
import Cta from './components/Cta/Cta.jsx';
import ContactMap from './components/ContactMap/ContactMap.jsx';
import Footer from './components/Footer/Footer.jsx';
import Cart from './components/Cart/Cart.jsx';

import CustomCursor from './components/CustomCursor/CustomCursor.jsx';
import Stats from './components/Stats/Stats.jsx';
import Testimonials from './components/Testimonials/Testimonials.jsx';
import StickyOrder from './components/StickyOrder/StickyOrder.jsx';

import { getProducts } from './utils/storage';
import { getFirebaseProducts, saveFirebaseOrder } from './firebase/firebaseApi';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '923079970288';

export default function App() {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('kfj-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('kfj-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setCartOpen(false);
  }, [location.pathname]);

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

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
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
    <main className="page">
      {showLoader ? <Loader /> : null}

      <CustomCursor />

      <Navbar
        cartCount={totalItems}
        onCartClick={() => setCartOpen(true)}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      <Hero whatsappNumber={WHATSAPP_NUMBER} />

      <Products products={products} addToCart={addToCart} />

      <Stats />

      <About />

      <Testimonials />

      <Cta whatsappNumber={WHATSAPP_NUMBER} />

      <ContactMap whatsappNumber={WHATSAPP_NUMBER} />

      <Footer whatsappNumber={WHATSAPP_NUMBER} />

      <StickyOrder whatsappNumber={WHATSAPP_NUMBER} />

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
