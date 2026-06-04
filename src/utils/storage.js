import { defaultProducts } from '../data/defaultProducts';
export const PRODUCTS_KEY = 'kfj_products';
export const ORDERS_KEY = 'kfj_orders';
export const ADMIN_KEY = 'kfj_admin_logged_in';

export function getProducts(){
  const saved = localStorage.getItem(PRODUCTS_KEY);
  if(!saved){ localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts)); return defaultProducts; }
  try { return JSON.parse(saved); } catch { return defaultProducts; }
}
export function saveProducts(products){ localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }
export function saveOrder(order){
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
export function getOrders(){ return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); }
