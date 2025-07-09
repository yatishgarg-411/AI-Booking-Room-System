import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { X, ChevronLeft,  ChevronRight,  User, CheckCircle, XCircle, RotateCcw, History, Users,  Wifi,  Monitor,  Volume2,  Wind,  MapPin, Edit3, Settings, Trash2, Plus,
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';


// Helper to safely parse date and time into a JS Date object
function parseBookingDate(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  // Ensure timeStr is at least HH:mm
  const time = timeStr.length === 5 ? timeStr : timeStr.slice(0,5);
  const isoString = `${dateStr}T${time}`;
  const d = new Date(isoString);
  return isNaN(d.getTime()) ? null : d;
}

function displayDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
}

function displayTime(timeStr) {
  if (!timeStr) return '';
  // Only show HH:mm
  return timeStr.length >= 5 ? timeStr.slice(0,5) : timeStr;
}

const RoomDetailsModal = ({room,onClose,initialTab,userMode = false,onBookRoom}) => {
  console.log(initialTab);
  const { fetchRooms, fetchBookings, bookings, setRoomStatus, getComputedRoomStatus, addActivity } = useData();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(initialTab);//Initially Room Details Tab Appears by default
  const [showExtendModal, setShowExtendModal] = useState(false);//TO Toggle extend booking form
  const [bookingError,setBookingError]=useState('');
  const [showBookModal, setShowBookModal] = useState(false);//TO TOGGLE BOOK ROOM FORM
  const [extendTime, setExtendTime] = useState('');
  const [extendDate, setExtendDate] = useState('');
  const [extendError, setExtendError] = useState('');
  const [allRoomBookings, setAllRoomBookings] = useState([]);//All Bookings of the particular room are fetched here
  const [computedStatus, setComputedStatus] = useState('');
  const [statusColor, setStatusColor] = useState({ background: '#d1fae5', color: '#065f46', border: '1px solid #bbf7d0' });
  // Prefill booking form with user email if userMode
  const [bookingForm, setBookingForm] = useState({
    bookedBy: userMode ? (user?.email || '') : (user?.email || ''),
    bookingStartDate: '',
    bookingEndDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });
  
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [roomFeatures, setRoomFeatures] = useState(room.features || []);// form that will tell all room features on the spot
  const [newFeature, setNewFeature] = useState('');//new feature that we enter
  const [dynamicFeatures, setDynamicFeatures] = useState([]); // session-only features that we enter on the spot
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [unavailableLoading, setUnavailableLoading] = useState(false);// useState to show room is unavailable
  const [localStatus, setLocalStatus] = useState(room.status);
  const [roomStatus, setLocalRoomStatus] = useState(room.status);

  // Helper: get all bookings for this room
  useEffect(() => {
    const filtered = bookings.filter(b => b.roomId === room.id || b.room_name === room.name);
    setAllRoomBookings(filtered.sort((a, b) => {
      // Sort by start datetime descending (most recent first)
      const aStart = parseBookingDate(a.bookingStartDate || a.date, a.startTime);
      const bStart = parseBookingDate(b.bookingStartDate || b.date, b.startTime);
      return (bStart?.getTime() || 0) - (aStart?.getTime() || 0);
    }));
  }, [bookings, room]);

  const currentStatusRoom = () => {
    // Use the centralized status computation
    const status = getComputedRoomStatus(room.id);
    setComputedStatus(status);
    setStatusColor(getStatusColor(status));
  }
  // Helper: determine status from bookings
  useEffect(() => {
    currentStatusRoom();
  }, [allRoomBookings, room, fetchRooms]);

  // Split bookings into ongoing, upcoming and past 
  const now = new Date();
  let ongoing = null, upcoming = [], past = [];
  allRoomBookings.forEach(b => {
    const start = parseBookingDate(b.bookingStartDate || b.date, b.startTime);
    const end = parseBookingDate(b.bookingEndDate || b.date, b.endTime);
    if (!start || !end) return;
    if (b.status === 'cancelled') {
      if (end < now) past.push(b);
      else upcoming.push(b);
    } else if (now >= start && now <= end) {
      ongoing = b;
    } else if (start > now) {
      upcoming.push(b);
    } else {
      past.push(b);
    }
  });
  // Sort upcoming by start asc, past by end desc
  upcoming.sort((a, b) => {
    const aStart = parseBookingDate(a.bookingStartDate || a.date, a.startTime);
    const bStart = parseBookingDate(b.bookingStartDate || b.date, b.startTime);
    return (aStart?.getTime() || 0) - (bStart?.getTime() || 0);
  });
  past.sort((a, b) => {
    const aEnd = parseBookingDate(a.bookingEndDate || a.date, a.endTime);
    const bEnd = parseBookingDate(b.bookingEndDate || b.date, b.endTime);
    return (bEnd?.getTime() || 0) - (aEnd?.getTime() || 0);
  });

  // Find the next upcoming booking (soonest start)
  const nextUpcomingBooking = upcoming.length > 0
    ? upcoming.reduce((min, b) => {
        const start = parseBookingDate(b.bookingStartDate || b.date, b.startTime);
        return (!min || (start && start < min)) ? start : min;
      }, null)
    : null;

  // Dummy images for carousel
  const roomImages = [
    'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    console.log(status);
    switch (status) {
      case 'unavailable':
        return 'Unavailable';
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
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
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  
      await axios.patch(
        `http://localhost:8000/booking/update/${ongoing.bookingId}`,
        { 'endTime': currentTime, 'bookingEndDate': today }
      );

      // Log activity
      await addActivity({
        type: 'booking',
        action: 'released',
        roomName: room.name,
        roomId: room.id,
        user: user?.email || 'Admin',
        details: `Released ${room.name} early`,
        bookingDetails: {
          originalEndDate: ongoing.bookingEndDate || ongoing.date,
          originalEndTime: ongoing.endTime,
          newEndDate: today,
          newEndTime: currentTime
        }
      });

      fetchRooms();
      fetchBookings();
      alert('Room released successfully!');

    }catch(error){
      alert(error);
    }
  };


  const handleCancelBooking = async (id) =>{
    try{
      const res= await axios.delete(`http://localhost:8000/room/booking/delete/${id}`);
      alert(res.data.msg);
      
      // Find the booking details for activity logging
      const cancelledBooking = bookings.find(b => b.bookingId === id || b.id === id);
      
      // Log activity
      await addActivity({
        type: 'booking',
        action: 'cancelled',
        roomName: room.name,
        roomId: room.id,
        user: user?.email || 'Admin',
        details: `Cancelled booking for ${room.name}`,
        bookingDetails: cancelledBooking ? {
          startDate: cancelledBooking.bookingStartDate || cancelledBooking.date,
          endDate: cancelledBooking.bookingEndDate || cancelledBooking.date,
          startTime: cancelledBooking.startTime,
          endTime: cancelledBooking.endTime,
          purpose: cancelledBooking.purpose
        } : null
      });
      
      // Refresh data after cancellation
      fetchRooms();
      fetchBookings();
    }catch(error){
      alert(error);
    }
  }


  const handleExtendBooking = async () => {
    setExtendError('');
    if (!extendDate || !extendTime) {
      setExtendError('Please select both date and time');
      return;
    }
    // Compose new end datetime
    const newEnd = parseBookingDate(extendDate, extendTime);
    if (!newEnd) {
      setExtendError('Invalid date or time');
      return;
    }
    // Check for clash with next upcoming booking
    if (nextUpcomingBooking && newEnd >= nextUpcomingBooking) {
      setExtendError('Extension would overlap with the next booking!');
      return;
    }
    // PATCH request
    try {
      await axios.patch(
        `http://localhost:8000/booking/update/${ongoing.bookingId}`,
        { endTime: extendTime, bookingEndDate: extendDate }
      );
      setShowExtendModal(false);
      setExtendTime('');
      setExtendDate('');
      
      // Log activity
      await addActivity({
        type: 'booking',
        action: 'extended',
        roomName: room.name,
        roomId: room.id,
        user: user?.email || 'Admin',
        details: `Extended booking for ${room.name} until ${extendDate} ${extendTime}`,
        bookingDetails: {
          originalEndDate: ongoing.bookingEndDate || ongoing.date,
          originalEndTime: ongoing.endTime,
          newEndDate: extendDate,
          newEndTime: extendTime
        }
      });
      
      fetchRooms();
      fetchBookings();
      alert(`Booking extended until ${extendDate} ${extendTime}!`);
    } catch (error) {
      setExtendError('Failed to extend booking');
    }
  };

  const handleBookRoomSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    if (!bookingForm.bookedBy || !bookingForm.bookingStartDate || !bookingForm.bookingEndDate || !bookingForm.startTime || !bookingForm.endTime || !bookingForm.purpose) {
      setBookingError('All fields are required.');
      return;
    }
    try {
      const payload = {
        bookingId:'',
        roomId: room.id,
        room_name: room.name,
        bookedBy: bookingForm.bookedBy,
        bookingStartDate: bookingForm.bookingStartDate,
        bookingEndDate: bookingForm.bookingEndDate,
        startTime: bookingForm.startTime.length === 5 ? bookingForm.startTime + ':00' : bookingForm.startTime,
        endTime: bookingForm.endTime.length === 5 ? bookingForm.endTime + ':00' : bookingForm.endTime,
        purpose: bookingForm.purpose,
      };
      await axios.post('http://localhost:8000/room/booking', payload);
      setBookingSuccess('Room booked successfully!');
      setShowBookModal(false);
      setBookingForm({
        bookedBy: user?.email || '',
        bookingStartDate: '',
        bookingEndDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
      });
      
      // Log activity
      await addActivity({
        type: 'booking',
        action: 'created',
        roomName: room.name,
        roomId: room.id,
        user: user?.email || 'Admin',
        details: `Booked ${room.name} for ${bookingForm.purpose}`,
        bookingDetails: {
          startDate: bookingForm.bookingStartDate,
          endDate: bookingForm.bookingEndDate,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          purpose: bookingForm.purpose
        }
      });
      
      // Refresh both rooms and bookings data
      fetchRooms();
      fetchBookings();
    } catch (error) {
      let errMsg = error?.response?.data?.detail || error.message || 'Booking failed';
      if (Array.isArray(errMsg)) {
        errMsg = errMsg.map(e => (e.loc ? e.loc.join('.') + ': ' : '') + e.msg).join(' | ');
      }
      setBookingError(errMsg);
    }
  };

  // Features to display: always show backend features, plus session-added features (if checked)
  const featuresToDisplay = [
    ...room.features,
    ...dynamicFeatures
  ];

  // Only show tabs allowed for this mode
  const tabs = userMode
    ? [
        { id: 'details', label: 'Room Details', icon: MapPin },
        { id: 'bookings', label: 'Bookings', icon: History }
      ]
    : [
        { id: 'details', label: 'Room Details', icon: MapPin },
        { id: 'bookings', label: 'Booking History', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings }
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

  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveSuccess('');
    try {
      await axios.patch(`http://localhost:8000/room/update/${room.id}`, {
        status: localStatus,
        features: roomFeatures
      });
      room.features = [...roomFeatures];
      setDynamicFeatures([]);
      setSaveSuccess('Room settings updated successfully!');
      
      // Log activity
      await addActivity({
        type: 'room_settings',
        action: 'updated',
        roomName: room.name,
        roomId: room.id,
        user: user?.email || 'Admin',
        details: `Updated settings for ${room.name}`,
        changes: {
          previousFeatures: room.features,
          newFeatures: roomFeatures,
          previousStatus: room.status,
          newStatus: localStatus
        }
      });
      
      fetchRooms();
      fetchBookings();
    } catch (error) {
      setSaveSuccess('Failed to update room settings.');
    }
    setSaving(false);
  };

  // Handler for Room Not Available button
  const handleSetUnavailable = async () => {
    setUnavailableLoading(true);
    setLocalStatus('unavailable');
    setSaveSuccess('');
    try {
      await setRoomStatus(room.id, 'unavailable');
      setLocalRoomStatus('unavailable');
      setSaveSuccess('Room marked as unavailable!');
      
      // Log activity
      await addActivity({
        type: 'room_status_change',
        action: 'marked_unavailable',
        roomName: room.name,
        roomId: room.id,
        user: user?.email || 'Admin',
        details: `Marked ${room.name} as unavailable`,
        changes: {
          previousStatus: computedStatus,
          newStatus: 'unavailable'
        }
      });
      
      fetchRooms();
      fetchBookings();
    } catch (error) {
      setSaveSuccess('Failed to mark room as unavailable.');
    }
    setUnavailableLoading(false);
  };

  // Handler for Make Room Available button
  const handleSetAvailable = async () => {
    setUnavailableLoading(true);
    setLocalStatus('available');
    setSaveSuccess('');
    try {
      await setRoomStatus(room.id, 'available');
      setLocalRoomStatus(computedStatus);
      setSaveSuccess('Room marked as available!');
      
      // Log activity
      await addActivity({
        type: 'room_status_change',
        action: 'marked_available',
        roomName: room.name,
        roomId: room.id,
        user: user?.email || 'Admin',
        details: `Marked ${room.name} as available`,
        changes: {
          previousStatus: 'unavailable',
          newStatus: computedStatus
        }
      });
      
      fetchRooms();
      fetchBookings();
    } catch (error) {
      setSaveSuccess('Failed to mark room as available.');
    }
    setUnavailableLoading(false);
  };

  // In useEffect, keep roomStatus in sync if room.status changes from parent
  useEffect(() => {
    setLocalRoomStatus(room.status);
  }, [room.status]);

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


          {/* Header Of Container */ }
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 16, height: 16, borderRadius: 9999, ...statusColor, animation: 'pulse 2s infinite' }}></div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{room.name}</h2>
                <p style={{ color: '#4b5563' }}>Administrative Room Management</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={()=>setActiveTab('settings')}
                style={{ ...styles.closeBtn, color: '#6b7280' }}
                title="Edit Room"
              >
                <Edit3 style={{ width: 20, height: 20 }} />
              </button>
                              <button
                  onClick={() => setActiveTab('settings')}
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




          {/* 3 Tabs  */}
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
            {/* Room Details Tab */}
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

                    {/* {CAPACITY} */}
                    <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Users style={{ width: 20, height: 20, color: '#6b7280' }} />
                        <span style={{ fontWeight: 500, color: '#111827' }}>Capacity</span>
                      </div>
                      <p style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>{room.capacity} people</p>
                    </div>


                    {/* {LOCATION} */}
                    <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <MapPin style={{ width: 20, height: 20, color: '#6b7280' }} />
                        <span style={{ fontWeight: 500, color: '#111827' }}>Location</span>
                      </div>
                      <p style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>Floor {room.floor}</p>
                    </div>

                    {/* {STATUS} */}
                    <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 9999, ...statusColor }}></div>
                        <span style={{ fontWeight: 500, color: '#111827' }}>Status</span>
                      </div>
                      <div style={{ ...statusColor, display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 9999, fontSize: 14, fontWeight: 500 }}>
                        {getStatusText(computedStatus)}
                      </div>
                    </div>



                  </div>


                  {/* Book Room Button (always show unless unavailable) */}
                  {roomStatus !== 'unavailable' ? (
                    
                    <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16 }}>
                      <h4 style={{ fontWeight: 500, color: '#065f46', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle style={{ width: 16, height: 16 }} />
                        <span>Book this Room</span>
                      </h4>
                      <button
                        onClick={() => setShowBookModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                      >
                        <Plus style={{ width: 16, height: 16 }} />
                        <span>Book Now</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, color: '#991b1b', fontWeight: 500 }}>
                      <button
                        disabled
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fca5a5', color: '#fff', borderRadius: 8, border: 'none', cursor: 'not-allowed', fontSize: 14, opacity: 0.7 }}
                      >
                        <Plus style={{ width: 16, height: 16 }} />
                        <span>Book Now</span>
                      </button>
                      <div style={{ marginTop: 8 }}>This room is currently unavailable for new bookings.</div>
                    </div>
                  )}




                  {/* Features */}
                  <div>
                    <h4 style={{ fontWeight: 500, color: '#111827', marginBottom: 12 }}>Room Features & Amenities</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                      {featuresToDisplay.map((feature) => {
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
                {userMode ? (
                  <>
                    {ongoing && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <h4 style={{ fontWeight: 500, color: '#991b1b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <User style={{ width: 16, height: 16 }} />
                          <span>Ongoing Booking</span>
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                          <div><b>Date:</b> {displayDate(ongoing.bookingStartDate || ongoing.date)} - {displayDate(ongoing.bookingEndDate || ongoing.date)}</div>
                          <div><b>Time:</b> {displayTime(ongoing.startTime)} - {displayTime(ongoing.endTime)}</div>
                        </div>
                      </div>
                    )}
                    {upcoming.length > 0 ? (
                      <div>
                        <h4 style={{ fontWeight: 500, color: '#2563eb', marginBottom: 8 }}>Upcoming Bookings</h4>
                        {upcoming.map((booking) => (
                          <div key={booking.id} style={{ border: '1px solid #bfdbfe', borderRadius: 8, padding: 12, background: '#eff6ff', marginBottom: 8 }}>
                            <div><b>Date:</b> {displayDate(booking.bookingStartDate || booking.date)} - {displayDate(booking.bookingEndDate || booking.date)}</div>
                            <div><b>Time:</b> {displayTime(booking.startTime)} - {displayTime(booking.endTime)}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#6b7280', fontSize: 13 }}>No upcoming bookings</div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Ongoing Booking */}
                    {ongoing && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <h4 style={{ fontWeight: 500, color: '#991b1b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <User style={{ width: 16, height: 16 }} />
                          <span>Ongoing Booking</span>
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                          <div><b>Booked by:</b> {ongoing.bookedBy}</div>
                          <div><b>Start Date:</b> {displayDate(ongoing.bookingStartDate || ongoing.date)}</div>
                          <div><b>End Date:</b> {displayDate(ongoing.bookingEndDate || ongoing.date)}</div>
                          <div><b>Time:</b> {displayTime(ongoing.startTime)} - {displayTime(ongoing.endTime)}</div>
                          <div><b>Purpose:</b> {ongoing.purpose}</div>
                        </div>
                        {/* Admin actions ... */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button
                            onClick={handleReleaseRoom}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#ef4444', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                          >
                            <XCircle style={{ width: 16, height: 16 }} />
                            <span>Release</span>
                          </button>
                          <button
                            onClick={() => setShowExtendModal(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                          >
                            <RotateCcw style={{ width: 16, height: 16 }} />
                            <span>Extend</span>
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Upcoming Bookings */}
                    {upcoming.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontWeight: 500, color: '#2563eb', marginBottom: 8 }}>Upcoming Bookings</h4>
                        {upcoming.map((booking) => (
                          <div key={booking.id} style={{ border: '1px solid #bfdbfe', borderRadius: 8, padding: 12, background: '#eff6ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div><b>Booked by:</b> {booking.bookedBy}</div>
                              <div><b>Start Date:</b> {displayDate(booking.bookingStartDate || booking.date)}</div>
                              <div><b>End Date:</b> {displayDate(booking.bookingEndDate || booking.date)}</div>
                              <div><b>Time:</b> {displayTime(booking.startTime)} - {displayTime(booking.endTime)}</div>
                              <div><b>Purpose:</b> {booking.purpose}</div>
                            </div>
                            <button
                              style={{ padding: '6px 14px', background: '#ef4444', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13 }} onClick={()=>handleCancelBooking(booking.bookingId)}
                            >
                              Cancel
                            </button>
                          </div>
                        ))}
                      </div>
                    )}


                    {/* Past Bookings (scrollable) */}
                    <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, background: '#f9fafb' }}>
                      <h4 style={{ fontWeight: 500, color: '#374151', marginBottom: 8 }}>Past Bookings</h4>
                      {past.length === 0 && <div style={{ color: '#6b7280', fontSize: 13 }}>No past bookings</div>}
                      {past.map((booking) => (
                        <div key={booking.id} style={{ borderBottom: '1px solid #e5e7eb', padding: 8 }}>
                          <div><b>Booked by:</b> {booking.bookedBy}</div>
                          <div><b>Start Date:</b> {displayDate(booking.bookingStartDate || booking.date)}</div>
                          <div><b>End Date:</b> {displayDate(booking.bookingEndDate || booking.date)}</div>
                          <div><b>Time:</b> {displayTime(booking.startTime)} - {displayTime(booking.endTime)}</div>
                          <div><b>Purpose:</b> {booking.purpose}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
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
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                            Room Features
                          </label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                            {featuresToDisplay.map((feature) => (
                              <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                  type="checkbox"
                                  checked={roomFeatures.includes(feature)}
                                  disabled={room.features.includes(feature) && !roomFeatures.includes(feature)}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setRoomFeatures(prev => [...prev, feature]);
                                      if (!room.features.includes(feature) && !dynamicFeatures.includes(feature)) {
                                        setDynamicFeatures(prev => [...prev, feature]);
                                      }
                                    } else {
                                      setRoomFeatures(prev => prev.filter(f => f !== feature));
                                      if (!room.features.includes(feature)) {
                                        setDynamicFeatures(prev => prev.filter(f => f !== feature));
                                      }
                                    }
                                  }}
                                  style={{ borderRadius: 4, border: '1px solid #d1d5db', accentColor: '#2563eb' }}
                                />
                                <span style={{ fontSize: 14, color: '#374151' }}>{feature}</span>
                              </label>
                            ))}
                          </div>
                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              if (
                                newFeature &&
                                !featuresToDisplay.includes(newFeature)
                              ) {
                                setDynamicFeatures(prev => [...prev, newFeature]);
                                setRoomFeatures(prev => [...prev, newFeature]);
                                setNewFeature('');
                              }
                            }}
                            style={{ display: 'flex', gap: 8 }}
                          >
                            <input
                              type="text"
                              value={newFeature}
                              onChange={e => setNewFeature(e.target.value)}
                              placeholder="Add custom feature"
                              style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                            />
                            <button type="submit" style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14 }}>
                              Add
                            </button>
                          </form>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                            Room Status
                          </label>
                          <select
                            value={roomStatus}
                            onChange={e => setLocalRoomStatus(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 16, outline: 'none' }}
                          >
                            <option value="available">Available</option>
                            <option value="booked">Booked</option>
                            <option value="in_process">In Process</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                        </div>
                       
                      </div>
                    </div>
                  </div>


                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 500, color: '#111827', marginBottom: 16 }}>Danger Zone</h4>
                    <div style={{
                      background: roomStatus === 'unavailable' ? '#dcfce7' : '#fef2f2',
                      border: roomStatus === 'unavailable' ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      borderRadius: 12,
                      padding: 16
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          {roomStatus === 'unavailable' ? (
                            <p style={{ fontSize: 14, color: '#22c55e' }}>This room is currently unavailable. Make it available to allow new bookings.</p>
                          ) : (
                            <p style={{ fontSize: 14, color: '#ef4444' }}>Make this room temporarily unavailable at this moment</p>
                          )}
                        </div>


                        {roomStatus === 'unavailable' ? (
                          <button
                            onClick={handleSetAvailable}
                            disabled={unavailableLoading}
                            style={{ padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: unavailableLoading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 500 }}
                          >
                            {unavailableLoading ? 'Marking...' : 'Make Room Available'}
                          </button>
                        ) : (
                          <button
                            onClick={handleSetUnavailable}
                            disabled={unavailableLoading}
                            style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', borderRadius: 8, border: 'none', cursor: unavailableLoading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 500 }}
                          >
                            {unavailableLoading ? 'Marking...' : 'Room Not Available'}
                          </button>
                        )}
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
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14 }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
            {saveSuccess && <div style={{ color: saveSuccess.includes('successfully') ? 'green' : 'red', fontSize: 13, marginLeft: 16 }}>{saveSuccess}</div>}
          </div>
        </motion.div>



        {/* Extend Booking Modal */}
        <AnimatePresence>
          {showExtendModal && ongoing && (
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
                    Current booking ends at {displayDate(ongoing.bookingEndDate || ongoing.date)} {displayTime(ongoing.endTime)}. Select new end date and time:
                  </p>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                      New End Date
                    </label>
                    <input
                      type="date"
                      value={extendDate}
                      min={ongoing.bookingEndDate || ongoing.date}
                      max={nextUpcomingBooking ? nextUpcomingBooking.toISOString().slice(0,10) : undefined}
                      onChange={e => setExtendDate(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #22c55e', borderRadius: 8, fontSize: 16, outline: 'none' }}
                    />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                      New End Time
                    </label>
                    <input
                      type="time"
                      value={extendTime}
                      onChange={e => setExtendTime(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #22c55e', borderRadius: 8, fontSize: 16, outline: 'none' }}
                    />
                  </div>
                  {extendError && <div style={{ color: 'red', marginBottom: 12 }}>{extendError}</div>}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => setShowExtendModal(false)}
                      style={{ flex: 1, padding: '8px 16px', color: '#374151', background: '#f3f4f6', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExtendBooking}
                      disabled={!extendDate || !extendTime}
                      style={{ flex: 1, padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: (!extendDate || !extendTime) ? 'not-allowed' : 'pointer', fontSize: 14, opacity: (!extendDate || !extendTime) ? 0.5 : 1 }}
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
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Add Room Booking</h3>
                  </div>
                  <form onSubmit={handleBookRoomSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <label>
                        Room Name:
                        <input type="text" value={room.name} readOnly style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
                      </label>
                      <label>
                        Booked By (Email):
                        <input type="email" value={bookingForm.bookedBy} onChange={e => setBookingForm(f => ({ ...f, bookedBy: e.target.value }))} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
                      </label>
                      <label>
                        Booking Start Date:
                        <input type="date" value={bookingForm.bookingStartDate} onChange={e => setBookingForm(f => ({ ...f, bookingStartDate: e.target.value }))} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
                      </label>
                      <label>
                        Booking End Date:
                        <input type="date" value={bookingForm.bookingEndDate} onChange={e => setBookingForm(f => ({ ...f, bookingEndDate: e.target.value }))} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
                      </label>
                      <label>
                        Start Time:
                        <input type="time" value={bookingForm.startTime} onChange={e => setBookingForm(f => ({ ...f, startTime: e.target.value }))} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
                      </label>
                      <label>
                        End Time:
                        <input type="time" value={bookingForm.endTime} onChange={e => setBookingForm(f => ({ ...f, endTime: e.target.value }))} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
                      </label>
                      <label>
                        Purpose:
                        <input type="text" value={bookingForm.purpose} onChange={e => setBookingForm(f => ({ ...f, purpose: e.target.value }))} required style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 8, marginTop: 4 }} />
                      </label>
                      {bookingError && <div style={{ color: 'red', fontSize: 13 }}>{bookingError}</div>}
                      {bookingSuccess && <div style={{ color: 'green', fontSize: 13 }}>{bookingSuccess}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                      <button type="button" onClick={() => setShowBookModal(false)} style={{ flex: 1, padding: '8px 16px', color: '#374151', background: '#f3f4f6', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                        Cancel
                      </button>
                      <button type="submit" style={{ flex: 1, padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                        Book Room
                      </button>
                    </div>
                  </form>
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