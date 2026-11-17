import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingBag, CheckCircle2, Truck, Shield, PackageX } from 'lucide-react';

const CATEGORIES = [
  'Összes',
  'Diagnosztikai eszközök',
  'Védőfelszerelések',
  'Elsősegély készletek',
  'Ápolási kellékek',
  'Fertőtlenítő szerek',
];

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Összes');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const [quantities, setQuantities] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Hiba a termékek betöltésekor:', err);
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (productId, qty) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, Number(qty)) }));
  };

  const handleAddWithFeedback = (product) => {
    const qty = quantities[product._id] || 1;
    addToCart(product, qty);
    setAddedId(product._id);
    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Összes' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-16">
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-sky-700 text-white py-12 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/15 backdrop-blur-xs text-teal-50 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Hitelesített egészségügyi eszközök
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Gondoskodjon egészségéről megbízható eszközökkel
            </h1>
            <p className="text-teal-50 text-base sm:text-lg leading-relaxed">
              Válogasson minősített diagnosztikai műszereink, védőfelszereléseink és otthoni ápolási kellékeink közül gyors házhozszállítással.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/15 text-sm">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-teal-200 shrink-0" />
              <span>CE minősített orvostechnikai termékek</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-teal-200 shrink-0" />
              <span>Gyors, biztonságos kiszállítás</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-200 shrink-0" />
              <span>Ellenőrzött raktárkészlet</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 mb-8">
          <div className="relative max-w-md mb-4">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Keresés termék név vagy leírás alapján..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Termékek betöltése...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <PackageX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Nincs a keresésnek megfelelő termék.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold text-slate-800 mb-1.5 line-clamp-1">
                      {product.name}
                    </h2>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-slate-900 tabular-nums">
                      {product.price.toLocaleString()} Ft
                    </span>
                    {product.stock > 0 ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Raktáron ({product.stock})
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                        Elfogyott
                      </span>
                    )}
                  </div>

                  {product.stock > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-slate-600">Mennyiség:</span>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantities[product._id] || 1}
                        onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                        className="w-16 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <span className="text-xs text-slate-400">db</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleAddWithFeedback(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                      addedId === product._id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : product.stock > 0
                        ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {addedId === product._id
                      ? 'Hozzáadva a kosárhoz!'
                      : product.stock > 0
                      ? 'Kosárba teszem'
                      : 'Jelenleg nem elérhető'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}