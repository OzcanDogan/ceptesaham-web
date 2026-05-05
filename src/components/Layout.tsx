import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Calendar, Wallet, Trophy, Users, User,
  Building2, ClipboardList, Settings, LogOut, Menu, X, Bell
} from 'lucide-react';

const playerNav = [
  { to: '/player/fields', icon: Home, label: 'Sahalar' },
  { to: '/player/matches', icon: Trophy, label: 'Maçlar' },
  { to: '/player/reservations', icon: Calendar, label: 'Rezervasyonlarım' },
  { to: '/player/wallet', icon: Wallet, label: 'Cüzdan' },
  { to: '/player/leaderboard', icon: Trophy, label: 'Sıralama' },
  { to: '/player/finder', icon: Users, label: 'Oyuncu Bul' },
  { to: '/player/profile', icon: User, label: 'Profil' },
];

const businessNav = [
  { to: '/business/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/business/my-field', icon: Building2, label: 'Saham' },
  { to: '/business/reservations', icon: ClipboardList, label: 'Rezervasyonlar' },
  { to: '/business/profile', icon: Settings, label: 'Profil' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPlayer = user?.userType === 'Player';
  const navItems = isPlayer ? playerNav : businessNav;

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-green-800 text-white flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-6 border-b border-green-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚽</span>
            <div>
              <h1 className="text-xl font-bold">CepteSaham</h1>
              <p className="text-green-300 text-xs">{isPlayer ? 'Oyuncu' : 'Saha Sahibi'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-sm
                  ${active ? 'bg-white text-green-800' : 'text-green-100 hover:bg-green-700'}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-700">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-green-300 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-100 hover:bg-green-700 w-full text-sm"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-green-700">⚽ CepteSaham</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
