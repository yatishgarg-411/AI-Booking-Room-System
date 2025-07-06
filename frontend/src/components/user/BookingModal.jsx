// BookingModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Users, MapPin, CheckCircle } from 'lucide-react';
import styled from 'styled-components';
import { format, addDays } from 'date-fns';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const Form = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  width: 100%;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  width: 100%;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const SummaryBox = styled.div`
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
`;

const CancelButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;
  &:hover {
    background: #e5e7eb;
  }
`;

const SubmitButton = styled(Button)`
  background: #2563eb;
  color: white;
  &:hover {
    background: #1d4ed8;
  }
`;

const BookingModal = ({ room, onClose, onBook }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onBook();
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <div>
            <Title>Book {room.name}</Title>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              <span style={{ marginRight: '1rem' }}><Users size={14} /> Up to {room.capacity}</span>
              <span><MapPin size={14} /> Floor {room.floor}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.5rem' }}>
            <X size={20} color="#6b7280" />
          </button>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Date</Label>
            <div style={{ position: 'relative' }}>
              <Calendar size={16} style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <Input type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
            </div>
          </InputGroup>

          <InputGroup>
            <Label>Start Time</Label>
            <div style={{ position: 'relative' }}>
              <Clock size={16} style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <Select defaultValue="09:00">
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
              </Select>
            </div>
          </InputGroup>

          <InputGroup>
            <Label>End Time</Label>
            <div style={{ position: 'relative' }}>
              <Clock size={16} style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <Select defaultValue="10:00">
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
              </Select>
            </div>
          </InputGroup>

          <InputGroup>
            <Label>Required Features</Label>
            <FeatureGrid>
              {room.features.map((feature) => (
                <label key={feature}>
                  <input type="checkbox" /> {feature}
                </label>
              ))}
            </FeatureGrid>
          </InputGroup>

          <InputGroup>
            <Label>Meeting Notes</Label>
            <textarea rows="3" placeholder="Optional" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} />
          </InputGroup>

          <SummaryBox>
            <div><strong>Room:</strong> {room.name} (Up to {room.capacity} people)</div>
            <div><strong>Date:</strong> {format(new Date(), 'MMM dd, yyyy')}</div>
            <div><strong>Time:</strong> 09:00 - 10:00</div>
            <div><strong>Duration:</strong> 1 hour</div>
            <div><strong>Features:</strong> Projector, Whiteboard</div>
          </SummaryBox>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
            <SubmitButton type="submit">Confirm Booking</SubmitButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

// Dummy usage example for previewing component
const dummyRoom = {
  id: '1',
  name: 'Ocean View Conference Room',
  capacity: 12,
  floor: 3,
  features: ['Projector', 'Whiteboard', 'Video Call']
};

export default function DummyWrapper() {
  const handleClose = () => alert('Modal Closed');
  const handleBook = () => alert('Booked!');

  return <BookingModal room={dummyRoom} onClose={handleClose} onBook={handleBook} />;
}
