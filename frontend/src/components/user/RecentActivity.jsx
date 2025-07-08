import React from 'react';
import styled from 'styled-components';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaHistory, FaSync, FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
import { format } from 'date-fns';

const ActivityContainer = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const ActivityTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  color: ${props => props.color || '#6366f1'};
  margin-top: 0.2rem;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityAction = styled.div`
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 0.2rem;
`;

const ActivityDetails = styled.div`
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0.1rem;
`;

const ActivityRoom = styled.div`
  color: #1e293b;
  font-size: 1.05rem;
  font-weight: 500;
`;

const ActivityTime = styled.div`
  color: #9ca3af;
  font-size: 0.95rem;
`;

function getIconAndColor(action, type) {
  // Map action/type to icon and color
  if (action === 'created') return { icon: <FaPlus />, color: '#22c55e' };
  if (action === 'cancelled') return { icon: <FaTimes />, color: '#ef4444' };
  if (action === 'updated') return { icon: <FaEdit />, color: '#6366f1' };
  if (action === 'extended') return { icon: <FaSync />, color: '#f59e42' };
  if (action === 'released') return { icon: <FaCheck />, color: '#22c55e' };
  if (action === 'marked_available') return { icon: <FaDoorOpen />, color: '#22c55e' };
  if (action === 'marked_unavailable') return { icon: <FaDoorClosed />, color: '#ef4444' };
  if (action === 'deleted') return { icon: <FaTrash />, color: '#ef4444' };
  return { icon: <FaHistory />, color: '#64748b' };
}

const RecentActivity = () => {
  const { recentActivity } = useData();
  const { email } = useAuth();
  // Show only activities for the current user
  const userActivity = (recentActivity || []).filter(a => a.user === email).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <ActivityContainer>
      <ActivityTitle>Recent Activity</ActivityTitle>
      {userActivity.length === 0 ? (
        <div style={{ color: '#64748b', textAlign: 'center', fontSize: '1.1rem' }}>No recent activity yet.</div>
      ) : (
        <ActivityList>
          {userActivity.map((activity, idx) => {
            const { icon, color } = getIconAndColor(activity.action, activity.type);
            return (
              <ActivityItem key={activity.id || idx}>
                <IconWrapper color={color}>{icon}</IconWrapper>
                <ActivityInfo>
                  <ActivityAction>{activity.action.replace('_', ' ').toUpperCase()}</ActivityAction>
                  <ActivityRoom>Room: {activity.roomName}</ActivityRoom>
                  <ActivityDetails>{activity.details}</ActivityDetails>
                  <ActivityTime>{activity.timestamp ? format(new Date(activity.timestamp), 'PPpp') : ''}</ActivityTime>
                </ActivityInfo>
              </ActivityItem>
            );
          })}
        </ActivityList>
      )}
    </ActivityContainer>
  );
};

export default RecentActivity; 