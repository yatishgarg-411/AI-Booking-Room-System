import React from 'react';
import styled from 'styled-components';
import { FaPlusCircle, FaEdit, FaTrash, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';

const dummyActivities = [
  { id: 1, type: 'book', description: 'Booked Room 101', time: '2024-06-01 10:00' },
  { id: 2, type: 'cancel', description: 'Cancelled booking for Room 202', time: '2024-05-30 15:30' },
  { id: 3, type: 'update', description: 'Updated booking for Room 303', time: '2024-05-28 09:45' },
  { id: 4, type: 'book', description: 'Booked Room 404', time: '2024-05-25 13:20' },
  { id: 5, type: 'delete', description: 'Deleted booking for Room 505', time: '2024-05-20 17:10' },
];

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const ActivityIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => {
    switch (props.type) {
      case 'book': return '#4f46e5';
      case 'cancel': return '#ef4444';
      case 'update': return '#f59e42';
      case 'delete': return '#6b7280';
      default: return '#6366f1';
    }
  }};
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityDesc = styled.div`
  font-size: 1.1rem;
  color: #1e293b;
`;

const ActivityTime = styled.div`
  font-size: 0.95rem;
  color: #6b7280;
`;

const getIcon = (type) => {
  switch (type) {
    case 'book': return <FaCalendarCheck />;
    case 'cancel': return <FaCalendarTimes />;
    case 'update': return <FaEdit />;
    case 'delete': return <FaTrash />;
    default: return <FaPlusCircle />;
  }
};

const RecentActivity = () => (
  <div>
    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
      Recent Activity
    </h2>
    <ActivityList>
      {dummyActivities.map(activity => (
        <ActivityItem key={activity.id}>
          <ActivityIcon type={activity.type}>{getIcon(activity.type)}</ActivityIcon>
          <ActivityInfo>
            <ActivityDesc>{activity.description}</ActivityDesc>
            <ActivityTime>{activity.time}</ActivityTime>
          </ActivityInfo>
        </ActivityItem>
      ))}
    </ActivityList>
  </div>
);

export default RecentActivity; 