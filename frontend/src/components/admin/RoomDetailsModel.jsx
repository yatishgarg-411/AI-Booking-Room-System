import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  User,
  CheckCircle,
  XCircle,
  RotateCcw,
  History,
  Users, 
  Wifi, 
  Monitor, 
  Volume2, 
  Wind, 
  MapPin,
  Clock,
  Calendar,
  Edit3,
  Settings,
  Trash2,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

// RoomDetailsModal component props are now documented in a comment
// room: object, onClose: function, onEdit?: function, onDelete?: function

// Dummy booking history item structure in a comment
// id, date, bookedBy, startTime, endTime, status
const bookRoom='';
const RoomDetailsModal = ({
  room,
  onClose,
  onEdit,
  onDelete
}) => {
  const { fetchRooms } = useData();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [extendTime, setExtendTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Dummy images for carousel
  const roomImages = [
    'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  // Dummy booking history
  const bookingHistory = [
    {
      id: '1',
      date: '2025-01-15',
      bookedBy: 'Sarah Johnson',
      startTime: '09:00',
      endTime: '10:30',
      status: 'completed'
    },
    {
      id: '2',
      date: '2025-01-14',
      bookedBy: 'Mike Chen',
      startTime: '14:00',
      endTime: '15:30',
      status: 'completed'
    },
    {
      id: '3',
      date: '2025-01-13',
      bookedBy: 'Emily Davis',
      startTime: '11:00',
      endTime: '12:00',
      status: 'cancelled'
    },
    {
      id: '4',
      date: '2025-01-12',
      bookedBy: 'Alex Rodriguez',
      startTime: '16:00',
      endTime: '17:30',
      status: 'completed'
    },
    {
      id: '5',
      date: '2025-01-11',
      bookedBy: 'Lisa Wang',
      startTime: '10:00',
      endTime: '11:30',
      status: 'completed'
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  // Helper to get status color as inline style
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return { background: '#d1fae5', color: '#065f46', border: '1px solid #bbf7d0' };
      case 'booked':
        return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
      case 'in_process':
        return { background: '#ffedd5', color: '#c2410c', border: '1px solid #fed7aa' };
      default:
        return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'in_process':
        return 'In Process';
      default:
        return 'Unknown';
    }
  };

  const getFeatureIcon = (feature) => {
    switch (feature.toLowerCase()) {
      case 'projector':
        return Monitor;
      case 'ac':
        return Wind;
      case 'sound system':
        return Volume2;
      case 'wifi':
        return Wifi;
      default:
        return CheckCircle;
    }
  };

  const handleReleaseRoom = async () => {
    try{
        const res = await axios.patch(`http://localhost:8000/room/update/${room.id}`, {'status': 'available'});
        alert(res.data.msg);
        fetchRooms();

    }catch(error){
        alert(error);
    }
  };

  const handleExtendBooking = async () => {
    if (extendTime && room.currentBooking) {
      try {
        
        const payload = {
          endTime: extendTime,
          status: 'booked' 
        };
        
        const res = await axios.patch(
          `http://localhost:8000/room/update/${room.id}`, 
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Response:', res.data); 
        
        
        setShowExtendModal(false);
        setExtendTime('');
        
        
        
        alert(`Booking extended until ${extendTime}!`);
        
      } catch (error) {
        console.error('Error extending booking:', error);
        
        
        if (error.response) {
          
          alert(`Error: ${error.response.data.message || error.response.data.msg || 'Failed to extend booking'}`);
        } else if (error.request) {
          
          alert('Network error: Unable to reach server');
        } else {
        
          alert(`Error: ${error.message}`);
        }
      }
    } else {
      alert('Please select an end time');
    }
  };

  const handleBookRoom = () => {
    bookRoom(room.id, {
      userName: user && user.name ? user.name : 'Admin User',
      userId: user && user.id ? user.id : 'admin-1',
      features: room.features,
      notes: bookingNotes
    });
    setShowBookModal(false);
    setBookingNotes('');
    alert(`${room.name} has been booked successfully!`);
  };

  const tabs = [
    { id: 'details', label: 'Room Details', icon: MapPin },
    { id: 'bookings', label: 'Booking History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Inline style helpers
  const styles = {
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 50
    },
    modal: {
      background: '#fff',
      borderRadius: 24,
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      maxWidth: 1120,
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 24,
      borderBottom: '1px solid #e5e7eb',
      background: 'linear-gradient(to right, #eff6ff, #ede9fe)'
    },
    tabNav: {
      display: 'flex',
      gap: 32,
      paddingLeft: 24,
      paddingRight: 24,
      borderBottom: '1px solid #e5e7eb'
    },
    tabBtn: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '16px 4px',
      borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
      fontWeight: 500,
      fontSize: 14,
      color: active ? '#2563eb' : '#6b7280',
      background: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s, border 0.2s'
    }),
    closeBtn: {
      padding: 8,
      color: '#6b7280',
      background: 'none',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      transition: 'color 0.2s, background 0.2s'
    },
    footer: {
      padding: '16px 24px',
      background: '#f9fafb',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    // ... add more as needed
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.modalOverlay}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 16, height: 16, borderRadius: 9999, background: room.status === 'available' ? '#22c55e' : room.status === 'booked' ? '#ef4444' : '#f59e42', animation: 'pulse 2s infinite' }}></div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{room.name}</h2>
                <p style={{ color: '#4b5563' }}>Administrative Room Management</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={onEdit}
                style={{ ...styles.closeBtn, color: '#6b7280' }}
                title="Edit Room"
              >
                <Edit3 style={{ width: 20, height: 20 }} />
              </button>
              <button
                onClick={onDelete}
                style={{ ...styles.closeBtn, color: '#ef4444' }}
                title="Delete Room"
              >
                <Trash2 style={{ width: 20, height: 20 }} />
              </button>
              <button
                onClick={onClose}
                style={styles.closeBtn}
              >
                <X style={{ width: 24, height: 24 }} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid #e5e7eb' }}>
            <nav style={styles.tabNav}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={styles.tabBtn(activeTab === tab.id)}
                  >
                    <Icon style={{ width: 16, height: 16 }} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 160px)' }}>
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div>
                {/* Image Carousel */}
                <div style={{ position: 'relative', height: 256, background: '#f3f4f6' }}>
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={roomImages[currentImageIndex]}
                    alt={`${room.name} view ${currentImageIndex + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Carousel Controls */}
                  <button
                    onClick={prevImage}
                    style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', borderRadius: 9999, padding: 8, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                  >
                    <ChevronLeft style={{ width: 20, height: 20, color: '#374151' }} />
                  </button>
                  <button
                    onClick={nextImage}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', borderRadius: 9999, padding: 8, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                  >
                    <ChevronRight style={{ width: 20, height: 20, color: '#374151' }} />
                  </button>
                  {/* Indicators */}
                  <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
                    {roomImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{ width: 8, height: 8, borderRadius: 9999, background: index === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                      />
                    ))}
                  </div>
                </div>
                {/* Room Details */}
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Basic Info Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
                    <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Users style={{ width: 20, height: 20, color: '#6b7280' }} />
                        <span style={{ fontWeight: 500, color: '#111827' }}>Capacity</span>
                      </div>
                      <p style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>{room.capacity} people</p>
                    </div>
                    <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <MapPin style={{ width: 20, height: 20, color: '#6b7280' }} />
                        <span style={{ fontWeight: 500, color: '#111827' }}>Location</span>
                      </div>
                      <p style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>Floor {room.floor}</p>
                    </div>
                    <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 9999, background: room.status === 'available' ? '#22c55e' : room.status === 'booked' ? '#ef4444' : '#f59e42' }}></div>
                        <span style={{ fontWeight: 500, color: '#111827' }}>Status</span>
                      </div>
                      <div style={{ ...getStatusColor(room.status), display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 9999, fontSize: 14, fontWeight: 500 }}>
                        {getStatusText(room.status)}
                      </div>
                    </div>
                  </div>
                  {/* Current Booking Info */}
                  {room.currentBooking && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16 }}>
                      <h4 style={{ fontWeight: 500, color: '#991b1b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User style={{ width: 16, height: 16 }} />
                        <span>Current Booking</span>
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, fontSize: 14 }}>
                        <div>
                          <span style={{ color: '#ef4444' }}>Booked by:</span>
                          <p style={{ fontWeight: 500, color: '#991b1b' }}>{room.currentBooking.bookedBy}</p>
                        </div>
                        <div>
                          <span style={{ color: '#ef4444' }}>Time:</span>
                          <p style={{ fontWeight: 500, color: '#991b1b' }}>{room.currentBooking.startTime} - {room.currentBooking.endTime}</p>
                        </div>
                      </div>
                      {/* Admin Actions for Current Booking */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                        <button
                          onClick={handleReleaseRoom}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#ef4444', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                        >
                          <XCircle style={{ width: 16, height: 16 }} />
                          <span>Release Booking</span>
                        </button>
                        <button
                          onClick={() => setShowExtendModal(true)}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                        >
                          <RotateCcw style={{ width: 16, height: 16 }} />
                          <span>Extend Booking</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Available Room Actions */}
                  {room.status === 'available' && (
                    <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
                      <h4 style={{ fontWeight: 500, color: '#065f46', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle style={{ width: 16, height: 16 }} />
                        <span>Room Available</span>
                      </h4>
                      <p style={{ fontSize: 14, color: '#047857', marginBottom: 16 }}>
                        This room is currently available for booking.
                      </p>
                      <button
                        onClick={() => setShowBookModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                      >
                        <Plus style={{ width: 16, height: 16 }} />
                        <span>Book Now</span>
                      </button>
                    </div>
                  )}
                  {/* Next Booking */}
                  {room.nextBooking && room.status === 'available' && (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 16 }}>
                      <h4 style={{ fontWeight: 500, color: '#1e40af', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar style={{ width: 16, height: 16 }} />
                        <span>Next Booking</span>
                      </h4>
                      <div style={{ fontSize: 14, color: '#2563eb' }}>
                        <p>{room.nextBooking.startTime} - {room.nextBooking.endTime}</p>
                      </div>
                    </div>
                  )}
                  {/* Features */}
                  <div>
                    <h4 style={{ fontWeight: 500, color: '#111827', marginBottom: 12 }}>Room Features & Amenities</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                      {room.features.map((feature) => {
                        const Icon = getFeatureIcon(feature);
                        return (
                          <div
                            key={feature}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, cursor: 'pointer' }}
                          >
                            <Icon style={{ width: 20, height: 20, color: '#6b7280' }} />
                            <span style={{ fontWeight: 500, color: '#374151' }}>{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>
                    Recent Booking History
                  </h3>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>
                    Last 30 days
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {bookingHistory.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff', transition: 'background 0.2s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <User style={{ width: 16, height: 16, color: '#6b7280' }} />
                            <span style={{ fontWeight: 500, color: '#111827' }}>{booking.bookedBy}</span>
                            <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 12, fontWeight: 500, background: booking.status === 'completed' ? '#d1fae5' : '#fee2e2', color: booking.status === 'completed' ? '#065f46' : '#991b1b' }}>
                              {booking.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: '#4b5563' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Calendar style={{ width: 12, height: 12 }} />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock style={{ width: 12, height: 12 }} />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Booking Statistics */}
                <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
                  <div style={{ background: '#eff6ff', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>24</div>
                    <div style={{ fontSize: 14, color: '#2563eb' }}>Total Bookings</div>
                  </div>
                  <div style={{ background: '#ecfdf5', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>22</div>
                    <div style={{ fontSize: 14, color: '#22c55e' }}>Completed</div>
                  </div>
                  <div style={{ background: '#fee2e2', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>2</div>
                    <div style={{ fontSize: 14, color: '#ef4444' }}>Cancelled</div>
                  </div>
                  <div style={{ background: '#ede9fe', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>92%</div>
                    <div style={{ fontSize: 14, color: '#7c3aed' }}>Success Rate</div>
                  </div>
                </div>
              </div>
            )}
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Room Configuration</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                            Room Name
                          </label>
                          <input
                            type="text"
                            value={room.name}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, outline: 'none' }}
                            readOnly
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                            Capacity
                          </label>
                          <input
                            type="number"
                            value={room.capacity}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, outline: 'none' }}
                            readOnly
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                            Floor
                          </label>
                          <input
                            type="number"
                            value={room.floor}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, outline: 'none' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                            Room Status
                          </label>
                          <select
                            value={room.status}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, outline: 'none' }}
                          >
                            <option value="available">Available</option>
                            <option value="booked">Booked</option>
                            <option value="in_process">In Process</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                            Booking Restrictions
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input type="checkbox" style={{ borderRadius: 4, border: '1px solid #d1d5db', accentColor: '#2563eb' }} />
                              <span style={{ fontSize: 14, color: '#374151' }}>Require approval</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input type="checkbox" style={{ borderRadius: 4, border: '1px solid #d1d5db', accentColor: '#2563eb' }} />
                              <span style={{ fontSize: 14, color: '#374151' }}>Admin only</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input type="checkbox" style={{ borderRadius: 4, border: '1px solid #d1d5db', accentColor: '#2563eb' }} />
                              <span style={{ fontSize: 14, color: '#374151' }}>Maintenance mode</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 500, color: '#111827', marginBottom: 16 }}>Danger Zone</h4>
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <h5 style={{ fontSize: 14, fontWeight: 500, color: '#991b1b' }}>Delete Room</h5>
                          <p style={{ fontSize: 14, color: '#ef4444' }}>Permanently remove this room from the system</p>
                        </div>
                        <button
                          onClick={onDelete}
                          style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
                        >
                          Delete Room
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Footer Actions */}
          <div style={styles.footer}>
            <div style={{ fontSize: 14, color: '#6b7280' }}>
              Last updated: {new Date().toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={onClose}
                style={{ padding: '8px 16px', color: '#374151', background: '#fff', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
              >
                Close
              </button>
              {activeTab === 'settings' && (
                <button style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </motion.div>
        {/* Extend Booking Modal */}
        <AnimatePresence>
          {showExtendModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 60 }}
              onClick={() => setShowExtendModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ background: '#fff', borderRadius: 16, boxShadow: '0 6px 24px rgba(0,0,0,0.12)', maxWidth: 480, width: '100%' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <RotateCcw style={{ width: 20, height: 20, color: '#22c55e' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Extend Booking</h3>
                  </div>
                  <p style={{ color: '#4b5563', marginBottom: 16 }}>
                    Current booking ends at {room.currentBooking && room.currentBooking.endTime}. Select new end time:
                  </p>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                      New End Time
                    </label>
                    <select
                      value={extendTime}
                      onChange={(e) => setExtendTime(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #22c55e', borderRadius: 8, fontSize: 16, outline: 'none' }}
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => setShowExtendModal(false)}
                      style={{ flex: 1, padding: '8px 16px', color: '#374151', background: '#f3f4f6', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExtendBooking}
                      disabled={!extendTime}
                      style={{ flex: 1, padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: !extendTime ? 'not-allowed' : 'pointer', fontSize: 14, opacity: !extendTime ? 0.5 : 1 }}
                    >
                      Extend
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Book Room Modal */}
        <AnimatePresence>
          {showBookModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 60 }}
              onClick={() => setShowBookModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ background: '#fff', borderRadius: 16, boxShadow: '0 6px 24px rgba(0,0,0,0.12)', maxWidth: 480, width: '100%' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <Plus style={{ width: 20, height: 20, color: '#22c55e' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Quick Book Room</h3>
                  </div>
                  <p style={{ color: '#4b5563', marginBottom: 16 }}>
                    Book {room.name} starting now for 1 hour.
                  </p>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                      Booking Notes (Optional)
                    </label>
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Purpose of the meeting..."
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #22c55e', borderRadius: 8, fontSize: 16, outline: 'none', resize: 'none', minHeight: 64 }}
                      rows={3}
                    />
                  </div>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 12, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#2563eb' }}>
                      <AlertCircle style={{ width: 16, height: 16 }} />
                      <span>This will book the room immediately for 1 hour</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => setShowBookModal(false)}
                      style={{ flex: 1, padding: '8px 16px', color: '#374151', background: '#f3f4f6', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBookRoom}
                      style={{ flex: 1, padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoomDetailsModal;