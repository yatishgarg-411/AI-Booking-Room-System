import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/shared/Header';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardOverview from '../components/admin/DashboardOverview';
import RoomManagement from '../components/admin/RoomManagement';
import ConflictResolver from '../components/admin/ConflictResolver';
import UsageAnalytics from '../components/admin/UsageAnalytics';
import PredictionInsights from '../components/admin/PredictionInsights';
import { DataProvider } from '../contexts/DataContext';
// import ChatbotPage from '../components/user/ChatbotPage';
// import ProfilePage from '../components/shared/ProfilePage';

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction:row;
  height: 100vh;
  background-color: #f9fafb;
  padding-top: 4rem;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
`;

const AdminDashboard = () => {
  return (
  
    <DashboardWrapper>
      <AdminSidebar />
      <ContentArea>
        
   <Outlet/>

      </ContentArea>
    </DashboardWrapper>
  );
};

export default AdminDashboard;