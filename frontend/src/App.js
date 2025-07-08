import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PredictionInsights from './components/admin/PredictionInsights';
import UsageAnalytics from './components/admin/UsageAnalytics';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AdminDashboard from './pages/AdminDashboard';
import DashboardOverview from './components/admin/DashboardOverview';
import RoomManagement from './components/admin/RoomManagement';
import ProfilePage from './components/shared/ProfilePage';
import RoomDetailsModal from './components/admin/RoomDetailsModel';
import { motion } from 'framer-motion';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <div className="App">
          <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path='test' element={<RoomDetailsModal/>}></Route>

              <Route path="/dashboard" element={<AdminDashboard />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<DashboardOverview />} />
                <Route path="rooms" element={<RoomManagement />} />
                <Route path="analytics" element={<UsageAnalytics />} />
                <Route path="predictions" element={<PredictionInsights />} />
                <Route path="profile" element={<ProfilePage />}/>
              </Route>

              <Route path="/user/*" element={<UserDashboard />} />
            </Routes>


          
        </DataProvider>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
