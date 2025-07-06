import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Search,
  Grid3X3,
  Users,
} from 'lucide-react';

const dummyRooms = [
  { id: 'r1', name: 'Orchid', floor: 1, capacity: 6, status: 'available', features: ['WiFi'] },
  { id: 'r2', name: 'Lily',   floor: 2, capacity: 4, status: 'booked',    features: ['Projector'] },
  { id: 'r3', name: 'Rose',   floor: 1, capacity: 8, status: 'in_process', features: ['AC', 'WiFi'] },
];

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

export default function RoomStatusPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const floors = Array.from(new Set(dummyRooms.map(r => r.floor))).sort();
  const filtered = dummyRooms.filter(r =>
    (selectedFloor === null || r.floor === selectedFloor) &&
    (statusFilter === 'all' || r.status === statusFilter) &&
    (r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const stats = {
    total: filtered.length,
    available: filtered.filter(r=>r.status==='available').length,
    booked: filtered.filter(r=>r.status==='booked').length,
    inProcess: filtered.filter(r=>r.status==='in_process').length,
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

      {viewMode === 'grid' ? (
        <Grid>
          <AnimatePresence>
            {filtered.map((room, i) => (
              <RoomTile
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <h3>{room.name}</h3>
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
                {filtered.filter(r=>r.floor===f).map(r => (
                  <RoomTile
                    key={r.id}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div style={{
                      width:12,height:12,borderRadius:'50%',
                      background: r.status==='available'?'green': r.status==='booked'?'red':'orange',
                      margin:'0 auto 4px'
                    }} />
                    <p>{r.name}</p>
                  </RoomTile>
                ))}
              </Grid>
            </div>
          ))}
        </MapView>
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
