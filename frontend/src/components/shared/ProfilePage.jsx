import React from 'react';
import styled from 'styled-components';
import { User as UserIcon, Mail, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {  useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate=useNavigate();
    const { name, email,setToken } = useAuth();
  const logout = () =>{
    setToken('');
    navigate('/');
  }

  return (
    <Bg>
      <CenterCard>
        <UserImageCircle>
          <UserIcon size={48} color="#6366f1" />
        </UserImageCircle>
        <UserName>{name || 'Your Name'}</UserName>
        <UserEmail><Mail size={18} style={{marginRight:6}} />{email}</UserEmail>
        <LogoutButton onClick={logout}>
          <LogOut size={18} style={{marginRight:8}} /> Logout
        </LogoutButton>
      </CenterCard>
      <Footer>
        Made with <Heart size={16} color="#ef4444" style={{margin:'0 4px'}}/> by Yatish and Akshita
      </Footer>
    </Bg>
  );
};

export default ProfilePage;

// Styled Components
const Bg = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const CenterCard = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
`;
const UserImageCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a5b4fc 0%, #f3e8ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
`;
const UserName = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3730a3;
  margin-bottom: 0.5rem;
`;
const UserEmail = styled.div`
  font-size: 1.1rem;
  color: #6366f1;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
`;
const LogoutButton = styled.button`
  background: linear-gradient(90deg, #6366f1 60%, #a5b4fc 100%);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.7rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(99,102,241,0.08);
  display: flex;
  align-items: center;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #4f46e5 60%, #a5b4fc 100%);
  }
`;
const Footer = styled.div`
  margin-top: 3rem;
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;