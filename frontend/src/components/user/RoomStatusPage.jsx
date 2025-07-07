import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Search,
  Grid3X3,
  Users,
} from 'lucide-react';
import RoomDetailsModal from './RoomDetailsModel';
import BookingModal from './BookingModal';

const dummyRooms = [
  { id: 1, number: '101', floor: 1, capacity: 2, features: ['AC', 'TV'], status: 'available', images: ['/room1.jpg'], },
  { id: 2, number: '102', floor: 1, capacity: 4, features: ['AC', 'Balcony'], status: 'booked', images: ['/room2.jpg'], },
  { id: 3, number: '201', floor: 2, capacity: 3, features: ['TV'], status: 'available', images: ['/room3.jpg'], },
  { id: 4, number: '202', floor: 2, capacity: 2, features: ['AC'], status: 'booked', images: ['/room4.jpg'], },
  { id: 5, number: '301', floor: 3, capacity: 5, features: ['AC', 'TV', 'Balcony'], status: 'available', images: ['/room5.jpg'], },
];

const allFeatures = ['AC', 'TV', 'Balcony'];
const allFloors = [1, 2, 3];

const Container = styled.div`
  padding: 2rem; max-width: 1280px; margin: 0 auto;
`;
const Header = styled.div`
  margin-bottom: 2rem;
`;
const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem; margin-bottom: 2rem;
`;
const StatCard = styled.div`
  background: white; padding: 1.5rem; border-radius: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
`;
const Controls = styled.div`
  background: white; padding: 1.5rem; border-radius: 1rem;
  display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;
`;
const SearchWrapper = styled.div`
  position: relative; flex: 1; min-width: 200px;
`;
const SearchInput = styled.input`
  width: 100%; padding: 0.5rem 2rem; border-radius: 1rem;
  border: 1px solid #d1d5db;
`;
const FilterSelect = styled.select`
  padding: 0.5rem 1rem; border-radius: 1rem;
  border: 1px solid #d1d5db;
`;
const ViewToggle = styled.div`
  display: flex; background: #f3f4f6; border-radius: 1rem;
`;
const ViewButton = styled.button`
  padding: 0.5rem 1rem; border: none; background: ${({ active }) => active ? 'white' : 'transparent'};
  display: flex; align-items: center; gap: 0.5rem;
  border-radius: 1rem;
  &:hover { background: white; }
`;
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;
`;
const MapView = styled.div`
  background: white; padding: 1.5rem; border-radius: 1rem;
`;
const RoomTile = styled(motion.div)`
  padding: 1rem; border-radius: 1rem; text-align: center;
  cursor: pointer;
`;
const EmptyState = styled.div`
  text-align: center; padding: 3rem;
`;

const FilterSection = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 140px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 0.2rem;
`;

const FilterInput = styled.input`
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
`;

const FilterSelectStyled = styled.select`
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  background: #f3f4f6;
  min-width: 120px;
  margin-top: 0.5rem;
`;

const MultiSelect = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FeatureCheckbox = styled.label`
  background: #f3f4f6;
  color: #4f46e5;
  border-radius: 0.5rem;
  padding: 0.3rem 0.9rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border: 2px solid transparent;
  transition: border 0.2s;
  input {
    margin-right: 0.3rem;
  }
  &.selected {
    border: 2px solid #4f46e5;
    background: #e0e7ff;
  }
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const RoomCard = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 16px rgba(79,70,229,0.10);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  border: 2px solid ${props => props.status === 'booked' ? '#ef4444' : '#22c55e'};
  transition: box-shadow 0.2s, border 0.2s;
  position: relative;
`;

const RoomImage = styled.img`
  width: 100%;
  max-width: 260px;
  border-radius: 0.75rem;
  object-fit: cover;
  margin-bottom: 0.5rem;
`;

const BookButton = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  &:hover { background: #3730a3; }
  &:disabled { background: #d1d5db; color: #6b7280; cursor: not-allowed; }
`;

const FeatureTag = styled.span`
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 0.5rem;
  padding: 0.2rem 0.7rem;
  font-size: 0.95rem;
  margin-right: 0.5rem;
`;

const StatusBadge = styled.span`
  background: ${props => props.status === 'booked' ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.status === 'booked' ? '#ef4444' : '#22c55e'};
  border-radius: 0.5rem;
  padding: 0.2rem 0.8rem;
  font-weight: bold;
  font-size: 1rem;
`;

const RoomTitle = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  color: #4f46e5;
`;

const dummyUser = { name: 'John Doe', email: 'john@example.com' };

export default function RoomStatusPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ capacity: '', features: [], floor: '' });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const floors = Array.from(new Set(dummyRooms.map(r => r.floor))).sort();
  const filtered = dummyRooms.filter(r =>
    (selectedFloor === null || r.floor === selectedFloor) &&
    (statusFilter === 'all' || r.status === statusFilter) &&
    (((r.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())) ||
      (Array.isArray(r.features) && r.features.some(f => (f || '').toLowerCase().includes((searchTerm || '').toLowerCase()))))
  );

  const stats = {
    total: filtered.length,
    available: filtered.filter(r=>r.status==='available').length,
    booked: filtered.filter(r=>r.status==='booked').length,
    inProcess: filtered.filter(r=>r.status==='in_process').length,
  };

  const handleFeatureChange = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  return (
    <Container>
      <Header>
        <h1>Live Room Status</h1>
        <p>Real-time availability and room info</p>
      </Header>

      <StatsGrid>
        <StatCard><strong>Total:</strong> {stats.total}</StatCard>
        <StatCard><strong>Available:</strong> {stats.available}</StatCard>
        <StatCard><strong>Booked:</strong> {stats.booked}</StatCard>
        <StatCard><strong>In‑Process:</strong> {stats.inProcess}</StatCard>
      </StatsGrid>

      <Controls>
        <SearchWrapper>
          <Search size={16} style={{ position:'absolute', top:'50%', left:'12px', transform:'translateY(-50%)' }} />
          <SearchInput
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>

        <FilterSelect onChange={e => setSelectedFloor(e.target.value ? Number(e.target.value) : null)}>
          <option value="">All Floors</option>
          {floors.map(f => <option key={f} value={f}>Floor {f}</option>)}
        </FilterSelect>

        <FilterSelect onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="in_process">In Process</option>
        </FilterSelect>

        <ViewToggle>
          <ViewButton active={viewMode === 'grid'} onClick={()=>setViewMode('grid')}>
            <Grid3X3 size={16}/> Grid
          </ViewButton>
          <ViewButton active={viewMode === 'map'} onClick={()=>setViewMode('map')}>
            <Map size={16}/> Map
          </ViewButton>
        </ViewToggle>
      </Controls>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>Capacity</FilterLabel>
          <FilterInput
            type="number"
            min="1"
            value={filters.capacity}
            onChange={e => setFilters(f => ({ ...f, capacity: e.target.value }))}
            placeholder="No. of people"
          />
        </FilterGroup>
        <div style={{ width: '100%' }}>
          <div style={{ fontWeight: 600, margin: '1rem 0 0.5rem 0', color: '#4f46e5', fontSize: '1.1rem' }}>Filter by Features</div>
          <MultiSelect>
            {allFeatures.map(feature => (
              <FeatureCheckbox
                key={feature}
                className={filters.features.includes(feature) ? 'selected' : ''}
              >
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                /> {feature}
              </FeatureCheckbox>
            ))}
          </MultiSelect>
        </div>
        <FilterGroup style={{ marginTop: '1.2rem' }}>
          <FilterLabel>Floor</FilterLabel>
          <FilterSelectStyled
            value={filters.floor}
            onChange={e => setFilters(f => ({ ...f, floor: e.target.value }))}
          >
            <option value="">All</option>
            {allFloors.map(floor => (
              <option key={floor} value={floor}>{floor}</option>
            ))}
          </FilterSelectStyled>
        </FilterGroup>
      </FilterSection>

      {viewMode === 'grid' ? (
        <Grid>
          <AnimatePresence>
            {(filtered.length > 0 ? filtered : dummyRooms).map((room, i) => (
              <RoomTile
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <h3>{room.number}</h3>
                <p>Floor {room.floor} • {room.capacity} seats</p>
                <p>Status: {room.status}</p>
              </RoomTile>
            ))}
          </AnimatePresence>
        </Grid>
      ) : (
        <MapView>
          <h3>Floor Plan View</h3>
          {floors.map(f => (
            <div key={f}>
              <h4>Floor {f}</h4>
              <Grid>
                {(filtered.filter(r=>r.floor===f).length > 0 ? filtered.filter(r=>r.floor===f) : dummyRooms.filter(r=>r.floor===f)).map(r => (
                  <RoomTile
                    key={r.id}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div style={{
                      width:12,height:12,borderRadius:'50%',
                      background: r.status==='available'?'green': r.status==='booked'?'red':'orange',
                      margin:'0 auto 4px'
                    }} />
                    <p>{r.number}</p>
                  </RoomTile>
                ))}
              </Grid>
            </div>
          ))}
        </MapView>
      )}

      <RoomGrid>
        {(filtered.length > 0 ? filtered : dummyRooms).map(room => (
          <RoomCard key={room.id} status={room.status}>
            <RoomImage src={room.images[0]} alt={room.name} />
            <RoomTitle>{room.name} <span style={{ color: '#64748b', fontWeight: 400, fontSize: '1rem' }}>({room.number})</span></RoomTitle>
            <div>Floor: <b>{room.floor}</b></div>
            <div>Capacity: <b>{room.capacity}</b></div>
            <div>Features: {room.features.map(f => <FeatureTag key={f}>{f}</FeatureTag>)}</div>
            <div>Status: <StatusBadge status={room.status}>{room.status === 'booked' ? 'Booked' : 'Available'}</StatusBadge></div>
            {room.status === 'available' ? (
              <BookButton
                onClick={() => { setSelectedRoom(room); setShowBookingModal(true); }}
              >Book this Room</BookButton>
            ) : (
              <div style={{ color: '#ef4444', fontWeight: 'bold', marginTop: 8 }}>Room not available</div>
            )}
          </RoomCard>
        ))}
      </RoomGrid>

      {showModal && selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setShowModal(false)}
        />
      )}

      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => { setShowBookingModal(false); setSelectedRoom(null); }}
          prefillUser={dummyUser}
        />
      )}

      {filtered.length === 0 && (
        <EmptyState>
          <Map size={48} color="#ccc"/>
          <h3>No rooms found</h3>
          <p>Adjust filters or search to explore rooms.</p>
          <button onClick={() => {
            setSelectedFloor(null); setStatusFilter('all'); setSearchTerm('');
          }}>Clear filters</button>
        </EmptyState>
      )}
    </Container>
  );
}
