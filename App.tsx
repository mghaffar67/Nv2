
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, UserLayout, AdminLayout } from './components/Layouts';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import ProtectedRoute from './components/routes/ProtectedRoutes';
import MaintenanceGuard from './components/layout/MaintenanceGuard';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Support from './pages/Support';
import LivePayouts from './pages/public/LivePayouts';
import DynamicPage from './pages/public/DynamicPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManager from './pages/admin/UsersManager';
import FinanceManager from './pages/admin/finance/FinanceManager';
import WorkManager from './pages/admin/WorkManager';
import RequestsManager from './pages/admin/RequestsManager';
import SettingsLayout from './pages/admin/settings/SettingsLayout';
import CoreSettings from './pages/admin/settings/Settings';
import BrandingSettings from './pages/admin/settings/BrandingSettings';
import AppearanceSettings from './pages/admin/settings/AppearanceSettings';
import SEOManager from './pages/admin/settings/SEOManager';
import CMSEditor from './pages/admin/settings/CMSEditor';
import DatabaseManager from './pages/admin/settings/DatabaseManager';
import UserDashboard from './pages/user/UserDashboard';
import DailyWork from './pages/user/DailyWork';
import Plans from './pages/user/Plans';
import PlanHistory from './pages/user/PlanHistory';
import MyTeam from './pages/user/MyTeam';
import Wallet from './pages/user/Wallet';
import Withdraw from './pages/user/finance/Withdraw';
import Transactions from './pages/user/finance/Transactions';
import Settings from './pages/user/Settings';
import Profile from './pages/user/Profile';

const App: React.FC = () => (
  <HashRouter>
    <ConfigProvider>
      <AuthProvider>
        <MaintenanceGuard>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/support" element={<Support />} />
              <Route path="/payouts" element={<LivePayouts />} />
              <Route path="/pages/:slug" element={<DynamicPage />} />
            </Route>

            <Route path="/user" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="work" element={<DailyWork />} />
              <Route path="team" element={<MyTeam />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="wallet/withdraw" element={<Withdraw />} />
              <Route path="history" element={<Transactions />} />
              <Route path="plans" element={<Plans />} />
              <Route path="plans/history" element={<PlanHistory />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="finance" element={<FinanceManager />} />
              <Route path="tasks" element={<WorkManager />} />
              <Route path="requests" element={<RequestsManager />} />
              
              <Route path="settings" element={<SettingsLayout />}>
                 <Route index element={<Navigate to="general" replace />} />
                 <Route path="general" element={<CoreSettings />} />
                 <Route path="branding" element={<BrandingSettings />} />
                 <Route path="appearance" element={<AppearanceSettings />} />
                 <Route path="database" element={<DatabaseManager />} />
                 <Route path="seo" element={<SEOManager />} />
                 <Route path="cms" element={<CMSEditor />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MaintenanceGuard>
      </AuthProvider>
    </ConfigProvider>
  </HashRouter>
);

export default App;
