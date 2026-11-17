import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  Building,
  Hash,
  Plus,
  Minus,
} from 'lucide-react';

export default function Cart({ cart, updateCartQuantity, removeFromCart, clearCart }) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const navigate = useNavigate();
  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const phoneRegex = /^[+]?[\d\s-]{6,20}$/;
    if (!phoneRegex.test(phone)) {
      setError('Kérlek adj meg egy érvényes telefonszámot (pl. +36301234567 vagy 06301234567).');
      return;
    }

    const postalCodeRegex = /^\d{4}$/;
    if (!postalCodeRegex.test(postalCode)) {
      setError('Kérlek adj meg egy érvényes 4 számjegyű irányítószámot.');
      return;
    }

    const cityRegex = /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s-]+$/;
    if (!cityRegex.test(city)) {
      setError('Kérlek adj meg egy érvényes városnevet.');
      return;
    }

    const addressRegex = /^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\s.,-]+$/;
    if (!addressRegex.test(address)) {
      setError('Kérlek adj meg egy érvényes címet.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/orders`,
        {
          orderItems: cart,
          shippingAddress: { address, city, postalCode, phone },
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Sikeres rendelés! Köszönjük vásárlásodat.');
      if (clearCart) clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Hiba történt a rendelés feladásakor.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-teal-600" />
          Kosár és Pénztár
        </h1>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-8 text-center font-semibold shadow-xs">
          {success}
          <div className="mt-3">
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Vissza a főoldalra
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl mb-8 text-center text-sm font-medium shadow-xs">
          {error}
        </div>
      )}

      {cart.length === 0 && !success ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-700 mb-1">A kosarad jelenleg üres</h2>
          <p className="text-sm text-slate-500 mb-6">Nézzen szét egészségügyi termékeink között!</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Vissza a vásárláshoz
          </button>
        </div>
      ) : (
        cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Kosárban lévő tételek</h2>
              <div className="space-y-3">
                {cart.map((item, index) => {
                  const qty = item.quantity || 1;
                  const maxStock = item.stock || 999;

                  return (
                    <div
                      key={item._id || index}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={item.imageUrl || 'https://via.placeholder.com/150'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-500 mb-0.5">
                            Egységár: {item.price.toLocaleString()} Ft
                          </p>
                          <span className="text-sm font-semibold text-teal-700 tabular-nums">
                            Részösszeg: {(item.price * qty).toLocaleString()} Ft
                          </span>
                        </div>
                      </div>

                      {/* Darabszám szerkesztő és törlés */}
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(index, qty - 1)}
                            title="Mennyiség csökkentése"
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-white rounded-lg transition cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-800 tabular-nums">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(index, qty + 1)}
                            disabled={qty >= maxStock}
                            title="Mennyiség növelése"
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-white rounded-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          title="Tétel törlése"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                <span className="font-bold text-slate-700">Fizetendő végösszeg:</span>
                <span className="text-xl font-bold text-teal-700 tabular-nums">
                  {totalPrice.toLocaleString()} Ft
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
                <h2 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  Szállítási adatok
                </h2>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Utca, házszám
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="Pl. Kossuth Lajos utca 12."
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Város
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          placeholder="Pl. Budapest"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Irányítószám
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          required
                          placeholder="Pl. 1011"
                          maxLength={4}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Telefonszám
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="+36 30 123 4567"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-6"
                  >
                    <CreditCard className="w-5 h-5" />
                    Rendelés leadása
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}