import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import UserSidebar from '../components/user/UserSidebar';
import AnalyticsOverview from '../components/user/AnalyticsOverview';
import RecentActivity from '../components/user/RecentActivity';
import BookingPage from '../components/user/BookingPage';
import MyBookingsPage from '../components/user/MyBookingsPage';
import RoomStatusPage from '../components/user/RoomStatusPage';
import ChatbotPage from '../components/user/ChatbotPage';
import ProfilePage from '../components/shared/ProfilePage';

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
`;

const ContentWrapper = styled.div`
  flex: 1;
  margin-left: 220px;
  overflow-y: auto;
  padding: 2rem 2rem 2rem 2rem;
`;

const DashboardOverview = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
    <div style={{ flex: 2, minWidth: 350 }}>
      <AnalyticsOverview />
    </div>
    <div style={{ flex: 1, minWidth: 300 }}>
      <RecentActivity />
    </div>
  </div>
);

const UserDashboard = () => {
  return (
    <DashboardContainer>
      <UserSidebar />
      <ContentWrapper>
        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="status" element={<RoomStatusPage />} />
          <Route path="chat" element={<ChatbotPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/user" replace />} />
        </Routes>
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default UserDashboard;
