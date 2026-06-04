import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config.js';
import { defaultProducts } from '../data/defaultProducts';

const productsRef = collection(db, 'products');
const ordersRef = collection(db, 'orders');

export async function getFirebaseProducts() {
  const snapshot = await getDocs(query(productsRef, orderBy('createdAt', 'asc')));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

export async function seedDefaultProductsIfEmpty() {
  const current = await getFirebaseProducts();
  if (current.length) return current;
  await Promise.all(defaultProducts.map((product, index) => {
    const safeId = String(product.id || Date.now() + index);
    return setDoc(doc(db, 'products', safeId), {
      name: product.name,
      category: product.category,
      description: product.description,
      price: Number(product.price || 0),
      image: product.image,
      badge: product.badge || 'FRESH',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }));
  return getFirebaseProducts();
}

export async function addFirebaseProduct(product) {
  await addDoc(productsRef, {
    name: String(product.name || '').trim(),
    category: String(product.category || '').trim(),
    description: String(product.description || '').trim(),
    price: Number(product.price || 0),
    image: String(product.image || '').trim(),
    badge: String(product.badge || 'NEW').trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return getFirebaseProducts();
}

export async function updateFirebaseProduct(id, product) {
  await updateDoc(doc(db, 'products', String(id)), {
    name: String(product.name || '').trim(),
    category: String(product.category || '').trim(),
    description: String(product.description || '').trim(),
    price: Number(product.price || 0),
    image: String(product.image || '').trim(),
    badge: String(product.badge || 'FRESH').trim(),
    updatedAt: serverTimestamp()
  });
  return getFirebaseProducts();
}

export async function deleteFirebaseProduct(id) {
  await deleteDoc(doc(db, 'products', String(id)));
  return getFirebaseProducts();
}

export async function saveFirebaseOrder(order) {
  await addDoc(ordersRef, {
    ...order,
    total: Number(order.total || 0),
    createdAt: serverTimestamp(),
    createdAtText: new Date().toLocaleString()
  });
}

export async function getFirebaseOrders() {
  const snapshot = await getDocs(query(ordersRef, orderBy('createdAt', 'desc')));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

export async function uploadProductImage(file) {
  if (!file) return '';
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const imageRef = ref(storage, `products/${Date.now()}-${cleanName}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}
