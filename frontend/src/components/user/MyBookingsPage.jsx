// MyBookingsPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit3,
  X,
  RotateCcw,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import BookingModal from './BookingModal';

// Dummy Data
const dummyUser = { name: 'John Doe', email: 'john@example.com' };
const dummyBookings = [
  { id: 1, room: '101', floor: 1, status: 'upcoming', date: '2024-07-10', time: '10:00-12:00', purpose: 'Meeting' },
  { id: 2, room: '202', floor: 2, status: 'ongoing', date: '2024-07-07', time: '09:00-11:00', purpose: 'Workshop' },
  { id: 3, room: '303', floor: 3, status: 'previous', date: '2024-06-20', time: '14:00-16:00', purpose: 'Interview' },
  { id: 4, room: '404', floor: 4, status: 'previous', date: '2024-06-10', time: '12:00-13:00', purpose: 'Review' },
  { id: 5, room: '505', floor: 5, status: 'upcoming', date: '2024-07-15', time: '15:00-17:00', purpose: 'Presentation' },
];

const COLORS = ['#6366f1', '#22c55e', '#f59e42', '#ef4444'];

const Container = styled.div`
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Controls = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background: ${({ active }) => (active ? '#2563eb' : '#f3f4f6')};
  color: ${({ active }) => (active ? 'white' : '#374151')};
  border: ${({ active }) => (active ? 'none' : '1px solid #d1d5db')};
  cursor: pointer;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-top: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 2rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
`;

const BookingCard = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.2rem 2rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-left: 6px solid ${props => props.status === 'upcoming' ? '#6366f1' : props.status === 'ongoing' ? '#22c55e' : '#64748b'};
`;

const BookingContent = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
`;

const BookingInfo = styled.div`
  flex: 1;
`;

const RoomTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-right: 0.5rem;
`;

const StatusBadge = styled.span`
  background: ${props => props.status === 'upcoming' ? '#e0e7ff' : props.status === 'ongoing' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.status === 'upcoming' ? '#4f46e5' : props.status === 'ongoing' ? '#22c55e' : '#ef4444'};
  border-radius: 0.5rem;
  padding: 0.2rem 0.8rem;
  font-weight: bold;
  font-size: 1rem;
  margin-left: 1rem;
`;

const BookingMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #4B5563;
`;

const BookingActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.75rem;
  color: #6B7280;
  &:hover {
    background: #F3F4F6;
    color: ${({ highlight }) => (highlight ? highlight : '#374151')};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #64748b;
  font-size: 1.2rem;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h3`
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const CancelButton = styled.button`
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  align-self: flex-start;
  margin-top: 0.5rem;
  &:hover { background: #b91c1c; }
`;

const BookNowButton = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 2rem auto 0 auto;
  display: block;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(79,70,229,0.08);
  &:hover { background: #3730a3; }
`;

const ChartContainer = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
  margin-bottom: 2.5rem;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 0;
`;

const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const CardCol = styled.div`
  flex: 1 1 320px;
  min-width: 320px;
`;

const MyBookingsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelBooking, setCancelBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Filter and search
  const userBookings = dummyBookings.filter(b => b.userId === dummyUser.id);
  const filtered = userBookings.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter;
    const matchSearch = (b.room || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    return matchStatus && matchSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const iconForStatus = status => {
    switch (status) {
      case 'upcoming': return <CheckCircle size={16} />;
      case 'active': return <AlertCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const previous = dummyBookings.filter(b => b.status === 'previous');
  const ongoing = dummyBookings.filter(b => b.status === 'ongoing');
  const upcoming = dummyBookings.filter(b => b.status === 'upcoming');

  const chartData = [
    { name: 'Previous', value: previous.length, color: COLORS[2] },
    { name: 'Ongoing', value: ongoing.length, color: COLORS[1] },
    { name: 'Upcoming', value: upcoming.length, color: COLORS[0] },
  ];

  return (
    <PageContainer>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e293b', textAlign: 'center' }}>
        My Bookings
      </h2>
      <ChartContainer>
        <h4 style={{ marginBottom: '1rem', color: '#1e293b', textAlign: 'center' }}>Booking Statistics</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <CardRow>
        <CardCol>
          <Section>
            <SectionTitle>Previous Bookings</SectionTitle>
            {previous.length === 0 ? <div style={{ color: '#64748b', fontStyle: 'italic' }}>No previous bookings.</div> : previous.map(b => (
              <BookingCard key={b.id} status="previous">
                <div><b>Room:</b> {b.room}</div>
                <div><b>Floor:</b> {b.floor}</div>
                <div><b>Date:</b> {b.date}</div>
                <div><b>Time:</b> {b.time}</div>
                <div><b>Purpose:</b> {b.purpose}</div>
              </BookingCard>
            ))}
          </Section>
        </CardCol>
        <CardCol>
          <Section>
            <SectionTitle>Ongoing Bookings</SectionTitle>
            {ongoing.length === 0 ? (
              <BookNowButton onClick={() => setShowBookingModal(true)}>Book Now</BookNowButton>
            ) : ongoing.map(b => (
              <BookingCard key={b.id} status="ongoing">
                <div><b>Room:</b> {b.room}</div>
                <div><b>Floor:</b> {b.floor}</div>
                <div><b>Date:</b> {b.date}</div>
                <div><b>Time:</b> {b.time}</div>
                <div><b>Purpose:</b> {b.purpose}</div>
              </BookingCard>
            ))}
          </Section>
        </CardCol>
        <CardCol>
          <Section>
            <SectionTitle>Upcoming Bookings</SectionTitle>
            {upcoming.length === 0 ? <div style={{ color: '#64748b', fontStyle: 'italic' }}>No upcoming bookings.</div> : upcoming.map(b => (
              <BookingCard key={b.id} status="upcoming">
                <div><b>Room:</b> {b.room}</div>
                <div><b>Floor:</b> {b.floor}</div>
                <div><b>Date:</b> {b.date}</div>
                <div><b>Time:</b> {b.time}</div>
                <div><b>Purpose:</b> {b.purpose}</div>
              </BookingCard>
            ))}
          </Section>
        </CardCol>
      </CardRow>
      {showBookingModal && (
        <BookingModal
          room={{ name: '', floor: '', features: [] }}
          onClose={() => setShowBookingModal(false)}
          prefillUser={dummyUser}
        />
      )}
    </PageContainer>
  );
};

export default MyBookingsPage;
