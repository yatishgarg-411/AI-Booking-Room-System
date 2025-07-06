import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Map, MessageSquare, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Styled Components
const SidebarContainer = styled.div`
  width: 260px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const SidebarTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const SidebarSubtext = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const NavContainer = styled.nav`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  text-align: left;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  border: ${({ active }) => (active ? '1px solid #bfdbfe' : 'none')};
  background: ${({ active }) => (active ? '#eff6ff' : 'transparent')};
  color: ${({ active }) => (active ? '#2563eb' : '#4b5563')};
  cursor: pointer;

  &:hover {
    background: ${({ active }) => (active ? '#eff6ff' : '#f9fafb')};
    color: #111827;
  }
`;

const IconContainer = styled.div`
  margin-top: 0.25rem;
`;

const ItemLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`;

const ItemDesc = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const TipContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const TipCard = styled.div`
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border-radius: 0.75rem;
  padding: 1rem;
  color: white;
  font-size: 0.75rem;
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
`;

export default function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Book a Room',
      icon: Calendar,
      path: '/user/booking',
      description: 'Find and book meeting rooms',
    },
    {
      name: 'My Bookings',
      icon: BookOpen,
      path: '/user/my-bookings',
      description: 'Manage your reservations',
    },
    {
      name: 'Room Status',
      icon: Map,
      path: '/user/status',
      description: 'Live room availability map',
    },
    {
      name: 'AI Assistant',
      icon: MessageSquare,
      path: '/user/chat',
      description: 'Smart booking chat',
    },
    {
      name: 'Profile',
      icon: User,
      path: '/user/profile',
      description: 'Account settings',
    },
  ];

  return (
    <SidebarContainer>
      <SidebarHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Zap size={20} color="#3b82f6" />
          <SidebarTitle>User Dashboard</SidebarTitle>
        </div>
        <SidebarSubtext>Book and manage your meeting rooms</SidebarSubtext>
      </SidebarHeader>

      <NavContainer>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavItem
              key={item.path}
              active={isActive}
              whileHover={{ x: 4 }}
              onClick={() => navigate(item.path)}
            >
              <IconContainer>
                <Icon size={18} color={isActive ? '#2563eb' : '#9ca3af'} />
              </IconContainer>
              <div>
                <ItemLabel style={{ color: isActive ? '#2563eb' : '#111827' }}>{item.name}</ItemLabel>
                <ItemDesc>{item.description}</ItemDesc>
              </div>
            </NavItem>
          );
        })}
      </NavContainer>

      <TipContainer>
        <TipCard>
          <TipHeader>
            <Zap size={14} />
            <span>Pro Tip</span>
          </TipHeader>
          Use our AI assistant to book rooms with natural language!
        </TipCard>
      </TipContainer>
    </SidebarContainer>
  );
}
