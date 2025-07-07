import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCalendarCheck, FaCalendarTimes, FaCalendarDay, FaCalendarPlus } from 'react-icons/fa';

const data = [
  { name: 'Ongoing', value: 3, color: '#4f46e5' },
  { name: 'Upcoming', value: 5, color: '#22c55e' },
  { name: 'Cancelled', value: 2, color: '#ef4444' },
];

const totalBookings = data.reduce((sum, d) => sum + d.value, 0);

const CardGrid = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem 2rem;
  flex: 1 1 180px;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 180px;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.color || '#6366f1'};
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  color: #6b7280;
  font-size: 1rem;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
`;

const ChartContainer = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
`;

const AnalyticsOverview = () => {
  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b' }}>
        Your Booking Analytics
      </h2>
      <CardGrid>
        <StatCard>
          <StatIcon color="#6366f1"><FaCalendarCheck /></StatIcon>
          <StatInfo>
            <StatLabel>Total Bookings</StatLabel>
            <StatValue>{totalBookings}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#4f46e5"><FaCalendarDay /></StatIcon>
          <StatInfo>
            <StatLabel>Ongoing</StatLabel>
            <StatValue>{data[0].value}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#22c55e"><FaCalendarPlus /></StatIcon>
          <StatInfo>
            <StatLabel>Upcoming</StatLabel>
            <StatValue>{data[1].value}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#ef4444"><FaCalendarTimes /></StatIcon>
          <StatInfo>
            <StatLabel>Cancelled</StatLabel>
            <StatValue>{data[2].value}</StatValue>
          </StatInfo>
        </StatCard>
      </CardGrid>
      <ChartContainer>
        <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Booking Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default AnalyticsOverview; 