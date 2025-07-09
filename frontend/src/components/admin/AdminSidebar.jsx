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
  width: 270px;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  box-shadow: 0 8px 32px rgba(102,126,234,0.10);
  border-right: 1.5px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="20" r="12" fill="%23667eea" fill-opacity="0.08"/><circle cx="30" cy="80" r="18" fill="%23764ba2" fill-opacity="0.07"/><rect x="60" y="60" width="30" height="30" rx="15" fill="%23a5b4fc" fill-opacity="0.06"/></svg>');
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.7;
    pointer-events: none;
    z-index: 0;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  padding: 2.2rem 1.5rem 1.2rem 1.5rem;
  background: rgba(255,255,255,0.8);
  z-index: 2;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102,126,234,0.13);
  border: 3px solid #e0e7ff;
  overflow: hidden;
`;

const ProfileName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #374151;
`;

const Header = styled.div`
  padding: 1.2rem 1.5rem 1.5rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 1.5rem 1.5rem;
  box-shadow: 0 4px 16px rgba(102,126,234,0.08);
  margin-bottom: 1.2rem;
  z-index: 2;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const LogoCircle = styled.div`
  background: linear-gradient(135deg, #ffb347 0%, #ffcc33 100%);
  border-radius: 50%;
  padding: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255,204,51,0.12);
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #f3f4f6;
  margin: 0;
  font-weight: 400;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 32px 1rem 1rem 1rem; /* Add top margin for breathing room */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 2;
`;

const MenuButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.2rem 0.85rem 0.7rem; /* More vertical padding, less left */
  border-radius: 0.9rem;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: ${(props) => (props.active ? 'rgba(102,126,234,0.13)' : 'rgba(255,255,255,0.7)')};
  border: ${(props) => (props.active ? '2px solid #6366f1' : '2px solid transparent')};
  color: ${(props) => (props.active ? '#6366f1' : '#374151')};
  box-shadow: ${(props) => (props.active ? '0 0 16px 2px #a5b4fc55' : '0 2px 8px rgba(102,126,234,0.06)')};
  font-weight: 500;
  font-size: 1.05rem;
  position: relative;
  overflow: hidden;
  margin-bottom: 2px;
  /* Active left bar */
  &::before {
    content: '';
    display: ${(props) => (props.active ? 'block' : 'none')};
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 5px;
    border-radius: 6px;
    background: linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%);
  }
  &:hover {
    background: rgba(102,126,234,0.10);
    color: #6366f1;
    transform: translateX(4px) scale(1.01);
    box-shadow: 0 4px 16px rgba(102,126,234,0.10);
  }
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem; /* Slightly smaller for balance */
  min-width: 28px;
`;

const MenuText = styled.div`
  flex: 1;
`;

const MenuTitle = styled.div`
  font-weight: 600;
  color: ${(props) => (props.active ? '#6366f1' : '#374151')};
  font-size: 1.05rem;
`;

const MenuDesc = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.2rem;
`;

const Footer = styled.div`
  padding: 1.2rem 1rem 1.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 -2px 12px rgba(102,126,234,0.06);
  z-index: 2;
`;

const AccessCard = styled.div`
  background: rgba(255,255,255,0.85);
  border-radius: 1rem;
  padding: 1.1rem 1rem;
  color: #6366f1;
  box-shadow: 0 2px 8px rgba(102,126,234,0.10);
`;

const AccessTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.5rem;
`;

const AccessText = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const AccessNote = styled.p`
  font-size: 0.85rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.4;
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
      {/* Removed Header and LogoCircle section for a cleaner sidebar */}
      <Nav>
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          // Use emoji for each menu item for extra vibrancy
          const emojiIcons = ['📊','🗺️','📈','🤖','💬','👤'];
          return (
            <MenuButton
              key={item.path}
              active={isActive}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <MenuIcon>
                <span style={{ fontSize: '1.3em', marginRight: '0.2em' }}>{emojiIcons[idx]}</span>
                <Icon size={22} color={isActive ? '#6366f1' : '#a5b4fc'} />
              </MenuIcon>
              <MenuText>
                <MenuTitle active={isActive}>{item.name}</MenuTitle>
                <MenuDesc>{item.description}</MenuDesc>
              </MenuText>
            </MenuButton>
          );
        })}
      </Nav>
    </SidebarContainer>
  );
};

export default AdminSidebar;