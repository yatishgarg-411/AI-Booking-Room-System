import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ConflictResolver from './components/admin/ConflictResolver';
import PredictionInsights from './components/admin/PredictionInsights';
import UsageAnalytics from './components/admin/UsageAnalytics';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AdminDashboard from './pages/AdminDashboard';
import DashboardOverview from './components/admin/DashboardOverview';
import RoomManagement from './components/admin/RoomManagement';
import Header from './components/shared/Header';



function App() {
  return (
    <div className="App">
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
          <Header/>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard" element={<AdminDashboard />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<DashboardOverview />} />
                <Route path="rooms" element={<RoomManagement />} />
                <Route path="conflicts" element={<ConflictResolver />} />
                <Route path="analytics" element={<UsageAnalytics />} />
                <Route path="predictions" element={<PredictionInsights />} />
              </Route>
            </Routes>


          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
