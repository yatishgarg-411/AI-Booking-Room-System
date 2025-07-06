import React, { useState } from 'react';
import { Calendar, Search, Users, MapPin, Filter, Star, Wifi, Monitor, Coffee } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

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

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374751;
  margin-bottom: 0.75rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
    border-color: transparent;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background: white;
  appearance: none;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
    border-color: transparent;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
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

const RoomImageContainer = styled.div`
  height: 12rem;
  background: linear-gradient(135deg, #60a5fa, #a855f7, #ec4899);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
  }
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
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  padding: 1.5rem;
  animation: ${scaleIn} 0.3s ease-out;
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
      <RoomImageContainer>
        <StatusBadge status={room.status}>
          {room.status}
        </StatusBadge>
        <FloorInfo>
          <MapPin size={16} />
          <FloorText>Floor {room.floor}</FloorText>
        </FloorInfo>
      </RoomImageContainer>
      
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
          {room.features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>{getFeatureIcon(feature)}</FeatureIcon>
              <FeatureText>{feature}</FeatureText>
            </FeatureItem>
          ))}
        </FeaturesContainer>
        
        <BookButton
          onClick={onBook}
          disabled={room.status === 'booked'}
          available={room.status === 'available'}
        >
          {room.status === 'available' ? 'Book Now' : 'Not Available'}
        </BookButton>
      </RoomContent>
    </RoomCardContainer>
  );
};

const BookingModal = ({ room, onClose, onBook }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>Book {room.name}</ModalTitle>
        <ModalText>Confirm your booking for this room</ModalText>
        <ModalActions>
          <ModalButton onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton primary onClick={onBook}>
            Confirm
          </ModalButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

const dummyRooms = [
  {
    id: '1',
    name: 'Ocean View Conference Room',
    capacity: 12,
    floor: 3,
    features: ['Projector', 'Whiteboard', 'WiFi'],
    status: 'available',
  },
  {
    id: '2',
    name: 'Skyline Boardroom',
    capacity: 8,
    floor: 2,
    features: ['Video Call', 'Coffee'],
    status: 'available',
  },
  {
    id: '3',
    name: 'Sunset Lounge',
    capacity: 6,
    floor: 1,
    features: ['Whiteboard', 'WiFi'],
    status: 'booked',
  },
  {
    id: '4',
    name: 'Innovation Hub',
    capacity: 15,
    floor: 4,
    features: ['Projector', 'Video Call', 'Coffee'],
    status: 'available',
  },
  {
    id: '5',
    name: 'Creative Studio',
    capacity: 10,
    floor: 2,
    features: ['Whiteboard', 'WiFi'],
    status: 'available',
  },
  {
    id: '6',
    name: 'Executive Suite',
    capacity: 6,
    floor: 5,
    features: ['Video Call', 'Coffee', 'WiFi'],
    status: 'booked',
  },
];

const BookingPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');

  const filteredRooms = dummyRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = !capacityFilter || room.capacity >= parseInt(capacityFilter);
    return matchesSearch && matchesCapacity;
  });

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
            
            <div>
              <FilterGroup>
                <FilterLabel>
                  Search Rooms
                </FilterLabel>
                <InputContainer>
                  <IconWrapper>
                    <Search size={18} />
                  </IconWrapper>
                  <StyledInput
                    type="text"
                    placeholder="Room name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputContainer>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  Minimum Capacity
                </FilterLabel>
                <InputContainer>
                  <IconWrapper>
                    <Users size={18} />
                  </IconWrapper>
                  <StyledSelect
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                  >
                    <option value="">Any size</option>
                    <option value="4">4+ people</option>
                    <option value="8">8+ people</option>
                    <option value="12">12+ people</option>
                  </StyledSelect>
                </InputContainer>
              </FilterGroup>

              <FilterStats>
                <FilterStatsLabel>Total rooms found</FilterStatsLabel>
                <FilterStatsValue>{filteredRooms.length}</FilterStatsValue>
              </FilterStats>
            </div>
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
                  onBook={() => setSelectedRoom(room)} 
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

      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onBook={() => {
            alert('Room booked successfully!');
            setSelectedRoom(null);
          }}
        />
      )}
    </PageContainer>
  );
};

export default BookingPage;