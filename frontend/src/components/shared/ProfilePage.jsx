import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Bell,
  Globe,
  Lock,
  Save,
  Camera,
  MapPin,
  Users,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    team: user?.team || '',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      sms: false,
      reminders: true
    },
    preferences: {
      defaultDuration: '60',
      preferredRooms: user?.preferredRooms || [],
      autoBook: false
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target;
      if (name.includes('.')) {
        const [section, field] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: checkbox.checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
  };

  return (
    <Container>
      <Header>
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </Header>
      <Grid>
        <Sidebar>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <TabButton
                key={tab.id}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </TabButton>
            );
          })}
        </Sidebar>

        <Main>
          {/* Just placeholder text. We can extract form groups and toggles to styled components similarly. */}
          <ContentBox>
            <h2>{tabs.find(t => t.id === activeTab)?.label} Section</h2>
            <p>Implement each tab's content here using styled-components.</p>
          </ContentBox>
          <Footer>
            <SaveButton onClick={handleSave}>
              <Save size={16} /> <span>Save Changes</span>
            </SaveButton>
          </Footer>
        </Main>
      </Grid>
    </Container>
  );
};

export default ProfilePage;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 80rem;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  p {
    color: #6b7280;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
`;

const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: ${({ isActive }) => (isActive ? '1px solid #bfdbfe' : 'none')};
  background-color: ${({ isActive }) => (isActive ? '#eff6ff' : 'transparent')};
  color: ${({ isActive }) => (isActive ? '#2563eb' : '#4b5563')};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Main = styled.div``;

const ContentBox = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;