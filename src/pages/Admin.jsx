import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  addFirebaseProduct,
  deleteFirebaseProduct,
  getFirebaseOrders,
  getFirebaseProducts,
  seedDefaultProductsIfEmpty,
  updateFirebaseProduct,
  uploadProductImage
} from '../firebase/firebaseApi';
import { auth } from '../firebase/config';
import mangoFallback from '../assets/mango.png';
import './Admin.css';

const emptyForm = { name:'', category:'', description:'', price:'', image:'', badge:'NEW' };

export default function Admin(){
 const [user,setUser]=useState(null);
 const [authReady,setAuthReady]=useState(false);
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [products,setProducts]=useState([]);
 const [orders,setOrders]=useState([]);
 const [form,setForm]=useState(emptyForm);
 const [imageFile,setImageFile]=useState(null);
 const [editingId,setEditingId]=useState(null);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [loading,setLoading]=useState(false);

 useEffect(()=>{
   const unsubscribe = onAuthStateChanged(auth, currentUser => {
     setUser(currentUser);
     setAuthReady(true);
   });
   return unsubscribe;
 },[]);

 useEffect(()=>{
   if(user) loadAdminData();
 },[user]);

 const loadAdminData=async()=>{
   setLoading(true);
   try{
     const [firebaseProducts, firebaseOrders] = await Promise.all([
       getFirebaseProducts(),
       getFirebaseOrders()
     ]);
     setProducts(firebaseProducts);
     setOrders(firebaseOrders);
     setError('');
   }catch(err){
     setError(err.message || 'Firebase data load nahi ho saka. Firebase config aur security rules check karein.');
   }finally{
     setLoading(false);
   }
 };

 const login=async(e)=>{
   e.preventDefault();
   setError('');
   setLoading(true);
   try{
     await signInWithEmailAndPassword(auth, email, password);
     setPassword('');
   }catch(err){
     setError('Invalid email or password. Please try again.');
   }finally{
     setLoading(false);
   }
 };

 const logout=async()=>{
   await signOut(auth);
   setUser(null);
   setProducts([]);
   setOrders([]);
 };

 const seedProducts=async()=>{
   setError('');
   setNotice('');
   setLoading(true);
   try{
     const next = await seedDefaultProductsIfEmpty();
     setProducts(next);
     setNotice('Default products Firestore mein seed ho gaye. Agar pehle products thay to duplicate nahi banay.');
     window.dispatchEvent(new Event('kfj-products-updated'));
   }catch(err){
     setError(err.message || 'Default products seed nahi ho sakay.');
   }finally{
     setLoading(false);
   }
 };

 const submit=async(e)=>{
   e.preventDefault();
   setError('');
   setNotice('');
   setLoading(true);
   try{
     let imageUrl = form.image;
     if(imageFile){
       imageUrl = await uploadProductImage(imageFile);
     }
     const product={...form, price:Number(form.price), image:imageUrl || mangoFallback};
     const next = editingId ? await updateFirebaseProduct(editingId, product) : await addFirebaseProduct(product);
     setProducts(next);
     setForm(emptyForm);
     setImageFile(null);
     setEditingId(null);
     setNotice('Product Firebase mein save ho gaya. View Full Menu mein show hoga.');
     window.dispatchEvent(new Event('kfj-products-updated'));
   }catch(err){
     setError(err.message || 'Product save nahi ho saka. Firestore/Storage rules check karein.');
   }finally{
     setLoading(false);
   }
 };

 const edit=(p)=>{setEditingId(p.id);setForm({...p});setImageFile(null); window.scrollTo({top:0,behavior:'smooth'});};
 const del=async(id)=>{
   if(!confirm('Delete this product?')) return;
   setError('');
   setLoading(true);
   try{
     const next = await deleteFirebaseProduct(id);
     setProducts(next);
     window.dispatchEvent(new Event('kfj-products-updated'));
   }catch(err){ setError(err.message || 'Delete failed.'); }
   finally{ setLoading(false); }
 };

 if(!authReady) return <main className="admin-page"><div className="admin-login glass"><h1>Loading...</h1></div></main>;

 if(!user) return <main className="admin-page">
   <form className="admin-login glass" onSubmit={login}>
     <h1>Kashmiri Fresh Juices</h1>
     <small>SECURE ADMIN LOGIN</small>
     <input type="email" placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)} required />
     <input type="password" placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} required />
     {error && <p className="admin-error">{error}</p>}
     <button className="whatsapp" type="submit" disabled={loading}>{loading ? 'Checking...' : 'Login'}</button>
     <Link className="outline" to="/">Back to Website</Link>
     {/* <p className="security-note">Password frontend code mein nahi hai. Firebase Authentication se verify hota hai.</p> */}
   </form>
 </main>;

 return <main className="admin-page">
  <div className="admin-header">
    <div>
      <small> PRODUCT MANAGEMENT</small>
      <h1>Admin Panel</h1>
      <p className="admin-status">Logged in: {user.email}</p>
    </div>
    <div>
      <Link className="outline" to="/">Website</Link>
      <button className="outline" onClick={seedProducts} disabled={loading}>Seed Default Products</button>
      <button className="whatsapp" onClick={logout}>Logout</button>
    </div>
  </div>
  {error && <p className="admin-error wide">{error}</p>}
  {notice && <p className="admin-success wide">{notice}</p>}
  <section className="admin-grid">
    <form className="product-form glass" onSubmit={submit}>
      <h2>{editingId?'Edit Product':'Add Product'}</h2>
      <input placeholder="Product Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
      <select
  value={form.category}
  onChange={e => setForm({ ...form, category: e.target.value })}
  required
>
  <option value="">Select Category</option>
  <option value="Special Juice">Special Juice</option>
  <option value="Citrus Juice">Citrus Juice</option>
  <option value="Fresh Juice">Fresh Juice</option>
  <option value="Seasonal Juice">Seasonal Juice</option>
  <option value="Smoothie">Smoothie</option>
</select>
      <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/>
      <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required/>
      <input placeholder="Image URL. Optional if uploading file" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/>
      <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} />
      <input placeholder="Badge" value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}/>
      <button className="whatsapp" type="submit" disabled={loading}>{loading ? 'Saving...' : editingId?'Update Product':'Add Product'}</button>
      {editingId&&<button type="button" className="outline" onClick={()=>{setEditingId(null);setForm(emptyForm);setImageFile(null)}}>Cancel Edit</button>}
      <p className="security-note">New product Firestore mein save hoga aur /all-products page par show hoga.</p>
    </form>
    <div className="admin-list glass">
      <h2>Products</h2>
      {products.length===0 && <p>No products found. Seed Default Products ya Add Product use karein.</p>}
      {products.map(p=><div className="admin-product" key={p.id}>
        <img src={p.image} alt={p.name}/>
        <div><b>{p.name}</b><span>{p.category} | Rs. {p.price}</span></div>
        <button onClick={()=>edit(p)}>Edit</button>
        <button onClick={()=>del(p.id)}>Delete</button>
      </div>)}
    </div>
  </section>
  <section className="orders glass">
    <h2>Recent Orders</h2>
    {orders.length===0?<p>No orders yet.</p>:orders.map(order=><div className="order-card" key={order.id}>
      <b>{order.customer?.name} - Rs. {order.total}</b>
      <span>{order.createdAtText || 'Firebase timestamp'}</span>
      <p>{order.customer?.phone}<br/>{order.customer?.address}</p>
    </div>)}
  </section>
 </main>
}