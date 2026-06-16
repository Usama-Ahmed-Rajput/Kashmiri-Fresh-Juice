import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import {
  addFirebaseProduct,
  approveFirebaseReview,
  deleteFirebaseProduct,
  deleteFirebaseReview,
  getAllFirebaseReviews,
  getFirebaseOrders,
  getFirebaseProducts,
  hideFirebaseReview,
  seedDefaultProductsIfEmpty,
  updateFirebaseProduct,
  uploadProductImage,
} from '../firebase/firebaseApi';

import { auth } from '../firebase/config';
import mangoFallback from '../assets/mango.png';
import './Admin.css';

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  image: '',
  badge: 'NEW',
  active: true,
};

const formatPKR = (amount) => `₨${Number(amount || 0).toLocaleString('en-PK')}`;

export default function Admin() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openOrderId, setOpenOrderId] = useState(null);

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (user) loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);

    try {
      const [firebaseProducts, firebaseOrders, firebaseReviews] = await Promise.all([
        getFirebaseProducts(),
        getFirebaseOrders(),
        getAllFirebaseReviews(),
      ]);

      setProducts(firebaseProducts || []);
      setOrders(firebaseOrders || []);
      setReviews(firebaseReviews || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Firebase data load nahi ho saka.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setPassword('');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProducts([]);
    setOrders([]);
    setReviews([]);
  };

  const openSection = (name) => {
    setActive(name);
    setSidebarOpen(false);
  };

  const seedProducts = async () => {
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const next = await seedDefaultProductsIfEmpty();
      setProducts(next);
      setNotice('Default products seed ho gaye.');
      window.dispatchEvent(new Event('kfj-products-updated'));
    } catch (err) {
      setError(err.message || 'Default products seed nahi ho sakay.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      let imageUrl = form.image;

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const product = {
        ...form,
        price: Number(form.price),
        active: form.active !== false,
        image: imageUrl || mangoFallback,
      };

      const next = editingId
        ? await updateFirebaseProduct(editingId, product)
        : await addFirebaseProduct(product);

      setProducts(next);
      setForm(emptyForm);
      setImageFile(null);
      setEditingId(null);
      setNotice(editingId ? 'Product update ho gaya.' : 'New product add ho gaya.');
      window.dispatchEvent(new Event('kfj-products-updated'));
      setActive('products');
    } catch (err) {
      setError(err.message || 'Product save nahi ho saka.');
    } finally {
      setLoading(false);
    }
  };

  const edit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      category: product.category || '',
      description: product.description || '',
      price: product.price || '',
      image: product.image || '',
      badge: product.badge || 'NEW',
      active: product.active !== false,
    });

    setImageFile(null);
    setActive('addProduct');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleProductStatus = async (product) => {
    const nextStatus = product.active === false;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, active: nextStatus } : item
      )
    );

    try {
      const updatedProduct = { ...product, active: nextStatus };
      const next = await updateFirebaseProduct(product.id, updatedProduct);

      if (Array.isArray(next)) setProducts(next);

      window.dispatchEvent(new Event('kfj-products-updated'));
    } catch (err) {
      setError(err.message || 'Status update failed');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;

    const next = await deleteFirebaseProduct(id);
    setProducts(next);
  };

  const approveReview = async (id) => {
    const next = await approveFirebaseReview(id);
    setReviews(next);
  };

  const hideReview = async (id) => {
    const next = await hideFirebaseReview(id);
    setReviews(next);
  };

  const removeReview = async (id) => {
    if (!confirm('Delete this review?')) return;

    const next = await deleteFirebaseReview(id);
    setReviews(next);
  };

  const pendingReviews = reviews.filter((r) => r.status !== 'approved');
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const activeProducts = products.filter((p) => p.active !== false);
  const inactiveProducts = products.filter((p) => p.active === false);

  if (!authReady) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return (
      <form onSubmit={login}>
        <h1>Admin Login</h1>

        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />

        <button type="submit">Login</button>

        {error && <p>{error}</p>}
      </form>
    );
  }

  return (
    <main>
      <h1>Admin Panel</h1>

      {/* PRODUCT FORM */}
      {active === 'addProduct' && (
        <form onSubmit={submit}>
          <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          {/* FILE UPLOAD */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          {/* ✅ IMAGE PREVIEW ADDED */}
          {imageFile && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                style={{
                  width: '140px',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
          )}

          <button type="submit">
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>
      )}
    </main>
  );
}
