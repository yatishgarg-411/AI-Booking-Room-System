import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Map, 
  MessageSquare, 
  User,
  AlertTriangle,
  TrendingUp,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Styled Components
const SidebarContainer = styled.div`
  width: 260px;
  background-color: #ffffff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height:100vh;
  border-right: 1px solid #e5e7eb;
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: ${(props) => (props.active ? '#fef2f2' : 'transparent')};
  border: ${(props) => (props.active ? '1px solid #fee2e2' : 'none')};
  color: ${(props) => (props.active ? '#dc2626' : '#4b5563')};

  &:hover {
    background-color: ${(props) => (props.active ? '#fef2f2' : '#f9fafb')};
    color: #111827;
  }
`;

const MenuText = styled.div`
  flex: 1;
`;

const MenuTitle = styled.div`
  font-weight: 500;
  color: ${(props) => (props.active ? '#dc2626' : '#111827')};
`;

const MenuDesc = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const Footer = styled.div`
  padding: 16px;
  border-top: 1px solid #e5e7eb;
`;

const AccessCard = styled.div`
  background: linear-gradient(to right, #ef4444, #ec4899);
  border-radius: 8px;
  padding: 16px;
  color: #ffffff;
`;

const AccessTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const AccessText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const AccessNote = styled.p`
  font-size: 12px;
  opacity: 0.9;
`;

// Main Component
const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', icon: BarChart3, path: '/dashboard/overview', description: 'Dashboard and live stats' },
    { name: 'Room Management', icon: Map, path: '/dashboard/rooms', description: 'Manage all rooms' },
    { name: 'Usage Analytics', icon: BarChart3, path: '/dashboard/analytics', description: 'Usage reports and insights' },
    { name: 'AI Predictions', icon: TrendingUp, path: '/dashboard/predictions', description: 'Predictive insights' },
    { name: 'AI Assistant', icon: MessageSquare, path: '/dashboard/chat', description: 'Admin chat interface' },
    { name: 'Profile', icon: User, path: '/dashboard/profile', description: 'Account settings' }
  ];

  return (
    <SidebarContainer>
      <Header>
        <HeaderTop>
          <Shield size={20} color="#dc2626" />
          <Title>Admin Dashboard</Title>
        </HeaderTop>
        <Subtitle>Manage rooms and system settings</Subtitle>
      </Header>

      <Nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <MenuButton
              key={item.path}
              active={isActive}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 4 }}
            >
              <Icon size={20} color={isActive ? '#dc2626' : '#9ca3af'} />
              <MenuText>
                <MenuTitle active={isActive}>{item.name}</MenuTitle>
                <MenuDesc>{item.description}</MenuDesc>
              </MenuText>
            </MenuButton>
          );
        })}
      </Nav>

      <Footer>
        <AccessCard>
          <AccessTop>
            <Shield size={16} />
            <AccessText>Admin Access</AccessText>
          </AccessTop>
          <AccessNote>You have full system privileges and access to all features.</AccessNote>
        </AccessCard>
      </Footer>
    </SidebarContainer>
  );
};

export default AdminSidebar;