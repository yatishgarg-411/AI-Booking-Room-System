import React from 'react';
import { motion } from 'framer-motion';
import { Users, Wifi, Monitor, Volume2, Wind, MapPin, Clock, Calendar } from 'lucide-react';
import styled from 'styled-components';

const Card = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: 0.3s all ease-in-out;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem 1.5rem;
`;

const RoomTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const TextMuted = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
`;

const StatusBadge = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const FeatureTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
`;

const BookButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
`;

const RoomCard = ({ room, onBook, showBookButton = false, className = '' }) => {
  const getStatusColor = status => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'booked': return '#ef4444';
      case 'in_process': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'available': return 'Available';
      case 'booked': return 'Booked';
      case 'in_process': return 'In Process';
      default: return 'Unknown';
    }
  };

  const getFeatureIcon = feature => {
    switch (feature.toLowerCase()) {
      case 'projector': return Monitor;
      case 'ac': return Wind;
      case 'sound system': return Volume2;
      case 'wifi': return Wifi;
      default: return MapPin;
    }
  };

  return (
    <Card whileHover={{ y: -4 }} className={className}>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <RoomTitle>{room.name}</RoomTitle>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Users size={16} />
                <TextMuted>Up to {room.capacity}</TextMuted>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={16} />
                <TextMuted>Floor {room.floor}</TextMuted>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 12, height: 12, backgroundColor: getStatusColor(room.status), borderRadius: '9999px', animation: 'pulse 1.5s infinite' }} />
            <StatusBadge style={{ color: getStatusColor(room.status) }}>{getStatusText(room.status)}</StatusBadge>
          </div>
        </div>

        {room.currentBooking && (
          <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
              <Clock size={16} />
              Booked by <strong>{room.currentBooking.bookedBy}</strong>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>
              {room.currentBooking.startTime} - {room.currentBooking.endTime}
            </div>
          </div>
        )}

        {room.nextBooking && room.status === 'available' && (
          <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#3b82f6' }}>
              <Calendar size={16} />
              <strong>Next booking</strong>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#3b82f6', marginTop: '0.25rem' }}>
              {room.nextBooking.startTime} - {room.nextBooking.endTime}
            </div>
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>Amenities</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {room.features.map(feature => {
              const Icon = getFeatureIcon(feature);
              return (
                <FeatureTag key={feature}>
                  <Icon size={12} />
                  <span>{feature}</span>
                </FeatureTag>
              );
            })}
          </div>
        </div>
      </CardHeader>

      {showBookButton && (
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <BookButton
            onClick={onBook}
            disabled={room.status !== 'available'}
            style={room.status === 'available'
              ? { backgroundColor: '#2563eb', color: 'white' }
              : { backgroundColor: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }
            }
          >
            {room.status === 'available' ? 'Book Now' : 'Unavailable'}
          </BookButton>
        </div>
      )}
    </Card>
  );
};

export default RoomCard;