// MyBookingsPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
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

// Dummy Data
const dummyUser = { id: 'u1', name: 'Akshita' };
const dummyBookings = [
  {
    id: 'b1',
    userId: 'u1',
    roomName: 'Orchid Room',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    features: ['Projector'],
    notes: 'Team sync-up',
    status: 'upcoming'
  },
  {
    id: 'b2',
    userId: 'u1',
    roomName: 'Lily Room',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '11:00',
    endTime: '12:00',
    features: ['Whiteboard'],
    notes: '',
    status: 'completed'
  }
];

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

const BookingCard = styled(motion.div)`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
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

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background: ${({ status }) =>
    status === 'upcoming' ? '#DCFCE7' :
    status === 'active'   ? '#FEF3C7' :
    status === 'completed'? '#F3F4F6' :
    '#FEE2E2'};
  color: ${({ status }) =>
    status === 'upcoming' ? '#166534' :
    status === 'active'   ? '#92400E' :
    status === 'completed'? '#374151' :
    '#991B1B'};
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
  text-align: center;
  padding: 3rem;
`;

const MyBookingsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and search
  const userBookings = dummyBookings.filter(b => b.userId === dummyUser.id);
  const filtered = userBookings.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter;
    const matchSearch = b.roomName.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <Container>
      <Header>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Bookings</h1>
        <p style={{ color: '#6B7280' }}>Track and manage your room reservations</p>
      </Header>

      <Controls>
        {filterOptions.map(f => (
          <FilterButton
            key={f.value}
            active={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </FilterButton>
        ))}

        <SearchWrapper>
          <Search size={16} style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <SearchInput
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </Controls>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <AnimatePresence>
          {filtered.length > 0 ? (
            filtered.map((b, i) => (
              <BookingCard
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <BookingContent>
                  <BookingInfo>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <RoomTitle>{b.roomName}</RoomTitle>
                      <StatusBadge status={b.status}>
                        {iconForStatus(b.status)}
                        <span style={{ marginLeft: '0.25rem', textTransform: 'capitalize' }}>
                          {b.status}
                        </span>
                      </StatusBadge>
                    </div>

                    <BookingMeta>
                      <div><Calendar size={16} /> {format(new Date(b.date), 'MMM dd, yyyy')}</div>
                      <div><Clock size={16} /> {b.startTime} – {b.endTime}</div>
                      <div><Users size={16} /> {Math.abs(parseInt(b.endTime) - parseInt(b.startTime))} hour(s)</div>
                    </BookingMeta>

                    {b.features.length > 0 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        {b.features.map(f => (
                          <span key={f} style={{ background: '#F3F4F6', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', marginRight: '0.5rem' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {b.notes && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#F9FAFB', borderRadius: '0.75rem' }}>
                        {b.notes}
                      </div>
                    )}
                  </BookingInfo>

                  <BookingActions>
                    {b.status === 'upcoming' && (
                      <>
                        <IconButton onClick={() => alert('Edit')} title="Modify Booking">
                          <Edit3 size={16} />
                        </IconButton>
                        <IconButton highlight="#DC2626" onClick={() => alert('Cancel')} title="Cancel Booking">
                          <X size={16} />
                        </IconButton>
                      </>
                    )}
                    {b.status === 'completed' && (
                      <IconButton highlight="#059669" onClick={() => alert('Rebook')} title="Rebook">
                        <RotateCcw size={16} />
                      </IconButton>
                    )}
                  </BookingActions>
                </BookingContent>
              </BookingCard>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <Calendar size={48} color="#9CA3AF" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                {searchTerm || filter !== 'all'
                  ? 'No matching bookings'
                  : "You haven't made any bookings yet"}
              </h3>
              <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your filters or search term'
                  : 'Start by booking your first room'}
              </p>
              <button onClick={() => { setFilter('all'); setSearchTerm(''); }} style={{ color: '#2563EB', fontWeight: '500' }}>
                {searchTerm || filter !== 'all' ? 'Clear filters' : 'Book a room'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
};

export default MyBookingsPage;
