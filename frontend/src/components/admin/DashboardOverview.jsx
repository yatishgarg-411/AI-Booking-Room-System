import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Users, MapPin, Calendar, TrendingUp, AlertTriangle, Clock, CheckCircle, XCircle, Activity, Eye, BarChart3, Zap } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import FloorBlueprint from './FloorBlueprint';

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 400;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.gradient};
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const StatCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  margin-bottom:5px;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg};
  box-shadow: 0 4px 16px ${props => props.shadow};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div`
  font-size: 0.875rem;
  color: ${props => props.color};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LiveIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionBody = styled.div`
  padding: 2rem;
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(4px);
  }
`;

const ActivityIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  font-size: 0.95rem;
  color: #1e293b;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const ActivityMeta = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const DashboardOverview = () => {
  const { getAnalytics, recentActivity, fetchActivities } = useData();
  const analytics = getAnalytics();

  const stats = [
    {
      title: 'Total Rooms',
      value: analytics.totalRooms,
      icon: MapPin,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadow: 'rgba(102, 126, 234, 0.3)',
      change: 'System capacity',
      changeColor: '#667eea'
    },
    {
      title: 'Available Now',
      value: analytics.availableRooms,
      icon: CheckCircle,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shadow: 'rgba(16, 185, 129, 0.3)',
      change: 'Real-time status',
      changeColor: '#10b981',
      live: true
    },
    {
      title: 'Booked Rooms',
      value: analytics.bookedRooms,
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      shadow: 'rgba(245, 158, 11, 0.3)',
      change: 'Currently active',
      changeColor: '#f59e0b'
    },
    {
      title: 'Utilization Rate',
      value: `${analytics.utilizationRate}%`,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      shadow: 'rgba(239, 68, 68, 0.3)',
      change: 'System efficiency',
      changeColor: '#ef4444'
    }
  ];

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type, action) => {
    const icons = {
      booking: {
        created: { emoji: '📅', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        cancelled: { emoji: '❌', bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
        extended: { emoji: '⏰', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        released: { emoji: '🔓', bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        default: { emoji: '📋', bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
      },
      room_status_change: {
        marked_available: { emoji: '✅', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        marked_unavailable: { emoji: '🚫', bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
        default: { emoji: '⚙️', bg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' }
      },
      room_settings: { emoji: '🔧', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
      default: { emoji: '📝', bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
    };

    const category = icons[type] || icons.default;
    const actionData = category[action] || category.default || category;
    
    return { emoji: actionData.emoji, bg: actionData.bg };
  };

  return (
    <Container>
      <Header>
        <Title>Admin Dashboard</Title>
        <Subtitle>Real-time overview of your intelligent room booking system</Subtitle>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <StatCard 
              key={stat.title} 
              gradient={stat.gradient}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <StatCardContent>
                <IconContainer bg={stat.bg} shadow={stat.shadow}>
                  <Icon color="white" size={24} />
                </IconContainer>
                <StatTextGroup>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.title}</StatLabel>
                </StatTextGroup>
              </StatCardContent>
              <StatChange color={stat.changeColor} style={{ marginTop: '0.5rem', marginLeft: 'calc(50px + 1rem)' }}>
                <Zap size={14} />
                {stat.change}
              </StatChange>
              {stat.live && <LiveIndicator style={{ position: 'absolute', top: 16, right: 16 }} />}
            </StatCard>
          );
        })}
      </StatsGrid>

      {/* Floor Blueprint View */}
      <Section>
        
        <SectionBody>
          <FloorBlueprint />
        </SectionBody>
      </Section>

      {/* Recent Activity Section */}
      <Section>
        <SectionHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionTitle>
              <Activity size={24} />
              Recent Activity
            </SectionTitle>
            <RefreshButton onClick={fetchActivities}>
              <BarChart3 size={16} />
              Refresh
            </RefreshButton>
          </div>
        </SectionHeader>
        <SectionBody>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
            Total activities: {recentActivity.length}
          </div>
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 8).map((activity, index) => {
              const iconData = getActivityIcon(activity.type, activity.action);
              return (
                <ActivityItem
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ActivityIcon bg={iconData.bg}>
                    {iconData.emoji}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityText>{activity.details}</ActivityText>
                    <ActivityMeta>
                      <Clock size={12} />
                      {formatTimestamp(activity.timestamp)} • {activity.user}
                    </ActivityMeta>
                  </ActivityContent>
                </ActivityItem>
              );
            })
          ) : (
            <EmptyState>
              <EmptyIcon>📊</EmptyIcon>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No recent activity</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Activities will appear here as they happen</p>
            </EmptyState>
          )}
        </SectionBody>
      </Section>
    </Container>
  );
};

export default DashboardOverview;