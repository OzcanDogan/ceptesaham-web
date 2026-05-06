import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser, changePassword } from '../../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import '../../components/layout.css';

const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', fontSize: 14, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', color: '#111', boxSizing: 'border-box', fontFamily: 'inherit' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 };
const focus = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = '#22c55e';
const blur  = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = '#e5e7eb';

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
    try { await updateUser(accountForm); await refreshUser(); setMsg('Bilgiler güncellendi!'); }
    catch { setMsg('Güncelleme başarısız.'); }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) { setMsg('Şifreler eşleşmiyor.'); return; }
    try { await changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword }); setMsg('Şifre değiştirildi!'); setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); }
    catch { setMsg('Şifre değiştirme başarısız.'); }
  };

  const isError = msg.includes('başarısız') || msg.includes('eşleşmiyor');
  const tabs: { key: string; label: string; icon: IconDefinition }[] = [
    { key: 'account',  label: 'Hesap', icon: faUser },
    { key: 'password', label: 'Şifre', icon: faLock },
  ];

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Profil</h1>
      </div>

      {/* Header */}
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#0f1117', margin: 0 }}>{user?.firstName} {user?.lastName}</p>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '3px 0 6px' }}>{user?.email}</p>
          <span style={{ fontSize: 11, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>Saha Sahibi</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => { setTab(key as any); setMsg(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === key ? '#22c55e' : '#fff', color: tab === key ? '#fff' : '#374151', boxShadow: tab === key ? '0 4px 14px rgba(34,197,94,0.3)' : '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <FontAwesomeIcon icon={icon} style={{ fontSize: 14 }} /> {label}
          </button>
        ))}
      </div>

      {msg && (
        <div style={{ padding: '10px 14px', borderRadius: 12, marginBottom: 16, fontSize: 13, fontWeight: 500, background: isError ? '#fef2f2' : '#f0fdf4', color: isError ? '#dc2626' : '#16a34a' }}>
          {msg}
        </div>
      )}

      {tab === 'account' && (
        <form onSubmit={handleAccount} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl}>Ad</label><input style={inp} value={accountForm.firstName} onChange={e => setAccountForm(f => ({ ...f, firstName: e.target.value }))} onFocus={focus} onBlur={blur} /></div>
            <div><label style={lbl}>Soyad</label><input style={inp} value={accountForm.lastName} onChange={e => setAccountForm(f => ({ ...f, lastName: e.target.value }))} onFocus={focus} onBlur={blur} /></div>
          </div>
          <div><label style={lbl}>Telefon</label><input style={inp} value={accountForm.phoneNumber} onChange={e => setAccountForm(f => ({ ...f, phoneNumber: e.target.value }))} onFocus={focus} onBlur={blur} /></div>
          <button type="submit" style={{ padding: 13, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>Kaydet</button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePassword} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(['oldPassword', 'newPassword', 'confirmNewPassword'] as const).map((field, i) => (
            <div key={field}>
              <label style={lbl}>{['Mevcut Şifre', 'Yeni Şifre', 'Yeni Şifre (Tekrar)'][i]}</label>
              <input type="password" style={inp} value={passwordForm[field]} onChange={e => setPasswordForm(f => ({ ...f, [field]: e.target.value }))} onFocus={focus} onBlur={blur} placeholder="••••••••" />
            </div>
          ))}
          <button type="submit" style={{ padding: 13, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>Şifreyi Değiştir</button>
        </form>
      )}
    </div>
  );
}
