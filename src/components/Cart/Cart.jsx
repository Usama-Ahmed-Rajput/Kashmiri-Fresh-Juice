import { useState } from 'react';
import './Cart.css';

export default function Cart({
  open,
  onClose,
  cart,
  changeQty,
  removeItem,
  checkout
}) {
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const submit = (e) => {
    e.preventDefault();
    if (!cart.length) return;
    checkout(customer);
  };

  return (
    <div className={`cart-drawer ${open ? 'show' : ''}`}>
      <div className="cart-overlay" onClick={onClose}></div>

      <aside className="cart-panel">
        <button className="close-cart" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <small>ONLINE ORDERING</small>
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p className="empty-cart">
            Your cart is empty. Please add items from the menu.
          </p>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div>
                  <b>{item.name}</b>
                  <span>Rs. {item.price}</span>

                  <div className="qty">
                    <button onClick={() => changeQty(item.id, -1)}>-</button>
                    <strong>{item.qty}</strong>
                    <button onClick={() => changeQty(item.id, 1)}>+</button>

                    <button
                      className="remove"
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-total">
          <span>Total</span>
          <b>Rs. {total}</b>
        </div>

        <form className="checkout-form" onSubmit={submit}>
          <input
            placeholder="Your Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
            required
          />

          <input
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Delivery Address"
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
            required
          ></textarea>

          <button className="whatsapp" type="submit">
            <i className="fa-brands fa-whatsapp"></i> Checkout on WhatsApp
          </button>
        </form>
      </aside>
    </div>
  );
}
