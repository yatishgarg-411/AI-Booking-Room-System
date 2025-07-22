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
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const res= await axios.get(`${API_URL}/rooms`);
      setRooms(res.data);
      // Removed setTimeout-based updateAnalytics
    }catch(error){
      alert(error);
    }
  }

  
  

  const [bookings,setBookings]=useState([]);

  const fetchBookings = async () => {
    try{
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const res= await axios.get(`${API_URL}/room/bookings/all`);
      setBookings(res.data);
      // Removed setTimeout-based updateAnalytics
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
    fetchActivities();
  },[]);

  // Use a single useEffect that watches both rooms and bookings
  useEffect(() => {
    if (rooms.length > 0 && bookings.length >= 0) {
      updateRoomStatuses();
      
    }
  }, [bookings]);

  useEffect(() => {
    if (rooms.length > 0 && bookings.length >= 0) {
      updateAnalytics();
    }
  }, [ bookings]);

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
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
      await axios.patch(`${API_URL}/room/update/${roomId}`, { status });
      
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

  const [recentActivity, setRecentActivity] = useState([]);

  // Function to add activity to recent activity list
  const addActivity = async (activity) => {
    const newActivity = {
      timestamp: new Date(),
      ...activity
    };
    
    console.log('Adding activity:', newActivity);
    
    try {
      // Send to backend
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const response = await axios.post(`${API_URL}/recentactivity/post`, newActivity);
      console.log('Activity saved to backend:', response.data);
      
      // Update local state
      const savedActivity = response.data.activity;
      setRecentActivity(prev => {
        const updated = [savedActivity, ...prev];
        // Keep only last 50 activities to prevent memory issues
        return updated.slice(0, 50);
      });
    } catch (error) {
      console.error('Failed to save activity to backend:', error);
      // Fallback: add to local state only
      const fallbackActivity = {
        id: `activity-${Date.now()}`,
        timestamp: new Date(),
        ...activity
      };
      console.log('Adding activity to local state:', fallbackActivity);
      setRecentActivity(prev => {
        const updated = [fallbackActivity, ...prev];
        return updated.slice(0, 50);
      });
    }
  };

  // Function to fetch activities from backend
  const fetchActivities = async () => {
    try {
      console.log('Fetching activities from backend...');
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const response = await axios.get(`${API_URL}/recentactivity/all`);
      console.log('Activities fetched:', response.data);
      setRecentActivity(response.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      // Set empty array if backend is not available
      setRecentActivity([]);
    }
  };

  // Sort rooms by room number for consistent ordering
  const sortedRooms = [...rooms].sort((a, b) => {
    // Extract room number from room name (e.g., "Room 1" -> 1, "Room 10" -> 10)
    const getRoomNumber = (roomName) => {
      const match = roomName.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };
    
    const roomNumberA = getRoomNumber(a.name);
    const roomNumberB = getRoomNumber(b.name);
    
    return roomNumberA - roomNumberB;
  });

  return (
    <DataContext.Provider
      value={{
        rooms: sortedRooms,
        bookings,
        conflicts,
        analytics,
        recentActivity,
        fetchRooms,
        fetchBookings,
        fetchActivities,
        updateRoomStatus,
        setRoomStatus,
        getComputedRoomStatus,
        updateRoomStatuses,
        updateAnalytics,
        addBooking,
        cancelBooking,
        resolveConflict,
        getAnalytics,
        addActivity,
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