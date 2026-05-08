import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThLarge, faCalendar, faWallet, faTrophy, faUsers, faUserCircle,
  faBuilding, faClipboardList, faCog, faSignOutAlt, faBars, faTimes, faFire, faClock
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import './layout.css';
import logo from '../assets/logo-png.png';

const playerNav: { to: string; icon: IconDefinition; label: string }[] = [
  { to: '/player/fields', icon: faThLarge, label: 'Sahalar' },
  { to: '/player/matches', icon: faFire, label: 'Maçlar' },
  { to: '/player/reservations', icon: faCalendar, label: 'Rezervasyonlarım' },
  { to: '/player/wallet', icon: faWallet, label: 'Cüzdan' },
  { to: '/player/leaderboard', icon: faTrophy, label: 'Liderlik' },
  { to: '/player/finder', icon: faUsers, label: 'Oyuncu Bul' },
  { to: '/player/profile', icon: faUserCircle, label: 'Profil' },
];

const businessNav: { to: string; icon: IconDefinition; label: string }[] = [
  { to: '/business/dashboard', icon: faThLarge, label: 'Dashboard' },
  { to: '/business/my-field', icon: faBuilding, label: 'Saham' },
  { to: '/business/timeslots', icon: faClock, label: 'Zaman Dilimleri' },
  { to: '/business/reservations', icon: faClipboardList, label: 'Rezervasyonlar' },
  { to: '/business/wallet', icon: faWallet, label: 'Cüzdan' },
  { to: '/business/profile', icon: faCog, label: 'Profil' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isPlayer = user?.userType === 'Player';
  const navItems = isPlayer ? playerNav : businessNav;
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;

  const handleSignOut = () => { signOut(); navigate('/login'); };

  const NavContent = () => (
    <>
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div className="sidebar-logo-text">CepteSaham</div>
          <div className="sidebar-logo-sub">{isPlayer ? 'Oyuncu Paneli' : 'İşletme Paneli'}</div>
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-label">Menü</div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`nav-item ${active ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={icon} className="nav-icon" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="user-name">{user?.firstName} {user?.lastName}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <button className="signout-btn" onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          Çıkış Yap
        </button>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <NavContent />
      </aside>

      {/* Mobile */}
      <div className={`mobile-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`mobile-sidebar ${open ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}>
            <FontAwesomeIcon icon={faTimes} style={{ fontSize: 18 }} />
          </button>
        </div>
        <NavContent />
      </aside>

      {/* Main */}
      <div className="main-area">
        <div className="mobile-topbar">
          <button className="mobile-menu-btn" onClick={() => setOpen(true)}>
            <FontAwesomeIcon icon={faBars} style={{ fontSize: 18 }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img src={logo} alt="Logo" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>CepteSaham</span>
          </div>
        </div>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
