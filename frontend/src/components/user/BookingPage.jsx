import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaUsers, FaLayerGroup, FaFilter } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import BookingModal from './BookingModal';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f3e8ff 100%);
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  align-items: center;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 2px 12px rgba(79,70,229,0.08);
  padding: 1.2rem 2rem;
  margin: 2rem auto 2.5rem auto;
  max-width: 1200px;
  position: sticky;
  top: 0;
  z-index: 10;
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

const FloorsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FloorSection = styled.div`
  margin-bottom: 2.5rem;
`;

const FloorTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 1rem;
  margin-left: 0.5rem;
`;

const RoomsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #a5b4fc #f3f4f6;
  &::-webkit-scrollbar {
    height: 8px;
    background: #f3f4f6;
  }
  &::-webkit-scrollbar-thumb {
    background: #a5b4fc;
    border-radius: 4px;
  }
`;

const RoomCard = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.10);
  border: 1.5px solid #e5e7eb;
  min-width: 270px;
  max-width: 300px;
  flex: 0 0 270px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: box-shadow 0.2s, border 0.2s;
  &:hover {
    box-shadow: 0 8px 32px rgba(99,102,241,0.18);
    border: 1.5px solid #6366f1;
  }
`;

const RoomImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 1.2rem 1.2rem 0 0;
  background: #e0e7ff;
`;

const RoomContent = styled.div`
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => props.status === 'available' ? '#d1fae5' : '#fecaca'};
  color: ${props => props.status === 'available' ? '#065f46' : '#991b1b'};
  margin-bottom: 0.7rem;
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

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  padding: 2.5rem 0;
`;

const allFeatures = ['Projector', 'Video Call', 'Whiteboard', 'WiFi', 'Coffee'];

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
    <PageContainer>
      <FilterBar>
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
      </FilterBar>
      <FloorsContainer>
        {roomsByFloor.every(floorObj => floorObj.rooms.length === 0) ? (
          <EmptyState>No rooms found. Try adjusting your filters.</EmptyState>
        ) : (
          roomsByFloor.map(({ floor, rooms }) => (
            rooms.length > 0 && (
              <FloorSection key={floor}>
                <FloorTitle>{floor} Floor</FloorTitle>
                <RoomsRow>
                  {rooms.map(room => {
                    const status = getComputedRoomStatus(room.id);
                    return (
                      <RoomCard key={room.id}>
                        <RoomImage src={room.image || '/room-placeholder.jpg'} alt={room.name} />
                        <RoomContent>
                          <StatusBadge status={status}>{status}</StatusBadge>
                          <RoomName>{room.name}</RoomName>
                          <RoomDetails>Capacity: {room.capacity}</RoomDetails>
                          <FeaturesList>
                            {room.features && room.features.length > 0 ? room.features.map((feature, idx) => (
                              <span key={idx} style={{ background: '#f3f4f6', borderRadius: '0.7rem', padding: '0.2rem 0.7rem', fontSize: '0.95rem', color: '#4f46e5', marginRight: 4 }}>{feature}</span>
                            )) : (
                              <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Standard amenities</span>
                            )}
                          </FeaturesList>
                          <BookButton
                            onClick={() => { setSelectedRoom(room); setShowBookingModal(true); }}
                            disabled={status === 'unavailable'}
                            available={status !== 'unavailable'}
                          >
                            Book Now
                          </BookButton>
                        </RoomContent>
                      </RoomCard>
                    );
                  })}
                </RoomsRow>
              </FloorSection>
            )
          ))
        )}
      </FloorsContainer>
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => { setShowBookingModal(false); setSelectedRoom(null); }}
        />
      )}
    </PageContainer>
  );
};

export default BookingPage;