import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaChartPie, FaBed, FaListAlt, FaDoorOpen, FaRobot, FaUser } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 220px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4f46e5;
  margin-bottom: 2rem;
  text-align: center;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled.li`
  margin-bottom: 1.5rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem 0 0 0.75rem;
  transition: background 0.2s, color 0.2s;
  &.active, &:hover {
    background: #f3f4f6;
    color: #4f46e5;
    font-weight: bold;
  }
`;

const UserSidebar = () => (
  <SidebarContainer>
    <Logo>Hotel Booking</Logo>
    <NavList>
      <NavItem>
        <StyledNavLink to="/user" end><FaChartPie /> Dashboard</StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/user/booking"><FaBed /> Book a Room</StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/user/my-bookings"><FaListAlt /> My Bookings</StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/user/chat"><FaRobot /> Chatbot</StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/user/profile"><FaUser /> Profile</StyledNavLink>
      </NavItem>
    </NavList>
  </SidebarContainer>
);

export default UserSidebar;
