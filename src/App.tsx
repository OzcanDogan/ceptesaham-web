import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import FieldListPage from './pages/player/FieldListPage';
import FieldDetailPage from './pages/player/FieldDetailPage';
import MyReservationsPage from './pages/player/MyReservationsPage';
import WalletPage from './pages/player/WalletPage';
import PublicMatchesPage from './pages/player/PublicMatchesPage';
import MatchDetailPage from './pages/player/MatchDetailPage';
import CreateMatchPage from './pages/player/CreateMatchPage';
import LeaderboardPage from './pages/player/LeaderboardPage';
import PlayerFinderPage from './pages/player/PlayerFinderPage';
import ProfilePage from './pages/player/ProfilePage';

import DashboardPage from './pages/business/DashboardPage';
import MyFieldPage from './pages/business/MyFieldPage';
import BusinessReservationsPage from './pages/business/BusinessReservationsPage';
import BusinessProfilePage from './pages/business/BusinessProfilePage';

function ProtectedRoute({ children, requiredType }: { children: React.ReactNode; requiredType?: string }) {
  const { token, user, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  if (!token) return <Navigate to="/login" replace />;
  if (requiredType && user?.userType !== requiredType) {
    return <Navigate to={user?.userType === 'BusinessOwner' ? '/business/dashboard' : '/player/fields'} replace />;
  }

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/player/fields" element={<ProtectedRoute requiredType="Player"><FieldListPage /></ProtectedRoute>} />
      <Route path="/player/fields/:id" element={<ProtectedRoute requiredType="Player"><FieldDetailPage /></ProtectedRoute>} />
      <Route path="/player/reservations" element={<ProtectedRoute requiredType="Player"><MyReservationsPage /></ProtectedRoute>} />
      <Route path="/player/wallet" element={<ProtectedRoute requiredType="Player"><WalletPage /></ProtectedRoute>} />
      <Route path="/player/matches" element={<ProtectedRoute requiredType="Player"><PublicMatchesPage /></ProtectedRoute>} />
      <Route path="/player/matches/create" element={<ProtectedRoute requiredType="Player"><CreateMatchPage /></ProtectedRoute>} />
      <Route path="/player/matches/:id" element={<ProtectedRoute requiredType="Player"><MatchDetailPage /></ProtectedRoute>} />
      <Route path="/player/leaderboard" element={<ProtectedRoute requiredType="Player"><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/player/finder" element={<ProtectedRoute requiredType="Player"><PlayerFinderPage /></ProtectedRoute>} />
      <Route path="/player/profile" element={<ProtectedRoute requiredType="Player"><ProfilePage /></ProtectedRoute>} />

      <Route path="/business/dashboard" element={<ProtectedRoute requiredType="BusinessOwner"><DashboardPage /></ProtectedRoute>} />
      <Route path="/business/my-field" element={<ProtectedRoute requiredType="BusinessOwner"><MyFieldPage /></ProtectedRoute>} />
      <Route path="/business/reservations" element={<ProtectedRoute requiredType="BusinessOwner"><BusinessReservationsPage /></ProtectedRoute>} />
      <Route path="/business/profile" element={<ProtectedRoute requiredType="BusinessOwner"><BusinessProfilePage /></ProtectedRoute>} />

      <Route path="/" element={
        user ? (
          <Navigate to={user.userType === 'BusinessOwner' ? '/business/dashboard' : '/player/fields'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
