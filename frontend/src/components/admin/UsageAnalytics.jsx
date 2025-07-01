import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { BarChart3, TrendingUp, Calendar, Users, Download, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 90rem;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const TitleGroup = styled.div`
  h1 {
    font-size: 1.875rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  p {
    color: #4b5563;
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const CardGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`;

const CardIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Section = styled.div`
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const UsageAnalytics = () => {
  const { rooms, getAnalytics } = useData();
  const [timeRange, setTimeRange] = useState('7d');
  const analytics = getAnalytics();

  const utilizationData = [
    { name: 'Mon', utilization: 85 },
    { name: 'Tue', utilization: 92 },
    { name: 'Wed', utilization: 78 },
    { name: 'Thu', utilization: 95 },
    { name: 'Fri', utilization: 88 },
    { name: 'Sat', utilization: 45 },
    { name: 'Sun', utilization: 32 },
  ];

  const roomUsageData = rooms.map((room) => ({
    name: room.name,
    bookings: Math.floor(Math.random() * 20) + 5,
    hours: Math.floor(Math.random() * 40) + 10,
  }));

  return (
    <Container>
      <Header>
        <TitleGroup>
          <h1>Usage Analytics</h1>
          <p>Comprehensive insights into room utilization and booking patterns</p>
        </TitleGroup>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
          <ExportButton>
            <Download size={16} />
            <span>Export</span>
          </ExportButton>
        </div>
      </Header>

      <CardGrid>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <CardIcon style={{ backgroundColor: '#dbeafe' }}><BarChart3 color="#2563eb" /></CardIcon>
            <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 500 }}>+12%</span>
          </div>
          <div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>{analytics.utilizationRate}%</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Average Utilization</p>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <CardIcon style={{ backgroundColor: '#dcfce7' }}><Calendar color="#15803d" /></CardIcon>
            <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 500 }}>+8%</span>
          </div>
          <div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>{analytics.totalBookings}</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Bookings</p>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <CardIcon style={{ backgroundColor: '#ede9fe' }}><Clock color="#7c3aed" /></CardIcon>
            <span style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 500 }}>-3%</span>
          </div>
          <div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>2.4h</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg. Booking Duration</p>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <CardIcon style={{ backgroundColor: '#ffedd5' }}><Users color="#ea580c" /></CardIcon>
            <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 500 }}>+15%</span>
          </div>
          <div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>156</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Users</p>
          </div>
        </Card>
      </CardGrid>

      {/* Other sections like Weekly Utilization, Feature Usage, and Room Usage Table will be added here */}

    </Container>
  );
};

export default UsageAnalytics;