import React, { useState } from 'react';
import { Calendar, Search, Users, MapPin, Filter, Star, Wifi, Monitor, Coffee } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { FaFilter, FaUsers, FaLayerGroup, FaThList } from 'react-icons/fa';
import { useData } from '../../contexts/DataContext'
import {useAuth} from '../../contexts/AuthContext';
import { useEffect } from 'react';

// Animations
const hoverFloat = keyframes`
  0% { transform: translateY(0px); }
  100% { transform: translateY(-4px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f3e8ff 100%);
`;

const Header = styled.div`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 32rem;
  margin: 0 auto;
`;

const MainContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 3fr;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  position: sticky;
  top: 1.5rem;
  height: fit-content;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SidebarTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-left: 0.75rem;
`;

const FilterSidebar = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 6px 32px rgba(79,70,229,0.10);
  padding: 2.2rem 2rem 2rem 2rem;
  margin-bottom: 2rem;
  min-width: 320px;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: #4f46e5;
  margin-bottom: 0.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const FilterInput = styled.input`
  padding: 0.5rem 0.8rem;
  border-radius: 0.7rem;
  border: 1.5px solid #d1d5db;
  font-size: 1rem;
  background: #f3f4f6;
`;

const FilterSelectStyled = styled.select`
  padding: 0.5rem 0.8rem;
  border-radius: 0.7rem;
  border: 1.5px solid #d1d5db;
  font-size: 1rem;
  background: #f3f4f6;
  min-width: 120px;
  margin-top: 0.5rem;
`;

const FeatureTag = styled.label`
  background: ${props => props.selected ? '#6366f1' : '#f3f4f6'};
  color: ${props => props.selected ? '#fff' : '#4f46e5'};
  border-radius: 0.7rem;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  margin: 0.2rem 0.5rem 0.2rem 0;
  border: 2px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &:hover {
    background: #4f46e5;
    color: #fff;
    border: 2px solid #6366f1;
  }
`;

const FilterStats = styled.div`
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: between;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
`;

const FilterStatsLabel = styled.span`
  color: #6b7280;
`;

const FilterStatsValue = styled.span`
  font-weight: 600;
  color: #2563eb;
`;

const ContentArea = styled.div``;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ContentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const DateBadge = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const DateText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374751;
  margin-left: 0.5rem;
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RoomCardContainer = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${fadeIn} 0.5s ease-out;

  &:hover {
    animation: ${hoverFloat} 0.3s ease forwards;
    box-shadow: 0 25px 50px rgba(59, 130, 246, 0.15);
    border-color: ${props => props.isHovered ? '#3b82f6' : '#e5e7eb'};
    ring: ${props => props.isHovered ? '2px solid rgba(59, 130, 246, 0.5)' : 'none'};
  }
`;

const RoomImageWrapper = styled.div`
  position: relative;
`;

const RoomImage = styled.img`
  width: 100%;
  max-width: 260px;
  height: 140px;
  object-fit: cover;
  border-radius: 1rem 1rem 0 0;
  margin-bottom: 1rem;
  background: #e0e7ff;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.status === 'available' ? '#d1fae5' : '#fecaca'};
  color: ${props => props.status === 'available' ? '#065f46' : '#991b1b'};
`;

const FloorInfo = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FloorText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const RoomContent = styled.div`
  padding: 1.5rem;
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RoomInfo = styled.div``;

const RoomName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const CapacityInfo = styled.div`
  display: flex;
  align-items: center;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const CapacityText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
`;

const FeatureIcon = styled.span`
  color: #6b7280;
  margin-right: 0.5rem;
`;

const FeatureText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374751;
`;

const BookButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  ${props => props.available ? `
    background: linear-gradient(to right, #2563eb, #7c3aed);
    color: white;
    
    &:hover {
      background: linear-gradient(to right, #1d4ed8, #6d28d9);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
      transform: scale(1.02);
    }
  ` : `
    background: #f3f4f6;
    color: #9ca3af;
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const EmptyIcon = styled.div`
  color: #9ca3af;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #6b7280;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  min-width: 350px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  
  ${props => props.primary ? `
    background: linear-gradient(to right, #2563eb, #7c3aed);
    color: white;
    
    &:hover {
      background: linear-gradient(to right, #1d4ed8, #6d28d9);
    }
  ` : `
    border: 1px solid #d1d5db;
    color: #374751;
    background: white;
    
    &:hover {
      background: #f9fafb;
    }
  `}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.3rem;
`;

const Input = styled.input`
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  &:hover { background: #3730a3; }
`;

const BookingPage = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [featuresFilter, setFeaturesFilter] = useState([]);

  // Use actual rooms data from context
  const { rooms } = useData();
  const dummyUser = { name: 'John Doe', email: 'john@example.com' };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name && room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = !capacityFilter || room.capacity >= parseInt(capacityFilter);
    const matchesFeatures = featuresFilter.length === 0 || (room.features && room.features.some(feature => featuresFilter.includes(feature)));
    return matchesSearch && matchesCapacity && matchesFeatures;
  });

  const allFeatures = ['Projector', 'Video Call', 'Whiteboard', 'WiFi', 'Coffee'];

  const handleFeatureChange = (feature) => {
    if (featuresFilter.includes(feature)) {
      setFeaturesFilter(prev => prev.filter(f => f !== feature));
    } else {
      setFeaturesFilter(prev => [...prev, feature]);
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <HeaderTitle>
            Book Your Perfect Space
          </HeaderTitle>
          <HeaderSubtitle>
            Discover and reserve the ideal meeting room for your team's needs
          </HeaderSubtitle>
        </HeaderContent>
      </Header>

      <MainContent>
        <GridContainer>
          <Sidebar>
            <SidebarHeader>
              <Filter color="#2563eb" size={20} />
              <SidebarTitle>Filters</SidebarTitle>
            </SidebarHeader>
            
            <FilterSidebar>
              <FilterHeader><FaFilter /> Filters</FilterHeader>
              <FilterGroup>
                <FilterLabel><FaThList /> Search Rooms</FilterLabel>
                <FilterInput
                  type="text"
                  placeholder="Room name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </FilterGroup>
              <FilterGroup>
                <FilterLabel><FaUsers /> Minimum Capacity</FilterLabel>
                <FilterInput
                  type="number"
                  min="1"
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                  placeholder="Any size"
                />
              </FilterGroup>
              <FilterGroup>
                <FilterLabel style={{ color: '#4f46e5', fontWeight: 700 }}>Filter by Features</FilterLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {allFeatures.map(feature => (
                    <FeatureTag
                      key={feature}
                      selected={featuresFilter.includes(feature)}
                    >
                      <input
                        type="checkbox"
                        checked={featuresFilter.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                        style={{ marginRight: '0.3rem' }}
                      /> {feature}
                    </FeatureTag>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup style={{ marginTop: '1.2rem' }}>
                <FilterLabel><FaLayerGroup /> Floor</FilterLabel>
                <FilterSelectStyled
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="1">1st Floor</option>
                  <option value="2">2nd Floor</option>
                  <option value="3">3rd Floor</option>
                  <option value="4">4th Floor</option>
                  <option value="5">5th Floor</option>
                </FilterSelectStyled>
              </FilterGroup>
              <div style={{ color: '#64748b', fontSize: '1rem', marginTop: '1.2rem' }}>
                Total rooms found <b>{filteredRooms.length}</b>
              </div>
            </FilterSidebar>
          </Sidebar>

          <ContentArea>
            <ContentHeader>
              <ContentTitle>
                Available Rooms
              </ContentTitle>
              <DateBadge>
                <Calendar size={16} color="#6b7280" />
                <DateText>
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: '2-digit', 
                    year: 'numeric' 
                  })}
                </DateText>
              </DateBadge>
            </ContentHeader>

            <RoomsGrid>
              {filteredRooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onBook={() => { setSelectedRoom(room); setShowBookingModal(true); }}
                />
              ))}
            </RoomsGrid>

            {filteredRooms.length === 0 && (
              <EmptyState>
                <EmptyIcon>
                  <Search size={48} />
                </EmptyIcon>
                <EmptyTitle>No rooms found</EmptyTitle>
                <EmptyText>Try adjusting your search criteria</EmptyText>
              </EmptyState>
            )}
          </ContentArea>
        </GridContainer>
      </MainContent>

      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          user={dummyUser}
          onClose={() => { setShowBookingModal(false); setSelectedRoom(null); }}
        />
      )}
    </PageContainer>
  );
};

const RoomCard = ({ room, onBook }) => {
  const [isHovered, setIsHovered] = useState(false);
  const getFeatureIcon = (feature) => {
    switch (feature) {
      case 'Projector': return <Monitor size={16} />;
      case 'Video Call': return <Monitor size={16} />;
      case 'Whiteboard': return <div style={{width: '16px', height: '16px', background: '#3b82f6', borderRadius: '2px'}} />;
      case 'WiFi': return <Wifi size={16} />;
      case 'Coffee': return <Coffee size={16} />;
      default: return <Star size={16} />;
    }
  };
  return (
    <RoomCardContainer
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RoomImageWrapper>
        <RoomImage src={room.image || '/room-placeholder.jpg'} alt={room.name} />
        <StatusBadge status={room.status}>{room.status}</StatusBadge>
        <FloorInfo>
          <MapPin size={16} />
          <FloorText>Floor {room.floor}</FloorText>
        </FloorInfo>
      </RoomImageWrapper>
      <RoomContent>
        <RoomHeader>
          <RoomInfo>
            <RoomName>{room.name}</RoomName>
            <CapacityInfo>
              <Users size={16} />
              <CapacityText>Up to {room.capacity} people</CapacityText>
            </CapacityInfo>
          </RoomInfo>
        </RoomHeader>
        <FeaturesContainer>
          {room.features && room.features.length > 0 ? room.features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>{getFeatureIcon(feature)}</FeatureIcon>
              <FeatureText>{feature}</FeatureText>
            </FeatureItem>
          )) : (
            <FeatureItem>
              <FeatureIcon><Star size={16} /></FeatureIcon>
              <FeatureText>Standard amenities</FeatureText>
            </FeatureItem>
          )}
        </FeaturesContainer>
        <BookButton
          onClick={onBook}
          disabled={room.status === 'booked' || room.status === 'unavailable'}
          available={room.status === 'available'}
        >
          {room.status === 'available' ? 'Book Now' : 'Not Available'}
        </BookButton>
      </RoomContent>
    </RoomCardContainer>
  );
};

const BookingModal = ({ room, onClose, user }) => {
  const { addBooking, actActivity} = useData();
  const roomName = room.name || 'Unnamed Room';
  const roomFloor = room.floor || 'N/A';
  const roomFeatures = room.features || [];
  
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    roomName: roomName,
    floor: roomFloor,
    features: roomFeatures.join(', '),
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
          Book Room
        </h2>
        {submitted ? (
          <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Room booked successfully!
            <Button style={{ background: '#e5e7eb', color: '#1e293b', marginLeft: 8 }} onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Label>Name</Label>
            <Input name="name" value={form.name} readOnly />
            <Label>Email</Label>
            <Input name="email" value={form.email} readOnly />
            <Label>Room</Label>
            <Input name="roomName" value={form.roomName} readOnly />
            <Label>Floor</Label>
            <Input name="floor" value={form.floor} readOnly />
            <Label>Features</Label>
            <Input name="features" value={form.features} readOnly />
            <Label>Booking Start Date</Label>
            <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            <Label>Booking End Date</Label>
            <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
            <Label>Booking Start Time</Label>
            <Input name="startTime" type="time" value={form.startTime} onChange={handleChange} required />
            <Label>Booking End Time</Label>
            <Input name="endTime" type="time" value={form.endTime} onChange={handleChange} required />
            <Label>Purpose</Label>
            <Input name="purpose" value={form.purpose} onChange={handleChange} required />
            <Button type="submit">Book Room</Button>
            <Button style={{ background: '#e5e7eb', color: '#1e293b', marginLeft: 8 }} type="button" onClick={onClose}>
              Close
            </Button>
          </Form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};


  // {
  //   id: 2,
  //   name: 'Skyline Boardroom',
  //   floor: 2,
  //   capacity: 8,
  //   status: 'available',
  //   features: ['Video Call', 'Coffee'],
  //   image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&w=600',
  // },
  // {
  //   id: 3,
  //   name: 'Sunset Lounge',
  //   floor: 1,
  //   capacity: 6,
  //   status: 'booked',
  //   features: ['Whiteboard', 'WiFi'],
  //   image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=600',
  // },
  // {
  //   id: 4,
  //   name: 'Innovation Hub',
  //   floor: 1,
  //   capacity: 10,
  //   status: 'available',
  //   features: ['Projector', 'Coffee'],
  //   image: 'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&w=600',
  // },
  // {
  //   id: 5,
  //   name: 'Creative Studio',
  //   floor: 2,
  //   capacity: 7,
  //   status: 'available',
  //   features: ['Video Call', 'Whiteboard'],
  //   image: 'https://images.pexels.com/photos/245156/pexels-photo-245156.jpeg?auto=compress&w=600',
  // },
  // {
  //   id: 6,
  //   name: 'Executive Suite',
  //   floor: 3,
  //   capacity: 5,
  //   status: 'booked',
  //   features: ['WiFi', 'Coffee'],
  //   image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&w=600',
  // },



export default BookingPage;