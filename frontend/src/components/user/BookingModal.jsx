// BookingModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

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
  padding: 2rem;
  min-width: 350px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
`;

const Label = styled.label`
  font-weight: 500;
  color: #1e293b;
`;

const Button = styled.button`
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

const BookingModal = ({ room, onClose, prefillUser, isCancel }) => {
  const [form, setForm] = useState({
    name: prefillUser?.name || '',
    email: prefillUser?.email || '',
    room: room?.number || '',
    floor: room?.floor || '',
    dateStart: '',
    dateEnd: '',
    timeStart: '',
    timeEnd: '',
    purpose: '',
    reason: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
          {isCancel ? 'Cancel Booking' : 'Book Room'}
        </h2>
        {submitted ? (
          <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {isCancel ? 'Booking cancelled successfully!' : 'Room booked successfully!'}
            <Button style={{ background: '#e5e7eb', color: '#1e293b', marginLeft: 8 }} onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required disabled={!!prefillUser} />
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} required disabled={!!prefillUser} />
            <Label>Room</Label>
            <Input name="room" value={form.room} onChange={handleChange} required disabled />
            <Label>Floor</Label>
            <Input name="floor" value={form.floor} onChange={handleChange} required disabled />
            {!isCancel && <>
              <Label>Date Start</Label>
              <Input name="dateStart" type="date" value={form.dateStart} onChange={handleChange} required />
              <Label>Date End</Label>
              <Input name="dateEnd" type="date" value={form.dateEnd} onChange={handleChange} required />
              <Label>Time Start</Label>
              <Input name="timeStart" type="time" value={form.timeStart} onChange={handleChange} required />
              <Label>Time End</Label>
              <Input name="timeEnd" type="time" value={form.timeEnd} onChange={handleChange} required />
              <Label>Purpose</Label>
              <Input name="purpose" value={form.purpose} onChange={handleChange} required />
            </>}
            {isCancel && <>
              <Label>Reason for Cancellation</Label>
              <Input name="reason" value={form.reason} onChange={handleChange} required />
            </>}
            <Button type="submit">{isCancel ? 'Cancel Booking' : 'Book Room'}</Button>
            <Button style={{ background: '#e5e7eb', color: '#1e293b', marginLeft: 8 }} type="button" onClick={onClose}>
              Close
            </Button>
          </Form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default BookingModal;
