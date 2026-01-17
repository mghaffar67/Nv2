
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, UserLayout, AdminLayout } from './components/Layouts';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import ProtectedRoute from './components/routes/ProtectedRoutes';
import MaintenanceGuard from './components/layout/MaintenanceGuard';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Support from './pages/Support';
import DynamicPage from './pages/public/DynamicPage';

// --- Admin Pages ---
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManager from './pages/admin/UsersManager';
import FinanceManager from './pages/admin/finance/FinanceManager';
import WorkManager from './pages/admin/WorkManager';
import RequestsManager from './pages/admin/RequestsManager';

// --- Settings Portal ---
import SettingsLayout from './pages/admin/settings/SettingsLayout';
import GeneralSettings from './pages/admin/settings/GeneralSettings';
import ModulesSEO from './pages/admin/settings/ModulesSEO';
import HeroSection from './pages/admin/settings/HeroSection';
import WebAppearance from './pages/admin/settings/WebAppearance';
import CMSEditor from './pages/admin/settings/CMSEditor';
import GlobalSettings from './pages/admin/settings/Settings';
import SEOManager from './pages/admin/settings/SEOManager'; // Added Step 8

// --- User Pages ---
import UserDashboard from './pages/user/UserDashboard';
import DailyWork from './pages/user/DailyWork';
import Plans from './pages/user/Plans';
import PlanHistory from './pages/user/PlanHistory';
import MyTeam from './pages/user/MyTeam';
import Wallet from './pages/user/Wallet';
import Transactions from './pages/user/finance/Transactions';
import Settings from './pages/user/Settings';

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
              <Route path="history" element={<Transactions />} />
              <Route path="plans" element={<Plans />} />
              <Route path="plans/history" element={<PlanHistory />} />
              <Route path="settings" element={<Settings />} />
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
                 <Route path="general" element={<GlobalSettings />} />
                 <Route path="modules" element={<ModulesSEO />} />
                 <Route path="seo" element={<SEOManager />} />
                 <Route path="hero" element={<HeroSection />} />
                 <Route path="appearance" element={<WebAppearance />} />
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
