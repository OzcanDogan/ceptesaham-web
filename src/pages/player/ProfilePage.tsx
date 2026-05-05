import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser, changePassword } from '../../api/auth';
import { getMyProfile, createOrUpdateProfile } from '../../api/playerProfile';
import { PlayerProfile } from '../../types';
import { User, Lock, Trophy, Target } from 'lucide-react';

const POSITIONS = ['Kaleci', 'Defans', 'Orta Saha', 'Forvet'];
const FEET = ['Sağ', 'Sol', 'Her İkisi'];
const LEVELS = ['Başlangıç', 'Orta', 'İleri', 'Profesyonel'];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [tab, setTab] = useState<'account' | 'stats' | 'password'>('account');
  const [msg, setMsg] = useState('');

  const [accountForm, setAccountForm] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [profileForm, setProfileForm] = useState({
    displayName: '', preferredPosition: 'Forvet', dominantFoot: 'Sağ',
    skillLevel: 'Orta', age: '', bio: '',
  });

  useEffect(() => {
    if (user) setAccountForm({ firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber });
    getMyProfile().then(p => {
      setProfile(p);
      setProfileForm({
        displayName: p.displayName || '',
        preferredPosition: p.preferredPosition || 'Forvet',
        dominantFoot: p.dominantFoot || 'Sağ',
        skillLevel: p.skillLevel || 'Orta',
        age: p.age?.toString() || '',
        bio: p.bio || '',
      });
    }).catch(() => {});
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

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrUpdateProfile({
        displayName: profileForm.displayName,
        preferredPosition: profileForm.preferredPosition,
        dominantFoot: profileForm.dominantFoot,
        skillLevel: profileForm.skillLevel,
        age: profileForm.age ? parseInt(profileForm.age) : undefined,
        bio: profileForm.bio,
      });
      setMsg('Profil güncellendi!');
    } catch { setMsg('Güncelleme başarısız.'); }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm";
  const selectClass = inputClass;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profil</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
            <p className="text-gray-500">{user?.email}</p>
            {profile && (
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-gray-600"><b className="text-green-700">{profile.totalMatchesPlayed}</b> Maç</span>
                <span className="text-gray-600"><b className="text-green-700">{profile.wins}</b> Galibiyet</span>
                <span className="text-gray-600"><b className="text-green-700">{profile.goalsScored}</b> Gol</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'account', label: 'Hesap', icon: User },
          { key: 'stats', label: 'Oyuncu Profili', icon: Trophy },
          { key: 'password', label: 'Şifre', icon: Lock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setTab(key as any); setMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
              ${tab === key ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
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

      {tab === 'stats' && (
        <form onSubmit={handleProfile} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Görünen Ad</label>
            <input className={inputClass} value={profileForm.displayName} onChange={e => setProfileForm(f => ({ ...f, displayName: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Pozisyon</label>
              <select className={selectClass} value={profileForm.preferredPosition} onChange={e => setProfileForm(f => ({ ...f, preferredPosition: e.target.value }))}>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Dominant Ayak</label>
              <select className={selectClass} value={profileForm.dominantFoot} onChange={e => setProfileForm(f => ({ ...f, dominantFoot: e.target.value }))}>
                {FEET.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Seviye</label>
              <select className={selectClass} value={profileForm.skillLevel} onChange={e => setProfileForm(f => ({ ...f, skillLevel: e.target.value }))}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Yaş</label>
              <input type="number" className={inputClass} value={profileForm.age} onChange={e => setProfileForm(f => ({ ...f, age: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Hakkımda</label>
            <textarea className={inputClass + ' resize-none h-24'} value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          {profile && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Gol', val: profile.goalsScored },
                { label: 'Asist', val: profile.assists },
                { label: 'Galibiyet', val: profile.wins },
              ].map(({ label, val }) => (
                <div key={label} className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-green-700">{val}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          )}
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
