import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaUsers, FaLayerGroup, FaFilter } from 'react-icons/fa';
import { MapPin, Users, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import BookingModal from './BookingModal';

const FilterCard = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(79,70,229,0.08);
  padding: 1.2rem 2rem;
  margin: 2rem auto 2.5rem auto;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  align-items: center;
`;
const FilterInput = styled.input`
  padding: 0.7rem 1.2rem;
  border-radius: 1.5rem;
  border: 1.5px solid #d1d5db;
  font-size: 1rem;
  background: #f3f4f6;
  min-width: 160px;
`;
const FilterSelect = styled.select`
  padding: 0.7rem 1.2rem;
  border-radius: 1.5rem;
  border: 1.5px solid #d1d5db;
  font-size: 1rem;
  background: #f3f4f6;
  min-width: 140px;
`;
const FeatureTag = styled.label`
  background: ${props => props.selected ? '#6366f1' : '#f3f4f6'};
  color: ${props => props.selected ? '#fff' : '#4f46e5'};
  border-radius: 1.2rem;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  margin: 0.2rem 0.5rem 0.2rem 0;
  border: 2px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &:hover {
    background: #4f46e5;
    color: #fff;
    border: 2px solid #6366f1;
  }
`;
const BlueprintContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;
const FloorSection = styled.div`
  margin-bottom: 2.5rem;
`;
const FloorHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 16px 16px 0 0;
`;
const FloorLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  gap: 0;
  min-height: 220px;
  position: relative;
  background: #fff;
`;
const SideRooms = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #fafafa;
`;
const Passage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-left: 2px dashed #d1d5db;
  border-right: 2px dashed #d1d5db;
`;
const PassageLabel = styled.div`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 2px;
`;
const RoomCard = styled.div`
  background: ${props => props.bg};
  border: 2px solid ${props => props.border};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s, border 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  &:hover {
    box-shadow: 0 8px 32px rgba(99,102,241,0.10);
    border: 2px solid #6366f1;
  }
`;
const RoomHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
const RoomName = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.4rem;
`;
const RoomDetails = styled.div`
  font-size: 0.98rem;
  color: #64748b;
  margin-bottom: 0.5rem;
`;
const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.7rem;
`;
const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
  margin-right: 6px;
`;
const BookButton = styled.button`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: ${props => props.available ? 'linear-gradient(to right, #2563eb, #7c3aed)' : '#f3f4f6'};
  color: ${props => props.available ? '#fff' : '#9ca3af'};
  margin-top: auto;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${props => props.available ? 'linear-gradient(to right, #1d4ed8, #6d28d9)' : '#f3f4f6'};
    color: ${props => props.available ? '#fff' : '#9ca3af'};
  }
`;
const Legend = styled.div`
  display: flex;
  gap: 24px;
  font-size: 12px;
  align-items: center;
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 16px 16px;
  margin-bottom: 2.5rem;
`;
const allFeatures = ['Projector', 'Video Call', 'Whiteboard', 'WiFi', 'Coffee'];

const getStatusColor = (status) => {
  switch (status) {
    case 'available':
      return {
        bg: '#dcfce7',
        border: '#22c55e',
        text: '#166534',
        dot: '#22c55e',
        icon: <CheckCircle size={16} color="#22c55e" />
      };
    case 'booked':
      return {
        bg: '#fee2e2',
        border: '#ef4444',
        text: '#991b1b',
        dot: '#ef4444',
        icon: <Clock size={16} color="#ef4444" />
      };
    case 'unavailable':
      return {
        bg: '#fef3c7',
        border: '#f59e0b',
        text: '#92400e',
        dot: '#f59e0b',
        icon: <XCircle size={16} color="#f59e0b" />
      };
    default:
      return {
        bg: '#f3f4f6',
        border: '#9ca3af',
        text: '#374151',
        dot: '#9ca3af',
        icon: <AlertTriangle size={16} color="#9ca3af" />
      };
  }
};

const BookingPage = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('');
  const [featuresFilter, setFeaturesFilter] = useState([]);
  const { rooms, getComputedRoomStatus } = useData();

  // Get all unique floors, sorted
  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);

  // Filtering logic
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name && room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = !capacityFilter || room.capacity >= parseInt(capacityFilter);
    const matchesFloor = !floorFilter || String(room.floor) === String(floorFilter);
    const matchesFeatures = featuresFilter.length === 0 || (room.features && room.features.some(feature => featuresFilter.includes(feature)));
    return matchesSearch && matchesCapacity && matchesFloor && matchesFeatures;
  });

  // Group filtered rooms by floor
  const roomsByFloor = floors.map(floor => ({
    floor,
    rooms: filteredRooms.filter(room => String(room.floor) === String(floor))
  }));

  const handleFeatureChange = (feature) => {
    if (featuresFilter.includes(feature)) {
      setFeaturesFilter(prev => prev.filter(f => f !== feature));
    } else {
      setFeaturesFilter(prev => [...prev, feature]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f3e8ff 100%)' }}>
      <FilterCard>
        <FaSearch color="#6366f1" />
        <FilterInput
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FaUsers color="#6366f1" />
        <FilterInput
          type="number"
          min="1"
          value={capacityFilter}
          onChange={e => setCapacityFilter(e.target.value)}
          placeholder="Min capacity"
        />
        <FaLayerGroup color="#6366f1" />
        <FilterSelect
          value={floorFilter}
          onChange={e => setFloorFilter(e.target.value)}
        >
          <option value="">All Floors</option>
          {floors.map(f => (
            <option key={f} value={f}>{f} Floor</option>
          ))}
        </FilterSelect>
        <FaFilter color="#6366f1" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {allFeatures.map(feature => (
            <FeatureTag
              key={feature}
              selected={featuresFilter.includes(feature)}
            >
              <input
                type="checkbox"
                checked={featuresFilter.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
                style={{ marginRight: '0.3rem' }}
              /> {feature}
            </FeatureTag>
          ))}
        </div>
      </FilterCard>
      <BlueprintContainer>
        {roomsByFloor.every(floorObj => floorObj.rooms.length === 0) ? (
          <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.1rem', padding: '2.5rem 0' }}>
            No rooms found. Try adjusting your filters.
          </div>
        ) : (
          roomsByFloor.map(({ floor, rooms }) => (
            rooms.length > 0 && (
              <FloorSection key={floor}>
                <FloorHeader>
                  <MapPin size={24} />
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                    Floor {floor}
                  </h2>
                  <div style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
                    {rooms.length} rooms
                  </div>
                </FloorHeader>
                <FloorLayout>
                  {/* Left Side Rooms */}
                  <SideRooms>
                    {rooms.filter((_, idx) => idx % 2 === 0).map(room => {
                      const status = getComputedRoomStatus(room.id);
                      const statusColors = getStatusColor(status);
                      return (
                        <RoomCard key={room.id} bg={statusColors.bg} border={statusColors.border}>
                          <div style={{ position: 'absolute', top: 8, right: 8 }}>
                            <StatusDot color={statusColors.dot} />
                          </div>
                          <RoomHeader>
                            {statusColors.icon}
                            <RoomName>{room.name}</RoomName>
                          </RoomHeader>
                          <div style={{ fontSize: '14px', color: statusColors.text, lineHeight: '1.4' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <Users size={12} />
                              <span>Capacity: {room.capacity}</span>
                            </div>
                          </div>
                          <FeaturesList>
                            {room.features && room.features.length > 0 ? room.features.map((feature, idx) => (
                              <span key={idx} style={{ background: '#f3f4f6', borderRadius: '0.7rem', padding: '0.2rem 0.7rem', fontSize: '0.95rem', color: '#4f46e5', marginRight: 4 }}>
                                {feature === 'Projector' ? '📽️' : feature === 'Video Call' ? '🎥' : feature === 'Whiteboard' ? '📝' : feature === 'WiFi' ? '📶' : feature === 'Coffee' ? '☕' : '✨'} {feature}
                              </span>
                            )) : (
                              <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Standard amenities</span>
                            )}
                          </FeaturesList>
                          <BookButton
                            onClick={() => { setSelectedRoom(room); setShowBookingModal(true); }}
                            disabled={status === 'unavailable'}
                            available={status === 'available'||status === 'booked'}
                          >
                            Book Now
                          </BookButton>
                        </RoomCard>
                      );
                    })}
                  </SideRooms>
                  {/* Passage */}
                  <Passage>
                    <PassageLabel>PASSAGE</PassageLabel>
                  </Passage>
                  {/* Right Side Rooms */}
                  <SideRooms>
                    {rooms.filter((_, idx) => idx % 2 === 1).map(room => {
                      const status = getComputedRoomStatus(room.id);
                      const statusColors = getStatusColor(status);
                      return (
                        <RoomCard key={room.id} bg={statusColors.bg} border={statusColors.border}>
                          <div style={{ position: 'absolute', top: 8, right: 8 }}>
                            <StatusDot color={statusColors.dot} />
                          </div>
                          <RoomHeader>
                            {statusColors.icon}
                            <RoomName>{room.name}</RoomName>
                          </RoomHeader>
                          <div style={{ fontSize: '14px', color: statusColors.text, lineHeight: '1.4' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <Users size={12} />
                              <span>Capacity: {room.capacity}</span>
                            </div>
                          </div>
                          <FeaturesList>
                            {room.features && room.features.length > 0 ? room.features.map((feature, idx) => (
                              <span key={idx} style={{ background: '#f3f4f6', borderRadius: '0.7rem', padding: '0.2rem 0.7rem', fontSize: '0.95rem', color: '#4f46e5', marginRight: 4 }}>
                                {feature === 'Projector' ? '📽️' : feature === 'Video Call' ? '🎥' : feature === 'Whiteboard' ? '📝' : feature === 'WiFi' ? '📶' : feature === 'Coffee' ? '☕' : '✨'} {feature}
                              </span>
                            )) : (
                              <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Standard amenities</span>
                            )}
                          </FeaturesList>
                          <BookButton
                            onClick={() => { setSelectedRoom(room); setShowBookingModal(true); }}
                            disabled={status === 'unavailable'}
                            available={status === 'available'||status === 'booked'}
                          >
                            Book Now
                          </BookButton>
                        </RoomCard>
                      );
                    })}
                  </SideRooms>
                </FloorLayout>
                <Legend>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusDot color="#22c55e" /> <span>Available</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusDot color="#ef4444" /> <span>Booked</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusDot color="#f59e0b" /> <span>Unavailable</span>
                  </div>
                </Legend>
              </FloorSection>
            )
          ))
        )}
      </BlueprintContainer>
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => { setShowBookingModal(false); setSelectedRoom(null); }}
        />
      )}
    </div>
  );
};

export default BookingPage;