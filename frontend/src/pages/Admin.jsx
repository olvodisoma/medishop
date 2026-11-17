import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, PlusCircle, Package, ClipboardList, CheckCircle, Truck, Tag, DollarSign, Layers, FileText } from 'lucide-react';

export default function Admin({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [productSuccess, setProductSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Ehhez az oldalhoz admin jogosultság szükséges!');
      navigate('/');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = () => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setOrders(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Nem sikerült betölteni a rendeléseket.');
      setLoading(false);
    });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/orders/${orderId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Hiba státusz módosításakor:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/products`, {
        name, 
        description, 
        price: Number(price), 
        category, 
        stock: Number(stock)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductSuccess('Termék sikeresen rögzítve az adatbázisban!');
      setName(''); setDescription(''); setPrice(''); setCategory(''); setStock('');
      setTimeout(() => setProductSuccess(''), 4000);
    } catch (err) {
      console.error('Termék mentési hiba:', err.response?.data || err.message);
      alert('Hiba történt: ' + (err.response?.data?.message || err.message));
    }
  };

  if (user?.role !== 'admin') {
    return <div className="p-12 text-center text-rose-600 font-bold">Hozzáférés megtagadva.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
        <div className="bg-teal-600 text-white p-3 rounded-2xl shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Adminisztrációs Vezérlőpult
          </h1>
          <p className="text-sm text-slate-500">
            Termékek kezelése és beérkezett megrendelések áttekintése
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-teal-600" />
              Új Termék Felvétele
            </h2>

            {productSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl mb-4 text-xs font-semibold text-center">
                {productSuccess}
              </div>
            )}
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Termék neve
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    placeholder="Pl. Digitális vérnyomásmérő"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Kategória
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    required 
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition appearance-none"
                  >
                    <option value="">-- Válassz kategóriát --</option>
                    <option value="Diagnosztikai eszközök">Diagnosztikai eszközök</option>
                    <option value="Védőfelszerelések">Védőfelszerelések</option>
                    <option value="Elsősegély készletek">Elsősegély készletek</option>
                    <option value="Ápolási kellékek">Ápolási kellékek</option>
                    <option value="Fertőtlenítő szerek">Fertőtlenítő szerek</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Ár (Ft)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      required 
                      placeholder="4990"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Készlet (db)
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="number" 
                      value={stock} 
                      onChange={e => setStock(e.target.value)} 
                      required 
                      placeholder="15"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Részletes leírás
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    required 
                    rows="3"
                    placeholder="Termék specifikációi..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition resize-none" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition shadow-sm cursor-pointer mt-2"
              >
                Termék rögzítése
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
              <ClipboardList className="w-5 h-5 text-teal-600" />
              Leadott Rendelések Áttekintése
            </h2>

            {loading && <p className="text-slate-500 text-center py-8 text-sm">Rendelések betöltése...</p>}
            {error && <p className="text-rose-600 text-center py-8 text-sm">{error}</p>}
            {!loading && orders.length === 0 && (
              <p className="text-slate-500 text-center py-8 text-sm">Még nincsenek leadott rendelések.</p>
            )}
            
            <div className="space-y-4">
              {orders.map(order => (
                <div 
                  key={order._id} 
                  className="border border-slate-200/80 p-5 rounded-2xl bg-slate-50/50 flex flex-col justify-between gap-4 transition hover:bg-white hover:shadow-xs"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        ID: {order._id.slice(-6)}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        order.status === 'Függőben' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 mb-1">
                      <span className="font-semibold text-slate-900">Vásárló:</span> {order.user?.name || order.user?.email || 'Ismeretlen'}
                    </p>
                    <p className="text-sm text-slate-700 mb-3">
                      <span className="font-semibold text-slate-900">Cím:</span> {order.shippingAddress?.address}, {order.shippingAddress?.city} ({order.shippingAddress?.postalCode}) | Tel: {order.shippingAddress?.phone}
                    </p>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 mb-3">
                      <span className="font-semibold text-slate-800 block mb-1">Megrendelt tételek:</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {order.orderItems.map((item, idx) => (
                          <li key={idx} className="truncate">
                            {item.name} ({item.quantity || 1} db) — <span className="font-medium text-slate-900">{(item.price * (item.quantity || 1)).toLocaleString()} Ft</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                    <span className="text-base font-bold text-teal-700 tabular-nums">
                      {order.totalPrice.toLocaleString()} Ft
                    </span>

                    <div className="flex gap-2">
                      {order.status === 'Függőben' && (
                        <button 
                          onClick={() => handleUpdateStatus(order._id, 'Elfogadva')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Elfogadás
                        </button>
                      )}
                      {order.status !== 'Teljesítve' && (
                        <button 
                          onClick={() => handleUpdateStatus(order._id, 'Teljesítve')}
                          className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Teljesítve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}