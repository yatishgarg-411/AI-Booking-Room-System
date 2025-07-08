// MyBookingsPage.jsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCalendarDay, FaCalendarPlus, FaCalendarCheck, FaCalendarTimes, FaRegSmileBeam, FaRegSadTear } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const gradient = 'linear-gradient(120deg, #a5b4fc 0%, #f3e8ff 100%)';

const Hero = styled.div`
  background: ${gradient};
  border-radius: 1.5rem;
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.10);
  position: relative;
  overflow: hidden;
  flex-wrap: wrap;
`;
const HeroText = styled.div`
  flex: 1;
`;
const HeroTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: #3730a3;
  margin-bottom: 0.5rem;
`;
const HeroSub = styled.div`
  color: #6366f1;
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
`;
const HeroStat = styled.div`
  font-size: 1.1rem;
  color: #4f46e5;
  margin-top: 0.7rem;
`;
const HeroIcon = styled.div`
  font-size: 3.5rem;
  color: #6366f1;
  opacity: 0.18;
  position: absolute;
  right: 2.5rem;
  top: 1.5rem;
`;

const TabsBar = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-bottom: 2.2rem;
  border-bottom: 2px solid #e0e7ff;
  position: relative;
`;
const Tab = styled.button`
  background: none;
  border: none;
  font-size: 1.15rem;
  font-weight: 600;
  color: ${props => (props.active ? '#4f46e5' : '#64748b')};
  padding: 0.7rem 0;
  cursor: pointer;
  position: relative;
  outline: none;
  transition: color 0.2s;
`;
const TabHighlight = styled.div`
  position: absolute;
  bottom: -2px;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  height: 3px;
  background: linear-gradient(90deg, #6366f1 60%, #a5b4fc 100%);
  border-radius: 2px;
  transition: left 0.3s, width 0.3s;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;
const GlassCard = styled.div`
  background: rgba(255,255,255,0.85);
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  backdrop-filter: blur(4px);
  padding: 1.5rem 1.5rem 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  min-height: 220px;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 8px 32px rgba(99,102,241,0.18);
  }
`;
const RoomImg = styled.img`
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
  background: #e0e7ff;
`;
const CardTitle = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.2rem;
`;
const CardMeta = styled.div`
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0.2rem;
`;
const CardPurpose = styled.div`
  color: #4f46e5;
  font-size: 1rem;
  font-style: italic;
  margin-bottom: 0.5rem;
`;
const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 600;
  background: ${props => props.bg || '#e0e7ff'};
  color: ${props => props.color || '#4f46e5'};
  margin-bottom: 0.2rem;
`;
const CancelBtn = styled.button`
  background: linear-gradient(90deg, #ef4444 60%, #fca5a5 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.7rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(239,68,68,0.08);
  transition: background 0.2s;
  &:hover { background: linear-gradient(90deg, #b91c1c 60%, #fca5a5 100%); }
`;
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 0;
  color: #64748b;
  font-size: 1.2rem;
`;
const EmptyIcon = styled.div`
  font-size: 3.5rem;
  color: #e0e7ff;
  margin-bottom: 1.2rem;
`;

// Helper to log recent activity
async function logRecentActivity(activity) {
  try {
    await axios.post('http://localhost:8000/recentactivity/post', activity);
  } catch (err) {
    // Optionally handle/log error
    console.error('Failed to log activity:', err);
  }
}

const STATUS_TABS = [
  { key: 'Ongoing', label: 'Ongoing', icon: <FaCalendarDay /> },
  { key: 'Upcoming', label: 'Upcoming', icon: <FaCalendarPlus /> },
  { key: 'Previous', label: 'Previous', icon: <FaCalendarCheck /> },
];
const statusColors = {
  Ongoing: { bg: '#e0e7ff', color: '#4f46e5' },
  Upcoming: { bg: '#dcfce7', color: '#22c55e' },
  Previous: { bg: '#f3f4f6', color: '#64748b' },
};

const MyBookingsPage = () => {
  const { name, email } = useAuth();
  const { bookings, fetchBookings } = useData();
  const [activeTab, setActiveTab] = useState('Ongoing');
  const [tabDims, setTabDims] = useState({ left: 0, width: 0 });
  const tabRefs = [];

  // Enrich bookings
  const userBookings = bookings.filter(b => b.bookedBy === email);
  const getStatus = (startDate, endDate, startTime, endTime, cancelled) => {
    const now = new Date();
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Ongoing';
    if (now > end) return 'Previous';
  };
  const enriched = userBookings.map(b => ({
    ...b,
    status: getStatus(b.bookingStartDate, b.bookingEndDate, b.startTime, b.endTime, b.status === 'cancelled')
  }));
  const grouped = {
    Ongoing: enriched.filter(b => b.status === 'Ongoing'),
    Upcoming: enriched.filter(b => b.status === 'Upcoming'),
    Previous: enriched.filter(b => b.status === 'Previous'),
  };

  // Stats for hero
  const total = enriched.length;
  const ongoing = grouped.Ongoing.length;
  const upcoming = grouped.Upcoming.length;

  // Tab highlight animation
  React.useEffect(() => {
    const idx = STATUS_TABS.findIndex(t => t.key === activeTab);
    if (tabRefs[idx]) {
      const rect = tabRefs[idx].getBoundingClientRect();
      const parentRect = tabRefs[0].parentNode.getBoundingClientRect();
      setTabDims({ left: rect.left - parentRect.left, width: rect.width });
    }
  }, [activeTab, bookings]);

  // Cancel handler
  const HandleCancel = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/room/booking/delete/${id}`);
      alert(res.data.msg);
      const cancelledBooking = bookings.find(b => b.bookingId === id);
      if (cancelledBooking) {
        await logRecentActivity({
          type: 'booking',
          action: 'cancelled',
          roomName: cancelledBooking.room_name,
          roomId: cancelledBooking.roomId,
          user: cancelledBooking.bookedBy,
          details: `Cancelled booking from ${cancelledBooking.bookingStartDate} ${cancelledBooking.startTime} to ${cancelledBooking.bookingEndDate} ${cancelledBooking.endTime}`,
          bookingDetails: cancelledBooking,
          changes: null,
          timestamp: new Date().toISOString(),
        });
      }
      fetchBookings();
    } catch (error) {
      alert('Error cancelling Booking');
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1rem 2rem 1rem' }}>
      <Hero>
        <HeroText>
          <HeroTitle>{name ? ` ${name}` : ''}!!</HeroTitle>
          <HeroSub>Your room bookings at a glance. Manage, view, or cancel with ease.</HeroSub>
        </HeroText>
        <HeroIcon><FaRegSmileBeam /></HeroIcon>
      </Hero>
      <TabsBar>
        {STATUS_TABS.map((tab, idx) => (
          <Tab
            key={tab.key}
            ref={el => tabRefs[idx] = el}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} &nbsp; {tab.label}
          </Tab>
        ))}
        <TabHighlight left={tabDims.left} width={tabDims.width} />
      </TabsBar>
      {grouped[activeTab].length === 0 ? (
        <EmptyState>
          <EmptyIcon>{activeTab === 'Cancelled' ? <FaCalendarTimes /> : <FaRegSadTear />}</EmptyIcon>
          No {activeTab.toLowerCase()} bookings.
        </EmptyState>
      ) : (
        <CardsGrid>
          {grouped[activeTab].map(b => (
            <GlassCard key={b.bookingId}>
              <CardTitle>🏷️ {b.room_name}</CardTitle>
              <CardMeta>📅 <b>Check-in Date:</b> {b.bookingStartDate}</CardMeta>
              <CardMeta>📆 <b>Check-out Date:</b> {b.bookingEndDate}</CardMeta>
              <CardMeta>⏰ <b>Check-in Time:</b> {b.startTime}</CardMeta>
              <CardMeta>🕔 <b>Check-out Time:</b> {b.endTime}</CardMeta>
              <CardPurpose>📝 <b>Purpose:</b> {b.purpose}</CardPurpose>
              {activeTab === 'Upcoming' && (
                <CancelBtn onClick={() => HandleCancel(b.bookingId)}>Cancel</CancelBtn>
              )}
            </GlassCard>
          ))}
        </CardsGrid>
      )}
    </div>
  );
};

export default MyBookingsPage;
