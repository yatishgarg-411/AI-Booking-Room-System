import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCalendarCheck, FaCalendarTimes, FaCalendarDay, FaCalendarPlus } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';


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
  width: 100%;
`;

const COLORS = ['#4f46e5', '#22c55e', '#ef4444', '#f59e42'];

function getBookingStatus(booking) {
  const now = new Date();
  const start = new Date(`${booking.bookingStartDate}T${booking.startTime}`);
  const end = new Date(`${booking.bookingEndDate}T${booking.endTime}`);
  if (booking.status === 'cancelled') return 'Cancelled';
  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Ongoing';
  if (now > end) return 'Previous';
  return 'Unknown';
}



const AnalyticsOverview = () => {
  const { bookings } = useData();
  const { email } = useAuth();
  const userBookings = bookings.filter(b => b.bookedBy === email);

  // Calculate stats
  let total = userBookings.length;
  let ongoing = 0, upcoming = 0, previous = 0;
  userBookings.forEach(b => {
    const status = getBookingStatus(b);
    if (status === 'Ongoing') ongoing++;
    else if (status === 'Upcoming') upcoming++;
    else previous++;
  });

  const data = [
    { name: 'Ongoing', value: ongoing, color: COLORS[0] },
    { name: 'Upcoming', value: upcoming, color: COLORS[1] },
    { name: 'Previous', value: previous, color: COLORS[2] },
  ];

  // Date/time and quote
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
 

  return (
    <div>
     
      <CardGrid>
        <StatCard>
          <StatIcon color="#6366f1"><FaCalendarCheck /></StatIcon>
          <StatInfo>
            <StatLabel>Total Bookings</StatLabel>
            <StatValue>{total}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#4f46e5"><FaCalendarDay /></StatIcon>
          <StatInfo>
            <StatLabel>Ongoing</StatLabel>
            <StatValue>{ongoing}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#22c55e"><FaCalendarPlus /></StatIcon>
          <StatInfo>
            <StatLabel>Upcoming</StatLabel>
            <StatValue>{upcoming}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#ef4444"><FaCalendarTimes /></StatIcon>
          <StatInfo>
            <StatLabel>Previous</StatLabel>
            <StatValue>{previous}</StatValue>
          </StatInfo>
        </StatCard>
      </CardGrid>
      <ChartContainer>
        <h3 style={{ padding: '1rem', marginBottom: '1rem', color: '#1e293b' }}>Booking Status Distribution</h3>
        <ResponsiveContainer width="100%" padding="1rem" height={250}>
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