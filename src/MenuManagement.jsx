import React, { useState } from 'react';

// img imported directly from src/ folder
import jrccLogo from './jrcc.jpg';
import quickbitesLogo from './removebg.png';

// navbar component
function Navbar({ activeTab, setActiveTab, cartItems = [], onOpenCart }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'top-picks', label: "Top Pick's" },
    { id: 'all-menu', label: 'All Menu' },
    { id: 'order-status', label: 'Order Status' },
  ];

  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav style={{
      backgroundColor: '#216900',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      flexWrap: 'nowrap',
      gap: '24px'
    }}>

      {/* Logos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <img 
          src={jrccLogo} 
          alt="JRCC Logo" 
          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <img 
            src={quickbitesLogo} 
            alt="Quickbites Logo" 
            style={{ height: '32px', objectFit: 'contain' }} 
          />
          <span style={{ fontSize: '11px', color: '#FFC107', fontWeight: '900', letterSpacing: '0.8px', marginTop: '2px' }}>
            JRCC CAFETERIA
          </span>
        </div>
      </div>

      {/* search n nav */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '680px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '520px', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '16px', color: '#666666', fontSize: '15px', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search Dishes"
            style={{
              width: '100%',
              padding: '10px 16px 10px 44px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: '#eaeaea',
              fontSize: '14px',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)'
            }}
          />
        </div>

        {/* nav links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', fontSize: '15px', fontWeight: '500' }}>
          {navItems.map((item) => {
            const isAllMenu = item.id === 'all-menu';
            const isActive = activeTab === item.id;
            
            return (
              <span
                key={item.id}
                onClick={isAllMenu ? () => setActiveTab('all-menu') : undefined}
                style={{
                  cursor: isAllMenu ? 'pointer' : 'default',
                  color: isActive ? '#FFC107' : '#ffffff',
                  fontWeight: isActive ? '700' : '500',
                  textDecoration: isActive ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                  transition: 'color 0.2s ease, font-weight 0.2s ease'
                }}
              >
                {item.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* action butts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <button 
          onClick={onOpenCart}
          type="button"
          style={{ border: '1.5px solid #ffffff', backgroundColor: 'transparent', color: '#ffffff', padding: '8px 20px', borderRadius: '25px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          🛒 CART
          {totalCartCount > 0 && (
            <span style={{ backgroundColor: '#FFC107', color: '#000000', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', fontWeight: 'bold', marginLeft: '4px' }}>
              {totalCartCount}
            </span>
          )}
        </button>
        <button style={{ backgroundColor: '#E23D2A', color: '#ffffff', border: 'none', padding: '9px 22px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          👤 Settings
        </button>
      </div>
    </nav>
  );
}

// menu component
function MenuCard({ item, onAddToCart }) {
  const isAvailable = item?.isAvailable ?? true;

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ width: '100%', height: '160px', backgroundColor: '#9ca3af', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: isAvailable ? '#205707' : '#4b5563', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
        <span style={{ position: 'absolute', bottom: '8px', left: '8px', color: '#ffffff', fontWeight: 'bold', fontSize: '18px', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          {item?.name}
        </span>
      </div>

      <div style={{ marginTop: '12px', flex: 1 }}>
        <p style={{ color: '#2B8601', fontWeight: 'bold', fontSize: '20px', margin: '0' }}>₱ {item?.price}</p>
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', lineHeight: '1.4' }}>{item?.description}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
        <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}>☆</button>
        {isAvailable && (
          <button 
            onClick={() => onAddToCart && onAddToCart(item)}
            type="button"
            style={{ backgroundColor: '#216900', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

// cart component
function CartModal({ cartItems, onClose, onClearCart }) {
  const totalAmount = cartItems.reduce((total, item) => total + (parseFloat(item.price || 0) * item.quantity), 0);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#ffffff', width: '90%', maxWidth: '420px', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
          <h2 style={{ margin: 0, color: '#205707', fontSize: '20px', fontWeight: 'bold' }}>🛒 My Cart</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✖</button>
        </div>

        {cartItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', margin: '24px 0' }}>Your cart is currently empty</p>
        ) : (
          <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#1f2937' }}>{item.name}</h4>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>₱{item.price} x {item.quantity}</span>
                </div>
                <span style={{ fontWeight: 'bold', color: '#2B8601', fontSize: '14px' }}>
                  ₱{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>
            <span>TOTAL:</span>
            <span style={{ color: '#205707' }}>₱{totalAmount.toFixed(2)}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          {cartItems.length > 0 && (
            <button onClick={onClearCart} style={{ flex: 1, padding: '10px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Clear Cart
            </button>
          )}
          <button onClick={onClose} style={{ flex: 1, padding: '10px', backgroundColor: '#216900', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ALL MENU SECTION ONLY
export default function MenuManagement({ foods = [] }) {
  const [activeTab, setActiveTab] = useState('all-menu');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const menuItems = foods || [];

  const handleAddToCart = (foodItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === foodItem.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === foodItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...foodItem, quantity: 1 }];
      }
    });
  };

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif', margin: 0 }}>
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartItems={cart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal 
          cartItems={cart} 
          onClose={() => setIsCartOpen(false)} 
          onClearCart={() => setCart([])} 
        />
      )}

      {/* All Menu Section */}
      <div style={{ padding: '32px 16px', flex: 1 }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '52px', 
          fontWeight: '700', 
          letterSpacing: '1px', 
          marginBottom: '32px', 
          marginTop: '0', 
          color: '#000000',
          fontFamily: "'Fredoka', sans-serif"
        }}>
          ALL MENU
        </h1>

        {/* dynamic foods list */}
        {menuItems.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            {menuItems.map((food, index) => (
              <MenuCard key={food.id || index} item={food} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '16px', marginTop: '40px' }}>
            No menu items available.
          </p>
        )}
      </div>

      {/* Footer Section */}
      <footer style={{ backgroundColor: '#216900', color: '#ffffff', padding: '40px 24px 20px 24px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px' }}>
          <div style={{ flex: '1 1 250px' }}>
            <img src={quickbitesLogo} alt="Quickbites Logo" style={{ height: '45px', objectFit: 'contain', marginBottom: '8px' }} />
            <p style={{ color: '#FFC107', fontWeight: 'bold', fontSize: '14px', maxWidth: '200px', lineHeight: '1.3' }}>
              Nourishing students body and spirit
            </p>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <h4 style={{ color: '#FFC107', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>CANTEEN HOURS</h4>
            <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 6px 0' }}>Mon- Fri</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '18px', margin: '0', fontSize: '12px', lineHeight: '1.8', color: '#FFFBEB' }}>
              <li>Breakfast (6:00 to 8:00 AM)</li>
              <li>Lunch (11:00 AM - 1:00 PM)</li>
              <li>Merienda (3:00 - 4:00 PM)</li>
            </ul>
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <h4 style={{ color: '#FFC107', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>NEED HELP?</h4>
            <ul style={{ listStyleType: 'disc', paddingLeft: '18px', margin: '0', fontSize: '12px', lineHeight: '1.8', color: '#FFFBEB' }}>
              <li>How to Order</li>
              <li>Pick-up Guide</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', paddingTop: '20px', fontSize: '11px', color: '#FFC107' }}>
          © 2026 Jesus Reigns Christian College · All rights reserved · QUICKBITES · JRCC Cafeteria Reservation
        </div>
      </footer>

    </div>
  );
}