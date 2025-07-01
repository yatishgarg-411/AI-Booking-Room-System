import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Users, MapPin, Calendar, TrendingUp, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

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
  const { rooms, bookings, conflicts, getAnalytics } = useData();
  const analytics = getAnalytics();

  const stats = [
    { title: 'Total Rooms', value: analytics.totalRooms, icon: MapPin, color: 'blue', change: '+2 this month' },
    { title: 'Available Now', value: analytics.availableRooms, icon: CheckCircle, color: 'green', change: 'Real-time' },
    { title: 'Booked Rooms', value: analytics.bookedRooms, icon: Calendar, color: 'orange', change: 'Currently active' },
    { title: 'Active Conflicts', value: analytics.activeConflicts, icon: AlertTriangle, color: 'red', change: 'Needs attention' }
  ];

  const recentActivity = [
    { id: 1, action: 'Room 3 booked by John Doe', time: '2 minutes ago', type: 'booking' },
    { id: 2, action: 'Conflict resolved in Room 2', time: '5 minutes ago', type: 'resolution' },
    { id: 3, action: 'Room 5 released early', time: '10 minutes ago', type: 'release' },
    { id: 4, action: 'New booking request for Room 1', time: '15 minutes ago', type: 'request' }
  ];

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

      {/* Room Status and Activity */}
      <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: '2fr 1fr' }}>
        <Section>
          <SectionHeader>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Live Room Status</h2>
          </SectionHeader>
          <SectionBody>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    borderColor: room.status === 'available' ? '#bbf7d0' : room.status === 'booked' ? '#fecaca' : '#fed7aa',
                    backgroundColor: room.status === 'available' ? '#f0fdf4' : room.status === 'booked' ? '#fef2f2' : '#fff7ed'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontWeight: '500', color: '#111827' }}>{room.name}</h3>
                    <Dot style={{ backgroundColor: getDotColor(room.status) }} />
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={12} /><span>Capacity: {room.capacity}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /><span>Floor {room.floor}</span></div>
                    {room.currentBooking && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /><span>{room.currentBooking.startTime} - {room.currentBooking.endTime}</span></div>
                    )}
                  </div>
                  {room.status !== 'available' && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <button style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}>Release</button>
                      <button style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}>Extend</button>
                    </div>
                  )}
                </RoomCard>
              ))}
            </div>
          </SectionBody>
        </Section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Section>
            <SectionHeader>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Recent Activity</h2>
            </SectionHeader>
            <SectionBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivity.map((activity) => (
                  <div key={activity.id} style={{ display: 'flex', gap: '12px' }}>
                    <Dot style={{ backgroundColor: activity.type === 'booking' ? '#3b82f6' : activity.type === 'resolution' ? '#16a34a' : activity.type === 'release' ? '#f97316' : '#8b5cf6', marginTop: '4px' }} />
                    <div>
                      <p style={{ fontSize: '14px', color: '#111827' }}>{activity.action}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionBody>
          </Section>

          <Section>
            <SectionHeader>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Quick Actions</h2>
            </SectionHeader>
            <SectionBody style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{ textAlign: 'left', padding: '12px 16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                <div style={{ fontWeight: '500', color: '#1e40af' }}>Add New Room</div>
                <div style={{ fontSize: '14px', color: '#2563eb' }}>Create a new meeting room</div>
              </button>
              <button style={{ textAlign: 'left', padding: '12px 16px', backgroundColor: '#fff7ed', borderRadius: '8px' }}>
                <div style={{ fontWeight: '500', color: '#9a3412' }}>Resolve Conflicts</div>
                <div style={{ fontSize: '14px', color: '#f97316' }}>Handle booking conflicts</div>
              </button>
              <button style={{ textAlign: 'left', padding: '12px 16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                <div style={{ fontWeight: '500', color: '#14532d' }}>Generate Report</div>
                <div style={{ fontSize: '14px', color: '#22c55e' }}>Export usage analytics</div>
              </button>
            </SectionBody>
          </Section>
        </div>
      </div>
    </Container>
  );
};

export default DashboardOverview;