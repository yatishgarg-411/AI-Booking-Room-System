import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import './FloorBlueprint.css';

const FloorBlueprint = () => {
  const { rooms, bookings, getComputedRoomStatus } = useData();

  // Group rooms by floor
  const roomsByFloor = rooms.reduce((acc, room) => {
    const floor = room.floor;
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(room);
    return acc;
  }, {});

  // Sort floors and rooms within each floor
  const sortedFloors = Object.keys(roomsByFloor).sort((a, b) => parseInt(a) - parseInt(b));
  sortedFloors.forEach(floor => {
    roomsByFloor[floor].sort((a, b) => a.name.localeCompare(b.name));
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return {
          bg: '#dcfce7',
          border: '#22c55e',
          text: '#166534',
          icon: CheckCircle,
          iconColor: '#22c55e'
        };
      case 'booked':
        return {
          bg: '#fee2e2',
          border: '#ef4444',
          text: '#991b1b',
          icon: Clock,
          iconColor: '#ef4444'
        };
      case 'unavailable':
        return {
          bg: '#fef3c7',
          border: '#f59e0b',
          text: '#92400e',
          icon: XCircle,
          iconColor: '#f59e0b'
        };
      default:
        return {
          bg: '#f3f4f6',
          border: '#9ca3af',
          text: '#374151',
          icon: AlertTriangle,
          iconColor: '#9ca3af'
        };
    }
  };

  const getCurrentBooking = (roomId) => {
    const now = new Date();
    return bookings.find(booking => {
      if (booking.roomId !== roomId && booking.room_name !== roomId) return false;
      
      const startDate = new Date(booking.bookingStartDate || booking.date);
      const endDate = new Date(booking.bookingEndDate || booking.date);
      const startTime = booking.startTime;
      const endTime = booking.endTime;
      
      // Check if booking is ongoing
      return now >= startDate && now <= endDate && 
             now.getHours() >= parseInt(startTime.split(':')[0]) &&
             now.getHours() <= parseInt(endTime.split(':')[0]);
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Live Room Status</h1>
        <p style={{ color: '#6b7280' }}>Real-time floor blueprint view of all rooms</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {sortedFloors.map((floor) => {
          const floorRooms = roomsByFloor[floor];
          const leftRooms = floorRooms.filter((_, index) => index % 2 === 0);
          const rightRooms = floorRooms.filter((_, index) => index % 2 === 1);

          return (
            <motion.div
              key={floor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}
            >
              {/* Floor Header */}
              <div className="floor-header" style={{
                color: 'white',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <MapPin size={24} />
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                  Floor {floor}
                </h2>
                <div style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.9 }}>
                  {floorRooms.length} rooms
                </div>
              </div>

              {/* Floor Layout */}
              <div className="floor-layout" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 1fr',
                gap: '0',
                minHeight: '300px',
                position: 'relative'
              }}>
                {/* Left Side Rooms */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '24px',
                  background: '#fafafa'
                }}>
                  {leftRooms.map((room) => {
                    const status = getComputedRoomStatus(room.id);
                    const statusColors = getStatusColor(status);
                    const StatusIcon = statusColors.icon;
                    const currentBooking = getCurrentBooking(room.id);

                    return (
                      <motion.div
                        key={room.id}
                        className={`room-card ${status}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          background: statusColors.bg,
                          border: `2px solid ${statusColors.border}`,
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Status indicator */}
                        <div className={`status-indicator ${status}`} style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: statusColors.border
                        }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <StatusIcon size={16} color={statusColors.iconColor} />
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: statusColors.text,
                            margin: 0
                          }}>
                            {room.name}
                          </h3>
                        </div>

                        <div style={{ fontSize: '14px', color: statusColors.text, lineHeight: '1.4' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Users size={12} />
                            <span>Capacity: {room.capacity}</span>
                          </div>
                          
                          {currentBooking && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              marginTop: '8px',
                              padding: '6px 8px',
                              background: 'rgba(255,255,255,0.3)',
                              borderRadius: '6px',
                              fontSize: '12px'
                            }}>
                              <Clock size={12} />
                              <span>Booked until {currentBooking.endTime}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Center Passage */}
                <div className="passage" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  borderLeft: '2px dashed #d1d5db',
                  borderRight: '2px dashed #d1d5db'
                }}>
                  <div style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    letterSpacing: '2px'
                  }}>
                    PASSAGE
                  </div>
                  
                  {/* Elevator/Stairs indicator */}
                  <div className="elevator-indicator" style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '40px',
                    height: '40px',
                    background: '#3b82f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ↑↓
                  </div>
                </div>

                {/* Right Side Rooms */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '24px',
                  background: '#fafafa'
                }}>
                  {rightRooms.map((room) => {
                    const status = getComputedRoomStatus(room.id);
                    const statusColors = getStatusColor(status);
                    const StatusIcon = statusColors.icon;
                    const currentBooking = getCurrentBooking(room.id);

                    return (
                      <motion.div
                        key={room.id}
                        className={`room-card ${status}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          background: statusColors.bg,
                          border: `2px solid ${statusColors.border}`,
                          borderRadius: '12px',
                          padding: '16px',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Status indicator */}
                        <div className={`status-indicator ${status}`} style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: statusColors.border
                        }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <StatusIcon size={16} color={statusColors.iconColor} />
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: statusColors.text,
                            margin: 0
                          }}>
                            {room.name}
                          </h3>
                        </div>

                        <div style={{ fontSize: '14px', color: statusColors.text, lineHeight: '1.4' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Users size={12} />
                            <span>Capacity: {room.capacity}</span>
                          </div>
                          
                          {currentBooking && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              marginTop: '8px',
                              padding: '6px 8px',
                              background: 'rgba(255,255,255,0.3)',
                              borderRadius: '6px',
                              fontSize: '12px'
                            }}>
                              <Clock size={12} />
                              <span>Booked until {currentBooking.endTime}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Floor Legend */}
              <div style={{
                padding: '16px 24px',
                background: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '24px',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
                  <span>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                  <span>Booked</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                  <span>Unavailable</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FloorBlueprint; 