import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser, changePassword } from '../../api/auth';
import { User, Lock } from 'lucide-react';

export default function BusinessProfilePage() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState<'account' | 'password'>('account');
  const [msg, setMsg] = useState('');
  const [accountForm, setAccountForm] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });

  useEffect(() => {
    if (user) setAccountForm({ firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber });
  }, [user]);

  const handleAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(accountForm);
      await refreshUser();
      setMsg('Bilgiler güncellendi!');
    } catch { setMsg('Güncelleme başarısız.'); }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setMsg('Şifreler eşleşmiyor.'); return;
    }
    try {
      await changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword });
      setMsg('Şifre değiştirildi!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch { setMsg('Şifre değiştirme başarısız.'); }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profil</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
          <p className="text-gray-500">{user?.email}</p>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Saha Sahibi</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'account', label: 'Hesap', icon: User },
          { key: 'password', label: 'Şifre', icon: Lock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setTab(key as any); setMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${tab === key ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {msg && (
        <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${msg.includes('başarısız') || msg.includes('eşleşmiyor') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      {tab === 'account' && (
        <form onSubmit={handleAccount} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Ad</label>
              <input className={inputClass} value={accountForm.firstName} onChange={e => setAccountForm(f => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Soyad</label>
              <input className={inputClass} value={accountForm.lastName} onChange={e => setAccountForm(f => ({ ...f, lastName: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Telefon</label>
            <input className={inputClass} value={accountForm.phoneNumber} onChange={e => setAccountForm(f => ({ ...f, phoneNumber: e.target.value }))} />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700">
            Kaydet
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePassword} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          {['oldPassword', 'newPassword', 'confirmNewPassword'].map((field, i) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {['Mevcut Şifre', 'Yeni Şifre', 'Yeni Şifre (Tekrar)'][i]}
              </label>
              <input
                type="password"
                className={inputClass}
                value={(passwordForm as any)[field]}
                onChange={e => setPasswordForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700">
            Şifreyi Değiştir
          </button>
        </form>
      )}
    </div>
  );
}
