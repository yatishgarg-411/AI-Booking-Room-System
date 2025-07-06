import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Users, MapPin, Calendar, TrendingUp, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import FloorBlueprint from './FloorBlueprint';

const Container = styled.div`
  padding: 24px;
  max-width: 1120px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionBody = styled.div`
  padding: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 999px;
`;

const RoomCard = styled(motion.div)`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.2s;
`;

const DashboardOverview = () => {
  const {  getAnalytics, recentActivity, fetchActivities } = useData();
  const analytics = getAnalytics();

  const stats = [
    { title: 'Total Rooms', value: analytics.totalRooms, icon: MapPin, color: 'blue'},
    { title: 'Available Now', value: analytics.availableRooms, icon: CheckCircle, color: 'green', change: 'Real-time' },
    { title: 'Booked Rooms', value: analytics.bookedRooms, icon: Calendar, color: 'orange', change: 'Currently active' }
  ];

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Helper function to get activity icon
  const getActivityIcon = (type, action) => {
    switch (type) {
      case 'booking':
        switch (action) {
          case 'created': return '📅';
          case 'cancelled': return '❌';
          case 'extended': return '⏰';
          case 'released': return '🔓';
          default: return '📋';
        }
      case 'room_status_change':
        switch (action) {
          case 'marked_available': return '✅';
          case 'marked_unavailable': return '🚫';
          default: return '⚙️';
        }
      case 'room_settings':
        return '🔧';
      default:
        return '📝';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'blue': return ['#dbeafe', '#3b82f6'];
      case 'green': return ['#bbf7d0', '#16a34a'];
      case 'orange': return ['#ffedd5', '#f97316'];
      case 'red': return ['#fee2e2', '#dc2626'];
      default: return ['#f3f4f6', '#6b7280'];
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'booked': return '#ef4444';
      default: return '#f97316';
    }
  };

  return (
    <Container>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Admin Dashboard</h1>
        <p style={{ color: '#6b7280' }}>Real-time overview of your room booking system</p>
      </div>

      <StatsGrid>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const [bg, text] = getColor(stat.color);
          return (
            <StatCard key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <IconBox style={{ backgroundColor: bg }}>
                  <Icon color={text} size={24} />
                </IconBox>
                <Dot style={{ backgroundColor: stat.color === 'green' ? '#22c55e' : 'transparent', animation: stat.color === 'green' ? 'pulse 1.5s infinite' : 'none' }} />
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{stat.value}</p>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{stat.title}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>{stat.change}</p>
              </div>
            </StatCard>
          );
        })}
      </StatsGrid>

      {/* Floor Blueprint View */}
      <FloorBlueprint />

      {/* Recent Activity Section */}
      <div style={{ marginTop: '32px' }}>
        <Section>
          <SectionHeader>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Recent Activity</h2>
              <button 
                onClick={fetchActivities}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Refresh
              </button>
            </div>
          </SectionHeader>
          <SectionBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ marginBottom: '12px', fontSize: '12px', color: '#6b7280' }}>
                Total activities: {recentActivity.length}
              </div>
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 10).map((activity) => (
                  <div key={activity.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '16px', marginTop: '2px' }}>
                      {getActivityIcon(activity.type, activity.action)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', color: '#111827', marginBottom: '4px' }}>
                        {activity.details}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>
                        {formatTimestamp(activity.timestamp)} • {activity.user}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </SectionBody>
        </Section>
      </div>
    </Container>
  );
};

export default DashboardOverview;