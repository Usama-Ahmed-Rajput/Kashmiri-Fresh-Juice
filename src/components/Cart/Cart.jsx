import { useState, useMemo } from 'react';
import './Cart.css';

export default function Cart({
  open,
  onClose,
  cart,
  changeQty,
  removeItem
}) {
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // total calculate clean way
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  // WhatsApp message builder
  const buildMessage = () => {
    let itemsText = cart
      .map(
        (item) =>
          `• ${item.name} x${item.qty} = Rs ${item.price * item.qty}`
      )
      .join('\n');

    return `
New Order 🛒

Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}

Items:
${itemsText}

Total: Rs ${total}
    `;
  };

  const checkout = (e) => {
    e.preventDefault();
    if (!cart.length) return;

    const msg = encodeURIComponent(buildMessage());
    const whatsappNumber = '92XXXXXXXXXX'; // apna number

    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className={`cart-drawer ${open ? 'show' : ''}`}>
      <div className="cart-overlay" onClick={onClose}></div>

      <aside className="cart-panel">
        <button className="close-cart" onClick={onClose}>X</button>

        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p>Cart empty hai</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>

              <div>
                <button onClick={() => changeQty(item.id, -1)}>-</button>
                {item.qty}
                <button onClick={() => changeQty(item.id, 1)}>+</button>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          ))
        )}

        <h3>Total: Rs {total}</h3>

        <form onSubmit={checkout}>
          <input
            placeholder="Name"
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Address"
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />

          <button type="submit">
            Checkout on WhatsApp
          </button>
        </form>
      </aside>
    </div>
  );
}
