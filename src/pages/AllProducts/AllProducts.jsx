import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Cart from '../../components/Cart/Cart';
import Footer from '../../components/Footer/Footer';
import { getProducts } from '../../utils/storage';
import { getFirebaseProducts, saveFirebaseOrder } from '../../firebase/firebaseApi';
import orangeImg from '../../assets/orange.png';
import './AllProducts.css';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '923079970288';

export default function AllProducts(){
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadProducts(){
      const fallbackProducts = getProducts();
      setProducts(fallbackProducts);
      try {
        const firebaseProducts = await getFirebaseProducts();
        if(active && firebaseProducts.length) setProducts(firebaseProducts);
      } catch (error) {
        console.warn('Firebase products load failed:', error.message);
        if(active) setProducts(fallbackProducts);
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

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category).filter(Boolean))], [products]);
  const filteredProducts = useMemo(() => category === 'All' ? products : products.filter(p => p.category === category), [products, category]);
  const totalItems = useMemo(() => cart.reduce((sum,item)=>sum+item.qty,0),[cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if(existing) return prev.map(item => item.id === product.id ? {...item, qty:item.qty+1} : item);
      return [...prev, {...product, qty:1}];
    });
    setCartOpen(true);
  };

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? {...item, qty: Math.max(1, item.qty + delta)} : item));
  };

  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const checkout = async (customer) => {
    const total = cart.reduce((sum,item)=>sum+(item.price*item.qty),0);
    const order = { customer, cart, total };
    try { await saveFirebaseOrder(order); } catch (error) { console.warn('Order save failed:', error.message); }
    const items = cart.map(item => `• ${item.name} x ${item.qty} = Rs. ${item.price * item.qty}`).join('%0A');
    const message = `Hi Kashmiri Fresh Juices,%0AI want to place an order.%0A%0AName: ${encodeURIComponent(customer.name)}%0APhone: ${encodeURIComponent(customer.phone)}%0AAddress: ${encodeURIComponent(customer.address)}%0A%0AOrder:%0A${items}%0A%0ATotal: Rs. ${total}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setCart([]);
    setCartOpen(false);
  };

  return (
    <main className="page all-products-page">
      <Navbar cartCount={totalItems} onCartClick={() => setCartOpen(true)} whatsappNumber={WHATSAPP_NUMBER}/>

      <section className="all-products-hero" style={{ '--orange': `url(${orangeImg})` }}>
        <p className="script">Complete Fresh Menu <i className="fa-solid fa-seedling"></i></p>
        <h1>All <span>Products</span></h1>
        <p className="all-products-subtitle">Fresh juices, shakes, smoothies aur special drinks aik separate menu page par.</p>
        <Link className="back-home" to="/"><i className="fa-solid fa-arrow-left"></i> Back to Home</Link>
      </section>

      <section className="all-products-list">
        <div className="menu-filters">
          {categories.map(item => (
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
          {filteredProducts.map(product => (
            <article className="card" key={product.id}>
              <label>{product.badge || 'FRESH'}</label>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>Rs. {product.price}</strong>
              <button onClick={() => addToCart(product)}>
                <i className="fa-solid fa-cart-plus"></i> Add to Cart
              </button>
            </article>
          ))}
        </div>
      </section>

      <Footer whatsappNumber={WHATSAPP_NUMBER}/>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} changeQty={changeQty} removeItem={removeItem} checkout={checkout}/>
    </main>
  );
}
