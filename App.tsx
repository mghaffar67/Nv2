import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, UserLayout, AdminLayout } from './components/Layouts';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import ProtectedRoute from './components/routes/ProtectedRoutes';
import MaintenanceGuard from './components/layout/MaintenanceGuard';
import { IntegrationLoader } from './components/layout/IntegrationLoader';
import LiveChatWidget from './components/layout/LiveChatWidget';

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
import RequestsManager from './pages/admin/RequestsManager';
import RewardManager from './pages/admin/RewardManager';
import PlanManager from './pages/admin/PlanManager';
import SupportHub from './pages/admin/SupportHub';

// Work Manager Suite
import WorkLayout from './pages/admin/work/WorkLayout';
import AssignmentManager from './pages/admin/work/AssignmentManager';
import DailyTaskConfig from './pages/admin/work/DailyTaskConfig';
import BonusMissions from './pages/admin/work/BonusMissions';

import UserDashboard from './pages/user/UserDashboard';
import DailyWork from './pages/user/DailyWork';
import RewardHub from './pages/user/RewardHub';
import Plans from './pages/user/Plans';
import MyTeam from './pages/user/MyTeam';
import Wallet from './pages/user/Wallet';
import Withdraw from './pages/user/finance/Withdraw';
import Transactions from './pages/user/finance/Transactions';
import Settings from './pages/user/Settings';

const App: React.FC = () => (
  <HashRouter>
    <ConfigProvider>
      <AuthProvider>
        <MaintenanceGuard>
          <IntegrationLoader />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/support" element={<Support />} />
              <Route path="/payouts" element={<LivePayouts />} />
              <Route path="/pages/:slug" element={<DynamicPage />} />
            </Route>

            <Route path="/user" element={ <ProtectedRoute requiredRole="user"> <UserLayout /> </ProtectedRoute> }>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="work" element={<DailyWork />} />
              <Route path="achievements" element={<RewardHub />} />
              <Route path="team" element={<MyTeam />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="wallet/withdraw" element={<Withdraw />} />
              <Route path="history" element={<Transactions />} />
              <Route path="plans" element={<Plans />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/admin" element={ <ProtectedRoute requiredRole="admin"> <AdminLayout /> </ProtectedRoute> }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="requests" element={<RequestsManager />} />
              <Route path="users" element={<UsersManager />} />
              
              {/* Work Manager Suite */}
              <Route path="work" element={<WorkLayout />}>
                <Route index element={<Navigate to="assignments" replace />} />
                <Route path="assignments" element={<AssignmentManager />} />
                <Route path="daily-config" element={<DailyTaskConfig />} />
                <Route path="bonus" element={<BonusMissions />} />
              </Route>

              <Route path="plans" element={<PlanManager />} />
              <Route path="support-hub" element={<SupportHub />} />
              <Route path="finance" element={<FinanceManager />} />
              
              <Route path="settings">
                 <Route path="general" element={<Navigate to="/admin/dashboard" />} />
                 <Route path="modules" element={<Navigate to="/admin/dashboard" />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Global AI Support Node Activated */}
          <LiveChatWidget />
        </MaintenanceGuard>
      </AuthProvider>
    </ConfigProvider>
  </HashRouter>
);

export default App;