import React, { createContext, useContext, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import axios from'axios';

const DataContext = createContext();

// Helper function to parse booking date and time
const parseBookingDate = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const time = timeStr.length === 5 ? timeStr : timeStr.slice(0,5);
  const isoString = `${dateStr}T${time}`;
  const d = new Date(isoString);
  return isNaN(d.getTime()) ? null : d;
};

// Helper function to compute room status based on bookings and manual settings
const computeRoomStatus = (room, allBookings) => {
  // If room is manually set to unavailable, respect that status
  if (room.status === 'unavailable') {
    return 'unavailable';
  }

  const now = new Date();
  let status = 'available';
  
  // Check if there's an ongoing booking for this room
  for (const booking of allBookings) {
    if (booking.roomId === room.id || booking.room_name === room.name) {
      const start = parseBookingDate(booking.bookingStartDate || booking.date, booking.startTime);
      const end = parseBookingDate(booking.bookingEndDate || booking.date, booking.endTime);
      if (start && end && now >= start && now <= end && booking.status !== 'cancelled') {
        status = 'booked';
        break;
      }
    }
  }
  
  return status;
};

export const DataProvider = ({ children }) => {
  //Yha Hmare Rooms ka data aara hai
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try{
      const res= await axios.get(`http://localhost:8000/rooms`);
      setRooms(res.data);
      // Update analytics after fetching rooms
      setTimeout(() => {
        updateAnalytics();
      }, 100);
    }catch(error){
      alert(error);
    }
  }

  
  

  const [bookings,setBookings]=useState([]);

  const fetchBookings = async () => {
    try{
      const res= await axios.get(`http://localhost:8000/room/bookings/all`);
      setBookings(res.data);
      // Update analytics after fetching bookings
      setTimeout(() => {
        updateAnalytics();
      }, 100);
    }catch(error){
      alert(error);
    }
  }

  // Function to update analytics based on current data
  const updateAnalytics = () => {
    const totalRooms = rooms.length;
    
    // Use computed statuses for real-time analytics
    const bookedRooms = rooms.filter(room => computeRoomStatus(room, bookings) === 'booked').length;
    const availableRooms = rooms.filter(room => computeRoomStatus(room, bookings) === 'available').length;
    const unavailableRooms = rooms.filter(room => computeRoomStatus(room, bookings) === 'unavailable').length;
    
    const utilizationRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

    setAnalytics({
      totalRooms,
      bookedRooms,
      availableRooms,
      unavailableRooms,
      utilizationRate,
      totalBookings: bookings.length,
      activeConflicts: conflicts.filter(c => !c.resolved).length,
    });
  };

  // Function to update room statuses based on current bookings
  const updateRoomStatuses = () => {
    setRooms(prevRooms => 
      prevRooms.map(room => {
        const computedStatus = computeRoomStatus(room, bookings);
        // Only update if the computed status is different from current status
        // and the room is not manually set to unavailable
        if (computedStatus !== room.status && room.status !== 'unavailable') {
          return { ...room, status: computedStatus };
        }
        return room;
      })
    );
  };

  useEffect(()=>{
    fetchRooms();
    fetchBookings();
  },[]);

  // Initialize analytics when data is first loaded
  useEffect(() => {
    if (rooms.length > 0) {
      updateAnalytics();
    }
  }, [rooms.length]);

  // Update room statuses and analytics when bookings change
  useEffect(() => {
    if (rooms.length > 0 && bookings.length >= 0) {
      updateRoomStatuses();
      updateAnalytics();
    }
  }, [bookings, rooms.length]);

  const [conflicts, setConflicts] = useState([
    {
      id: 'conflict-1',
      roomId: 'room-2',
      roomName: 'Room 2',
      type: 'double_booking',
      description: 'Two bookings scheduled for the same time slot',
      bookings: ['booking-3', 'booking-4'],
      priority: 'high',
      resolved: false,
    },
  ]);

  // State to track current analytics
  const [analytics, setAnalytics] = useState({
    totalRooms: 0,
    bookedRooms: 0,
    availableRooms: 0,
    unavailableRooms: 0,
    utilizationRate: 0,
    totalBookings: 0,
    activeConflicts: 0,
  });

  const updateRoomStatus = (roomId, status) => {
    setRooms(prev =>
      prev.map(room => (room.id === roomId ? { ...room, status } : room))
    );
  };

  // Function to manually set room status (for staff actions)
  const setRoomStatus = async (roomId, status) => {
    try {
      // Update backend
      await axios.patch(`http://localhost:8000/room/update/${roomId}`, { status });
      
      // Update local state
      setRooms(prev =>
        prev.map(room => (room.id === roomId ? { ...room, status } : room))
      );
      
      // Update analytics immediately
      updateAnalytics();
      
      // If setting to available, recalculate status based on bookings
      if (status === 'available') {
        setTimeout(() => {
          updateRoomStatuses();
          updateAnalytics();
        }, 500);
      }
    } catch (error) {
      console.error('Failed to update room status:', error);
    }
  };

  //Add new Booking
  const addBooking = newBooking => {
    const booking = {
      ...newBooking,
      id: `booking-${Date.now()}`,
    };
    setBookings(prev => [...prev, booking]);

    if (newBooking.date === format(new Date(), 'yyyy-MM-dd')) {
      updateRoomStatus(newBooking.roomId, 'booked');
    }
    
    // Update analytics after adding booking
    setTimeout(() => {
      updateAnalytics();
    }, 100);
  };

  const cancelBooking = bookingId => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      )
    );
    
    // Update analytics after cancelling booking
    setTimeout(() => {
      updateAnalytics();
    }, 100);
  };

  const resolveConflict = conflictId => {
    setConflicts(prev =>
      prev.map(conflict =>
        conflict.id === conflictId ? { ...conflict, resolved: true } : conflict
      )
    );
  };

  const getAnalytics = () => {
    // Return the current analytics state (updated in real-time)
    return analytics;
  };

  // Function to get computed status for any room
  const getComputedRoomStatus = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 'unknown';
    return computeRoomStatus(room, bookings);
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        bookings,
        conflicts,
        analytics,
        fetchRooms,
        fetchBookings,
        updateRoomStatus,
        setRoomStatus,
        getComputedRoomStatus,
        updateRoomStatuses,
        updateAnalytics,
        addBooking,
        cancelBooking,
        resolveConflict,
        getAnalytics,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};





export const useData = () => {
  
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};