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
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <div className="App">
          <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          
            <Routes>
              <Route path="/" element={<LoginPage />} />

              <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
                <Route path="rooms" element={<ProtectedRoute><RoomManagement /></ProtectedRoute>} />
                <Route path="analytics" element={<ProtectedRoute><UsageAnalytics /></ProtectedRoute>} />
                <Route path="predictions" element={<ProtectedRoute><PredictionInsights /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
              </Route>

              <Route path="/user/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            </Routes>


          
        </DataProvider>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
