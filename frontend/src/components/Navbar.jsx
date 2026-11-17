import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, LogOut, Activity } from 'lucide-react';

export default function Navbar({ cartCount, user, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logó */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-teal-600 text-white p-2 rounded-xl group-hover:bg-teal-700 transition">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Medi<span className="text-teal-600">Shop</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-500 -mt-1">
                Egészségügyi szakáruház
              </span>
            </div>
          </Link>

          {/* Jobb oldali menüpontok */}
          <div className="flex items-center gap-3 sm:gap-5">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-lg transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin felület</span>
              </Link>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-slate-700 hover:text-teal-600 bg-slate-100 hover:bg-teal-50 px-3.5 py-2 rounded-xl transition font-medium text-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Kosár</span>
              {cartCount > 0 && (
                <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 hidden md:inline">
                {user?.name || user?.email}
              </span>
              <button
                onClick={onLogout}
                title="Kijelentkezés"
                className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Kilépés</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}