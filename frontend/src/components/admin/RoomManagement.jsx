import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Search, Users, MapPin, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import styled from 'styled-components';
import RoomDetailsModal from './RoomDetailsModel';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 90rem;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleGroup = styled.div`
  h1 {
    font-size: 1.875rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  p {
    color: #4b5563;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const FilterCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  th {
    text-align: left;
    padding: 1rem 1.5rem;
    font-weight: 500;
    color: #111827;
  }
`;

const Tbody = styled.tbody`
  tr:hover {
    background-color: #f9fafb;
  }

  td {
    padding: 1rem 1.5rem;
  }
`;

const RoomManagement = () => {

  const { rooms , bookings,  fetchRooms, getComputedRoomStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');//Use State for search input string
  const [filterFloor, setFilterFloor] = useState('');//Used to store value of Floor filter selected
  const [selectedRoom, setSelectedRoom] = useState(null);//used to check which room is clicked to view info
  const [showRoomModal, setShowRoomModal] = useState(false);// To open Room Details Model Component
  const [initialTab,setInitialTab] = useState('details');//When Show Room Details Model Component Appears The initial Tab to display

  // Helper function to parse booking date and time
  const parseBookingDate = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const time = timeStr.length === 5 ? timeStr : timeStr.slice(0,5);
    const isoString = `${dateStr}T${time}`;
    const d = new Date(isoString);
    return isNaN(d.getTime()) ? null : d;
  };

  // Helper function to get computed room status
  const getRoomStatus = (room) => {
    return getComputedRoomStatus(room.id);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.features.some(feature => 
      feature.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFloor = !filterFloor || room.floor.toString() === filterFloor;
    return matchesSearch && matchesFloor;
  });

  const floors = Array.from(new Set(rooms.map((room) => room.floor))).sort();

  // Remove this useEffect:
  // useEffect(() => {
  //   fetchRooms();
  // }, []);


  const findBookingId = (id) => {
    const now = new Date();
    const ongoingBooking = bookings.find(b => {
      if (b.roomId !== id && b.room_name !== id) return false;
      if (b.status === 'cancelled') return false;
      
      const start = parseBookingDate(b.bookingStartDate || b.date, b.startTime);
      const end = parseBookingDate(b.bookingEndDate || b.date, b.endTime);
      return start && end && now >= start && now <= end;
    });
    
    return ongoingBooking ? ongoingBooking.bookedBy : 'Unknown';
  };

  return (
    <Container>
      <Header>
        <TitleGroup>
          <h1>Room Management</h1>
          <p>Manage all rooms and their configurations</p>
        </TitleGroup>
        <AddButton>
          <Plus size={16} />
          <span>Add Room</span>
        </AddButton>
      </Header>

      <FilterCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', height: '1rem', width: '1rem' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by features..."
                style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', width: '16rem' }}
              />
            </div>

            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            >
              <option value="">All Floors</option>
              {floors.map((floor) => (
                <option key={floor} value={floor}>
                  Floor {floor}
                </option>
              ))}
            </select>
          </div>

          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Showing {filteredRooms.length} of {rooms.length} rooms
          </div>
        </div>
      </FilterCard>

      <TableContainer>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <Thead>
              <tr>
                <th>Room</th>
                <th>Capacity</th>
                <th>Floor</th>
                <th>Features</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <Tbody>
              <AnimatePresence>
                {filteredRooms.map((room, index) => (
                  <motion.tr
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '0.75rem',
                            height: '0.75rem',
                            borderRadius: '9999px',
                            backgroundColor:
                              getRoomStatus(room) === 'available'
                                ? '#22c55e'
                                : getRoomStatus(room) === 'booked'
                                ? '#ef4444'
                                : '#f97316'
                          }}
                        ></div>
                        <div>
                          <div style={{ fontWeight: 500, color: '#111827' }}>{room.name}</div>
                          {getRoomStatus(room) === 'booked' && (
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              Booked by {findBookingId(room.id)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#111827' }}>
                        <Users size={16} color="#9ca3af" />
                        {room.capacity}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#111827' }}>
                        <MapPin size={16} color="#9ca3af" />
                        Floor {room.floor}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {room.features.slice(0, 2).map((feature) => (
                          <span
                            key={feature}
                            style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem' }}
                          >
                            {feature}
                          </span>
                        ))}
                        {room.features.length > 2 && (
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>+{room.features.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          backgroundColor:
                            getRoomStatus(room) === 'available'
                              ? '#dcfce7'
                              : getRoomStatus(room) === 'booked'
                              ? '#fee2e2'
                              : '#ffedd5',
                          color:
                            getRoomStatus(room) === 'available'
                              ? '#166534'
                              : getRoomStatus(room) === 'booked'
                              ? '#991b1b'
                              : '#c2410c',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      >
                        {getRoomStatus(room) === 'available' ? 'Available' : getRoomStatus(room) === 'booked' ? 'Booked' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button style={{ color: '#9ca3af' }} onClick={() => { setSelectedRoom(room); setShowRoomModal(true); setInitialTab('details')}}>
                          <Eye size={16} />
                        </button>
                        <button style={{ color: '#10b981' }} onClick={()=>{setSelectedRoom(room); setShowRoomModal(true); setInitialTab('settings')}}>
                          <Edit3 size={16} />
                        </button>
                        <button style={{ color: '#ef4444' }} onClick={()=>{setSelectedRoom(room); setShowRoomModal(true); setInitialTab('settings')}} >
                          <Trash2 size={16} />
                        </button>
              
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </Tbody>
          </Table>
        </div>
      </TableContainer>

      {filteredRooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '3rem 0' }}
        >
          <div
            style={{
              width: '4rem',
              height: '4rem',
              background: '#f3f4f6',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <MapPin size={24} color="#9ca3af" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>
            No rooms found
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterFloor('');
            }}
            style={{ color: '#2563eb', fontWeight: 500 }}
          >
            Clear filters
          </button>
        </motion.div>
      )}

      {showRoomModal && selectedRoom &&  (
        <RoomDetailsModal
          room={selectedRoom}
          initialTab={initialTab}
          onClose={() => { setShowRoomModal(false); setSelectedRoom(null); setInitialTab('details') }}
        />
      )}
    </Container>
  );
};

export default RoomManagement;