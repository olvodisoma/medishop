import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      // Siker esetén átirányítás a bejelentkezésre
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Hiba történt a regisztráció során.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        
        {/* Fejléc */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-600/30">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Fiók létrehozása
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Regisztrálj a MediShop webáruházba a vásárláshoz
          </p>
        </div>

        {/* Hibaüzenet, ha van */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Regisztrációs űrlap */}
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            
            {/* Név mező */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Teljes név
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Kovács János"
                />
              </div>
            </div>

            {/* E-mail mező */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                E-mail cím
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email5"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="pelda@email.hu"
                />
              </div>
            </div>

            {/* Jelszó mező */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Jelszó (legalább 6 karakter)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

          </div>

          {/* Regisztráció gomb */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg shadow-teal-600/30 transition-all duration-200"
            >
              Regisztráció
            </button>
          </div>

          {/* Váltás bejelentkezésre */}
          <div className="text-center text-sm">
            <span className="text-slate-600">Már van fiókod? </span>
            <Link
              to="/login"
              className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
            >
              Jelentkezz be itt
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Register;