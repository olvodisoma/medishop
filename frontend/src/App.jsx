import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function MainApp() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = useCallback((isManual = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
    setCart([]);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout(false);
      }, 30 * 60 * 1000);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, handleLogout]);

  // Javított, immutábilis kosárba helyezés (megszünteti a dupla hozzáadást StrictMode-ban)
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item._id === product._id);
      if (existingIndex > -1) {
        return prevCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Darabszám módosítása közvetlenül a kosárban
  const updateCartQuantity = (indexToUpdate, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(indexToUpdate);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item, index) => {
        if (index !== indexToUpdate) return item;
        const maxStock = item.stock || 999;
        const validQty = Math.min(newQuantity, maxStock);
        return { ...item, quantity: validQty };
      })
    );
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {user && (
        <Navbar
          cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
          user={user}
          onLogout={() => handleLogout(true)}
        />
      )}

      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Home addToCart={addToCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute user={user}>
                <Cart
                  cart={cart}
                  updateCartQuantity={updateCartQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user}>
                <Admin user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-sm border-t border-slate-800">
        <p className="font-medium text-slate-300">MediShop – Egészségügyi Kellékek Webáruháza</p>
        <p className="text-xs mt-1">&copy; 2026 Szakdolgozati Projekt | Neumann János Egyetem</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}