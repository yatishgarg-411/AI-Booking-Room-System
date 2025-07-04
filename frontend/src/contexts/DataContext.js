import React, { createContext, useContext, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import axios from'axios';

const DataContext = createContext();



export const DataProvider = ({ children }) => {
  //Yha Hmare Rooms ka data aara hai
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try{
      const res= await axios.get(`http://localhost:8000/rooms`);
      setRooms(res.data);
    }catch(error){
      alert(error);
    }
  }

  
  

  const [bookings,setBookings]=useState([]);

  const fetchBookings = async () => {
    try{
      const res= await axios.get(`http://localhost:8000/room/bookings/all`);
      setBookings(res.data);
    }catch(error){
      alert(error);
    }
  }

  useEffect(()=>{
    fetchRooms();
    fetchBookings();
  },[bookings]);

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

  const updateRoomStatus = (roomId, status) => {
    setRooms(prev =>
      prev.map(room => (room.id === roomId ? { ...room, status } : room))
    );
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
  };

  const cancelBooking = bookingId => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      )
    );
  };

  const resolveConflict = conflictId => {
    setConflicts(prev =>
      prev.map(conflict =>
        conflict.id === conflictId ? { ...conflict, resolved: true } : conflict
      )
    );
  };

  const getAnalytics = () => {
    const totalRooms = rooms.length;
    const bookedRooms = rooms.filter(room => room.status === 'booked').length;
    const availableRooms = rooms.filter(room => room.status === 'available').length;
    const utilizationRate = Math.round((bookedRooms / totalRooms) * 100);

    return {
      totalRooms,
      bookedRooms,
      availableRooms,
      utilizationRate,
      totalBookings: bookings.length,
      activeConflicts: conflicts.filter(c => !c.resolved).length,
    };
  };

  return (
    <DataContext.Provider
      value={{
        rooms,
        bookings,
        conflicts,
        updateRoomStatus,
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