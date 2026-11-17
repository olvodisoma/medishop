import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      setSuccess('Sikeres regisztráció! Hamarosan átirányítunk a bejelentkezéshez...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Hiba történt a regisztráció során.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-10 border">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Regisztráció</h2>
      
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm text-center">{success}</p>}
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Név</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email cím</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Jelszó</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
        >
          Regisztrálok
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Már van fiókod? <Link to="/login" className="text-blue-600 hover:underline">Jelentkezz be itt</Link>
      </p>
    </div>
  );
}