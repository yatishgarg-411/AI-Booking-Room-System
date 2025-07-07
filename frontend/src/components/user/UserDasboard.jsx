import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import UserSidebar from '../components/user/UserSidebar';
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
  padding-top: 4rem; /* pt-16 equivalent */
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const UserDashboard = () => {
  return (
    <DashboardContainer>
      <UserSidebar />
      <ContentWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/booking" replace />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/status" element={<RoomStatusPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default UserDashboard;
