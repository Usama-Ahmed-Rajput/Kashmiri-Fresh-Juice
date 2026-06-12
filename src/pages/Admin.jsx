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
    setError('');
    setNotice('');

    const nextStatus = product.active === false;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, active: nextStatus } : item
      )
    );

    try {
      const updatedProduct = {
        ...product,
        active: nextStatus,
      };

      const next = await updateFirebaseProduct(product.id, updatedProduct);

      if (Array.isArray(next)) {
        setProducts(next);
      }

      setNotice(
        nextStatus
          ? `"${product.name}" Active ho gaya. Website par show hoga.`
          : `"${product.name}" Inactive ho gaya. Website se hide hoga.`
      );

      window.dispatchEvent(new Event('kfj-products-updated'));
    } catch (err) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, active: product.active !== false } : item
        )
      );

      setError(err.message || 'Product status update nahi ho saka.');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;

    setLoading(true);
    setError('');
    setNotice('');

    try {
      const next = await deleteFirebaseProduct(id);
      setProducts(next);
      setNotice('Product delete ho gaya.');
      window.dispatchEvent(new Event('kfj-products-updated'));
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id) => {
    setLoading(true);

    try {
      const next = await approveFirebaseReview(id);
      setReviews(next);
      setNotice('Review approved ho gaya.');
    } catch (err) {
      setError(err.message || 'Review approve nahi ho saka.');
    } finally {
      setLoading(false);
    }
  };

  const hideReview = async (id) => {
    setLoading(true);

    try {
      const next = await hideFirebaseReview(id);
      setReviews(next);
      setNotice('Review pending mein move ho gaya.');
    } catch (err) {
      setError(err.message || 'Review hide nahi ho saka.');
    } finally {
      setLoading(false);
    }
  };

  const removeReview = async (id) => {
    if (!confirm('Delete this review?')) return;

    setLoading(true);

    try {
      const next = await deleteFirebaseReview(id);
      setReviews(next);
      setNotice('Review delete ho gaya.');
    } catch (err) {
      setError(err.message || 'Review delete nahi ho saka.');
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return (
      <main className="admin-page">
        <div className="admin-login">
          <h1>Loading...</h1>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="admin-page admin-auth-page">
        <form className="admin-login admin-card" onSubmit={login}>
          <h1>Admin Panel</h1>
          <small>KASHMIRI FRESH JUICES</small>

          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="admin-error">{error}</p>}

          <button className="whatsapp" type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Login'}
          </button>

          <Link className="outline" to="/">
            Back to Website
          </Link>
        </form>
      </main>
    );
  }

  const pendingReviews = reviews.filter((r) => r.status !== 'approved');
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const activeProducts = products.filter((p) => p.active !== false);
  const inactiveProducts = products.filter((p) => p.active === false);

  return (
    <main className="admin-dashboard-page">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <img src="/logo.png" alt="Logo" />
          <div>
            <b>Kashmiri</b>
            <small>Fresh Juices Admin</small>
          </div>
        </div>

        <button className={active === 'dashboard' ? 'active' : ''} onClick={() => openSection('dashboard')}>
          Dashboard
        </button>

        <button className={active === 'addProduct' ? 'active' : ''} onClick={() => openSection('addProduct')}>
          Add New Product
        </button>

        <button className={active === 'products' ? 'active' : ''} onClick={() => openSection('products')}>
          Products
        </button>

        <button className={active === 'reviews' ? 'active' : ''} onClick={() => openSection('reviews')}>
          Reviews
        </button>

        <button className={active === 'orders' ? 'active' : ''} onClick={() => openSection('orders')}>
          Orders
        </button>

        <div className="admin-sidebar-bottom">
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <section className="admin-content">
        <header className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <div>
            <h1>
              {active === 'dashboard' && 'Dashboard'}
              {active === 'addProduct' && (editingId ? 'Edit Product' : 'Add New Product')}
              {active === 'products' && 'Products'}
              {active === 'reviews' && 'Reviews'}
              {active === 'orders' && 'Orders'}
            </h1>
            <p>Logged in: {user.email}</p>
          </div>

          <Link className="outline" to="/">
            Website
          </Link>
        </header>

        {error && <p className="admin-error">{error}</p>}
        {notice && <p className="admin-success">{notice}</p>}

        {active === 'dashboard' && (
          <>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <span>Total Products</span>
                <b>{products.length}</b>
              </div>

              <div className="admin-stat-card">
                <span>Active Products</span>
                <b>{activeProducts.length}</b>
              </div>

              <div className="admin-stat-card">
                <span>Inactive Products</span>
                <b>{inactiveProducts.length}</b>
              </div>

              <div className="admin-stat-card">
                <span>Total Orders</span>
                <b>{orders.length}</b>
              </div>

              <div className="admin-stat-card">
                <span>Pending Reviews</span>
                <b>{pendingReviews.length}</b>
              </div>

              <div className="admin-stat-card">
                <span>Approved Reviews</span>
                <b>{approvedReviews.length}</b>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-head">
                <h2>Quick Actions</h2>
              </div>

              <div className="admin-actions-grid">
                <button className="whatsapp" onClick={() => setActive('addProduct')}>
                  Add Product
                </button>

                <button className="outline" onClick={loadAdminData} disabled={loading}>
                  Refresh Data
                </button>

                <button className="outline" onClick={seedProducts} disabled={loading}>
                  Seed Default Products
                </button>
              </div>
            </div>
          </>
        )}

        {active === 'addProduct' && (
          <form className="admin-card product-form" onSubmit={submit}>
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              <option value="Special Juice">Special Juice</option>
              <option value="Citrus Juice">Citrus Juice</option>
              <option value="Fresh Juice">Fresh Juice</option>
              <option value="Seasonal Juice">Seasonal Juice</option>
              <option value="Smoothie">Smoothie</option>
              <option value="Mint Juice">Mint Juice</option>
            </select>

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <input
              placeholder="Image URL. Optional if uploading file"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />

            <input
              placeholder="Badge e.g. NEW, HOT, SALE"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />

            <label className="admin-toggle-row">
              <span>
                Product Status
                <small>
                  {form.active !== false
                    ? 'Active'
                    : 'Inactive'}
                </small>
              </span>

              <input
                type="checkbox"
                checked={form.active !== false}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />

              <b></b>
            </label>

            <button className="whatsapp" type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>

            {editingId && (
              <button
                type="button"
                className="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setImageFile(null);
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        )}

        {active === 'products' && (
          <div className="admin-card">
            <div className="admin-card-head">
              <div>
                <h2>Products</h2>
                <p className="admin-mini-text">
                  Active: {activeProducts.length} | Inactive: {inactiveProducts.length}
                </p>
              </div>

              <button className="whatsapp" onClick={() => setActive('addProduct')}>
                Add New
              </button>
            </div>

            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="admin-products-list">
                {products.map((product) => (
                  <div
                    className={`admin-product ${product.active === false ? 'product-disabled' : ''}`}
                    key={product.id}
                  >
                    <img src={product.image} alt={product.name} />

                    <div>
                      <b>{product.name}</b>

                      <span>
                        {product.category} | Rs. {product.price}
                      </span>

                      <small>{product.badge}</small>

                      <em className={product.active !== false ? 'status-active' : 'status-inactive'}>
                        {product.active !== false ? 'Active' : 'Inactive'}
                      </em>
                    </div>

                    <button
                      type="button"
                      className={`status-toggle ${
                        product.active !== false ? 'is-active' : 'is-inactive'
                      }`}
                      onClick={() => toggleProductStatus(product)}
                    >
                      <span className="toggle-text off-text">OFF</span>
                      <span className="toggle-knob"></span>
                      <span className="toggle-text on-text">ON</span>
                    </button>

                    <button onClick={() => edit(product)}>Edit</button>

                    <button onClick={() => del(product.id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === 'reviews' && (
          <section className="reviews-admin admin-card">
            <div className="reviews-admin-head">
              <div>
                <small>REVIEW MODERATION</small>
                <h2>Customer Reviews</h2>
              </div>

              <button className="outline" onClick={loadAdminData} disabled={loading}>
                Refresh
              </button>
            </div>

            <div className="review-columns">
              <div>
                <h3>Pending Reviews ({pendingReviews.length})</h3>

                {pendingReviews.length === 0 ? (
                  <p>No pending reviews.</p>
                ) : (
                  pendingReviews.map((review) => (
                    <div className="admin-review-card pending" key={review.id}>
                      <div className="review-meta">
                        <b>{review.name}</b>
                        <span>{review.createdAtText || 'Firebase timestamp'}</span>
                      </div>

                      <div className="admin-stars">{'★'.repeat(Number(review.rating || 5))}</div>

                      <p>{review.message}</p>

                      <div className="review-actions">
                        <button onClick={() => approveReview(review.id)}>Approve</button>

                        <button className="danger" onClick={() => removeReview(review.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div>
                <h3>Approved Reviews ({approvedReviews.length})</h3>

                {approvedReviews.length === 0 ? (
                  <p>No approved reviews yet.</p>
                ) : (
                  approvedReviews.map((review) => (
                    <div className="admin-review-card approved" key={review.id}>
                      <div className="review-meta">
                        <b>{review.name}</b>
                        <span>{review.createdAtText || 'Firebase timestamp'}</span>
                      </div>

                      <div className="admin-stars">{'★'.repeat(Number(review.rating || 5))}</div>

                      <p>{review.message}</p>

                      <div className="review-actions">
                        <button onClick={() => hideReview(review.id)}>Move to Pending</button>

                        <button className="danger" onClick={() => removeReview(review.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {active === 'orders' && (
          <section className="orders admin-card">
            <div className="admin-card-head">
              <h2>Recent Orders</h2>

              <button className="outline" onClick={loadAdminData} disabled={loading}>
                Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => {
                  const isOpen = openOrderId === order.id;

                  return (
                    <div className="order-card order-accordion-card" key={order.id}>
                      <button
                        type="button"
                        className="order-summary-row"
                        onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                      >
                        <div>
                          <b>{order.customer?.name || 'Unknown Customer'}</b>
                          <span>{order.createdAtText || 'Firebase timestamp'}</span>
                        </div>

                        <div>
                          <p>{order.customer?.phone || 'N/A'}</p>
                          <strong>Rs. {order.total || 0}</strong>
                        </div>

                        <i>{isOpen ? '▲' : '▼'}</i>
                      </button>

                      {isOpen && (
                        <div className="order-detail-panel">
                          <div className="order-customer-info">
                            <p>
                              <b>Name:</b> {order.customer?.name || 'N/A'}
                            </p>

                            <p>
                              <b>Phone:</b> {order.customer?.phone || 'N/A'}
                            </p>

                            <p>
                              <b>Address:</b> {order.customer?.address || 'N/A'}
                            </p>
                          </div>

                          <div className="order-items">
                            <h4>Order Items</h4>

                            {order.cart?.length ? (
                              order.cart.map((item, index) => (
                                <div
                                  className="order-item-row"
                                  key={`${order.id}-${item.id || index}`}
                                >
                                  <img
                                    src={item.image || mangoFallback}
                                    alt={item.name || 'Product'}
                                  />

                                  <div>
                                    <b>{item.name || 'Unknown Product'}</b>
                                    <span>
                                      Qty: {item.qty || 1} × Rs. {item.price || 0}
                                    </span>
                                  </div>

                                  <strong>
                                    Rs. {Number(item.price || 0) * Number(item.qty || 1)}
                                  </strong>
                                </div>
                              ))
                            ) : (
                              <p>No item detail found.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

