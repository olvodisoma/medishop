import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">404</h1>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Az oldal nem található</h2>
        <p className="text-sm text-slate-500 mb-6">
          A keresett oldal nem létezik, vagy el lett távolítva a címsorból.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Vissza a főoldalra
        </button>
      </div>
    </div>
  );
}