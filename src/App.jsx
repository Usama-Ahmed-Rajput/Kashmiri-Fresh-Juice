import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Products from './components/Products/Products';
import About from './components/About/About';
import Cta from './components/Cta/Cta';
import ContactMap from './components/ContactMap/ContactMap';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import { getProducts } from './utils/storage';
import { getFirebaseProducts, saveFirebaseOrder } from './firebase/firebaseApi';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '923079970288';

export default function App() {
  const location = useLocation();

  const [products, setProducts] = useState([]);

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

    // Cart drawer Add to Cart par open nahi hoga
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
      <Navbar
        cartCount={totalItems}
        onCartClick={() => setCartOpen(true)}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      <Hero whatsappNumber={WHATSAPP_NUMBER} />

      <Products
        products={products}
        addToCart={addToCart}
      />

      <About />
      <Cta whatsappNumber={WHATSAPP_NUMBER} />
      <ContactMap whatsappNumber={WHATSAPP_NUMBER} />
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
