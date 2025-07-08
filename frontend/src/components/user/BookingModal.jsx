// BookingModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
// Helper to log recent activity
async function logRecentActivity(activity) {
  try {
    await axios.post('http://localhost:8000/recentactivity/post', activity);
  } catch (err) {
    // Optionally handle/log error
    console.error('Failed to log activity:', err);
  }
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem 2.5rem;
  min-width: 350px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #1e293b;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.2rem;
`;

const Input = styled.input`
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background: #f9fafb;
`;

const Button = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;
  &:hover { background: #3730a3; }
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-size: 1rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const SuccessMsg = styled.div`
  color: #22c55e;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const BookingModal = ({ room, onClose }) => {
  const { fetchBookings } = useData();
  const { name, email } = useAuth();
  const [form, setForm] = useState({
    name: name || '',
    email: email || '',
    room: room?.name || '',
    floor: room?.floor || '',
    dateStart: '',
    dateEnd: '',
    timeStart: '',
    timeEnd: '',
    purpose: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const payload = {
        bookingId: '',
        roomId: room.id,
        room_name: room.name,
        bookedBy: form.email,
        bookingStartDate: form.dateStart,
        bookingEndDate: form.dateEnd,
        startTime: form.timeStart.length === 5 ? form.timeStart + ':00' : form.timeStart,
        endTime: form.timeEnd.length === 5 ? form.timeEnd + ':00' : form.timeEnd,
        purpose: form.purpose,
      };
      await axios.post('http://localhost:8000/room/booking', payload);
      // Log activity
      await logRecentActivity({
        type: 'booking',
        action: 'created',
        roomName: room.name,
        roomId: room.id,
        user: form.email,
        details: `Booked from ${form.dateStart} ${form.timeStart} to ${form.dateEnd} ${form.timeEnd}`,
        bookingDetails: payload,
        changes: null,
        timestamp: new Date().toISOString(),
      });
      fetchBookings && fetchBookings();
      onClose();
    } catch (error) {
      let detail = error?.response?.data?.detail || error?.response?.data?.msg || error.message || 'Booking failed';
      if (Array.isArray(detail)) {
        detail = detail.map((d, i) => d.msg || JSON.stringify(d)).join(', ');
      } else if (typeof detail === 'object') {
        detail = detail.msg || JSON.stringify(detail);
      }
      setErrorMsg(detail);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>Book Room</Title>
          <Form onSubmit={handleSubmit}>
            <div>
              <Label>Name</Label>
              <Input name="name" value={form.name} disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" value={form.email} disabled />
            </div>
            <div>
              <Label>Room</Label>
              <Input name="room" value={form.room} disabled />
            </div>
            <div>
              <Label>Floor</Label>
              <Input name="floor" value={form.floor} disabled />
            </div>
            <div>
              <Label>Booking Start Date</Label>
              <Input name="dateStart" type="date" value={form.dateStart} onChange={handleChange} required />
            </div>
            <div>
              <Label>Booking End Date</Label>
              <Input name="dateEnd" type="date" value={form.dateEnd} onChange={handleChange} required />
            </div>
            <div>
              <Label>Start Time</Label>
              <Input name="timeStart" type="time" value={form.timeStart} onChange={handleChange} required />
            </div>
            <div>
              <Label>End Time</Label>
              <Input name="timeEnd" type="time" value={form.timeEnd} onChange={handleChange} required />
            </div>
            <div>
              <Label>Purpose</Label>
              <Input name="purpose" value={form.purpose} onChange={handleChange} required />
            </div>
            {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
            <Button type="submit">Book Room</Button>
            <Button style={{ background: '#e5e7eb', color: '#1e293b' }} type="button" onClick={onClose}>
              Cancel
            </Button>
          </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BookingModal;
