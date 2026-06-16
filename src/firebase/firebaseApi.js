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
  updateDoc,
} from 'firebase/firestore';

import { db } from './config.js';
import { defaultProducts } from '../data/defaultProducts';

/* =========================
   COLLECTIONS
========================= */
const productsRef = collection(db, 'products');
const ordersRef = collection(db, 'orders');
const reviewsRef = collection(db, 'reviews');

/* =========================
   PRODUCTS
========================= */

export async function getFirebaseProducts() {
  const snapshot = await getDocs(query(productsRef, orderBy('createdAt', 'asc')));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
    active: item.data().active !== false,
  }));
}

export async function seedDefaultProductsIfEmpty() {
  const current = await getFirebaseProducts();
  if (current.length) return current;

  await Promise.all(
    defaultProducts.map((product, index) => {
      const safeId = String(product.id || Date.now() + index);

      return setDoc(doc(db, 'products', safeId), {
        name: product.name,
        category: product.category,
        description: product.description,
        price: Number(product.price || 0),
        image: product.image,
        badge: product.badge || 'FRESH',
        active: product.active !== false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    })
  );

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
    active: product.active !== false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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
    active: product.active !== false,
    updatedAt: serverTimestamp(),
  });

  return getFirebaseProducts();
}

export async function deleteFirebaseProduct(id) {
  await deleteDoc(doc(db, 'products', String(id)));
  return getFirebaseProducts();
}

/* =========================
   CLOUDINARY IMAGE UPLOAD
========================= */

export async function uploadProductImage(file) {
  if (!file) return '';

  const cloudName = "dv2cobsur";
  const uploadPreset = "juice_upload";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary image upload failed");
  }

  return data.secure_url;
}

/* =========================
   ORDERS
========================= */

export async function saveFirebaseOrder(order) {
  await addDoc(ordersRef, {
    ...order,
    total: Number(order.total || 0),
    createdAt: serverTimestamp(),
    createdAtText: new Date().toLocaleString(),
  });
}

export async function getFirebaseOrders() {
  const snapshot = await getDocs(query(ordersRef, orderBy('createdAt', 'desc')));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/* =========================
   REVIEWS
========================= */

export async function submitFirebaseReview(review) {
  await addDoc(reviewsRef, {
    name: String(review.name || '').trim(),
    message: String(review.message || '').trim(),
    rating: Number(review.rating || 5),
    status: 'pending',
    createdAt: serverTimestamp(),
    createdAtText: new Date().toLocaleString(),
  });
}

export async function getAllFirebaseReviews() {
  const snapshot = await getDocs(query(reviewsRef, orderBy('createdAt', 'desc')));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getApprovedFirebaseReviews() {
  const allReviews = await getAllFirebaseReviews();
  return allReviews.filter((review) => review.status === 'approved');
}

export async function approveFirebaseReview(id) {
  await updateDoc(doc(db, 'reviews', String(id)), {
    status: 'approved',
    updatedAt: serverTimestamp(),
  });

  return getAllFirebaseReviews();
}

export async function hideFirebaseReview(id) {
  await updateDoc(doc(db, 'reviews', String(id)), {
    status: 'pending',
    updatedAt: serverTimestamp(),
  });

  return getAllFirebaseReviews();
}

export async function deleteFirebaseReview(id) {
  await deleteDoc(doc(db, 'reviews', String(id)));
  return getAllFirebaseReviews();
}
