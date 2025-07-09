import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import AdminSidebar from '../components/admin/AdminSidebar';


const DashboardWrapper = styled.div`
  display: flex;
  flex-direction:row;
  height: 100vh;
  background-color: #f9fafb;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
`;

const AdminDashboard = () => {
  return (
    <DashboardWrapper>
      <AdminSidebar />
      <ContentArea>

        <Outlet />

      </ContentArea>
    </DashboardWrapper>
  );
};

export default AdminDashboard;