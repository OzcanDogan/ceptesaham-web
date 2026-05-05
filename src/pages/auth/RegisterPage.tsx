import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/auth';

export default function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', tcKimlik: '', userType: 'Player' as 'Player' | 'BusinessOwner',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
      const data = await login({ email: form.email, password: form.password });
      await signIn(data.token);
      navigate(form.userType === 'BusinessOwner' ? '/business/dashboard' : '/player/fields');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚽</div>
          <h1 className="text-2xl font-bold text-green-700">Hesap Oluştur</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
              <input className={inputClass} value={form.firstName} onChange={set('firstName')} required placeholder="Adınız" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
              <input className={inputClass} value={form.lastName} onChange={set('lastName')} required placeholder="Soyadınız" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input type="email" className={inputClass} value={form.email} onChange={set('email')} required placeholder="ornek@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input className={inputClass} value={form.phoneNumber} onChange={set('phoneNumber')} required placeholder="05xx xxx xx xx" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
            <input className={inputClass} value={form.tcKimlik} onChange={set('tcKimlik')} required maxLength={11} placeholder="11 haneli TC kimlik" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <input type="password" className={inputClass} value={form.password} onChange={set('password')} required placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre Tekrar</label>
              <input type="password" className={inputClass} value={form.confirmPassword} onChange={set('confirmPassword')} required placeholder="••••••••" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Türü</label>
            <select className={inputClass} value={form.userType} onChange={set('userType')}>
              <option value="Player">Oyuncu</option>
              <option value="BusinessOwner">Saha Sahibi</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
