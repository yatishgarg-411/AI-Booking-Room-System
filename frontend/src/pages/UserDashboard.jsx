import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import UserSidebar from '../components/user/UserSidebar';
import AnalyticsOverview from '../components/user/AnalyticsOverview';
import RecentActivity from '../components/user/RecentActivity';
import BookingPage from '../components/user/BookingPage';
import MyBookingsPage from '../components/user/MyBookingsPage';
import ChatbotPage from '../components/user/ChatbotPage';
import ProfilePage from '../components/shared/ProfilePage';
import { useAuth } from '../contexts/AuthContext';

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

const HeroContainer = styled.div`
  width: 80%%;
  
  border-radius: 1.5rem;
  margin: 0 auto 2.5rem auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 2.5rem 3rem 2.5rem 3rem;
  background: linear-gradient(120deg, #6366f1 0%, #a5b4fc 60%, #f3e8ff 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-blend-mode: multiply;
  color: #fff;
  box-shadow: 0 8px 32px rgba(99,102,241,0.10);
  position: relative;
  overflow: hidden;
`;

const Welcome = styled.h1`
  font-size: 2.3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.10);
`;

const Quote = styled.div`
  font-size: 1.2rem;
  font-style: italic;
  margin-bottom: 1.2rem;
  color: #f3f4f6;
  max-width: 600px;
`;

const DateTime = styled.div`
  font-size: 1.1rem;
  color: #e0e7ff;
  margin-top: 0.5rem;
`;

const MainGrid = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 2rem;
  align-items: stretch;
`;

const MainCol = styled.div`
  flex: ${props => props.flex || 1};
  min-width: ${props => props.minWidth || 300}px;
  display: flex;
  flex-direction: column;
  ${props => props.scrollable && `
    max-height: 480px;
    overflow-y: auto;
  `}
`;

const QUOTES = [
  "The future depends on what you do today.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Opportunities don't happen, you create them.",
  "Your time is limited, so don’t waste it living someone else’s life.",
  "Great things never come from comfort zones.",
  "Dream big and dare to fail.",
  "Don’t watch the clock; do what it does. Keep going.",
];

const DashboardOverview = ({ name, now, quote }) => (
  <>
    <HeroContainer>
      <Welcome>Welcome back{name ? `, ${name}` : ''}!</Welcome>
      <Quote>“{quote}”</Quote>
      <DateTime>
        {now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        {" | "}
        {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </DateTime>
    </HeroContainer>
    <MainGrid>
      <MainCol flex={2} minWidth={350}>
        <AnalyticsOverview />
      </MainCol>
      <MainCol flex={1} minWidth={300} scrollable>
        <RecentActivity />
      </MainCol>
    </MainGrid>
  </>
);

const UserDashboard = () => {
  const { name } = useAuth();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const quote = QUOTES[(name ? name.length : 0) % QUOTES.length];

  return (
    <DashboardContainer>
      <UserSidebar />
      <ContentWrapper>
        <Routes>
          <Route index element={<ProtectedRoute><DashboardOverview name={name} now={now} quote={quote} /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><DashboardOverview name={name} now={now} quote={quote} /></ProtectedRoute>} />
          <Route path="booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="chat" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<ProtectedRoute><Navigate to="/user" replace /></ProtectedRoute>} />
        </Routes>
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default UserDashboard;
