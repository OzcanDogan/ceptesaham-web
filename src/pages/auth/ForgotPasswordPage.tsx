import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ token?: string; message?: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await forgotPassword(email);
      setResult(data);
    } catch {
      setError('E-posta bulunamadı.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Token Alındı</h2>
          {result.token && (
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">Sıfırlama Token'ı (Demo Mod)</p>
              <p className="font-mono text-sm break-all">{result.token}</p>
            </div>
          )}
          <button
            onClick={() => navigate('/reset-password', { state: { email, token: result.token } })}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Şifreyi Sıfırla
          </button>
          <Link to="/login" className="block mt-3 text-sm text-green-600 hover:underline">
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800">Şifremi Unuttum</h1>
          <p className="text-gray-500 text-sm mt-1">E-posta adresinizi girin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="ornek@email.com"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Gönderiliyor...' : 'Token Gönder'}
          </button>
        </form>

        <Link to="/login" className="block mt-4 text-center text-sm text-green-600 hover:underline">
          Geri dön
        </Link>
      </div>
    </div>
  );
}
