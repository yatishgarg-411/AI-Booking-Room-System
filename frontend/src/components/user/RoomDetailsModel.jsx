import React, { useState } from 'react';
import styled from 'styled-components';
import BookingModal from './BookingModal';

const dummyBookings = [
  { id: 1, roomId: 1, type: 'past', date: '2024-05-01', user: 'John Doe' },
  { id: 2, roomId: 1, type: 'upcoming', date: '2024-06-10', user: 'John Doe' },
  { id: 3, roomId: 2, type: 'past', date: '2024-04-15', user: 'John Doe' },
];

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  min-width: 350px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
`;

const RoomImage = styled.img`
  width: 100%;
  max-width: 320px;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
`;

const BookButton = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  &:hover { background: #3730a3; }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const RoomDetailsModal = ({ room, onClose }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const userBookings = dummyBookings.filter(b => b.roomId === room.id);
  const past = userBookings.filter(b => b.type === 'past');
  const upcoming = userBookings.filter(b => b.type === 'upcoming');

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
          Room {room.number} Details
        </h2>
        {room.images && room.images.length > 0 && (
          <RoomImage src={room.images[0]} alt={`Room ${room.number}`} />
        )}
        <Section>
          <div><b>Floor:</b> {room.floor}</div>
          <div><b>Capacity:</b> {room.capacity}</div>
          <div><b>Features:</b> {room.features.join(', ')}</div>
          <div><b>Status:</b> <span style={{ color: room.status === 'booked' ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{room.status}</span></div>
        </Section>
        <Section>
          <b>Past Bookings:</b>
          <ul>
            {past.length > 0 ? past.map(b => (
              <li key={b.id}>{b.date} by {b.user}</li>
            )) : <li>None</li>}
          </ul>
        </Section>
        <Section>
          <b>Upcoming Bookings:</b>
          <ul>
            {upcoming.length > 0 ? upcoming.map(b => (
              <li key={b.id}>{b.date} by {b.user}</li>
            )) : <li>None</li>}
          </ul>
        </Section>
        <BookButton onClick={() => setShowBookingModal(true)} disabled={room.status === 'booked'}>
          Book Room
        </BookButton>
        <BookButton style={{ background: '#e5e7eb', color: '#1e293b', marginLeft: 8 }} onClick={onClose}>
          Close
        </BookButton>
        {showBookingModal && (
          <BookingModal
            room={room}
            onClose={() => setShowBookingModal(false)}
            prefillUser={{ name: 'John Doe', email: 'john@example.com' }}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default RoomDetailsModal; 