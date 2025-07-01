import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  CheckCircle, 
  X,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  padding: 24px;
  max-width: 1120px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionBody = styled.div`
  padding: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const ConflictCard = styled(motion.div)`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
`;

const Badge = styled.span`
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  border: 1px solid;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const ConflictResolver = () => {
  const { conflicts, resolveConflict } = useData();

  const getConflictIcon = (type) => {
    switch (type) {
      case 'double_booking': return Calendar;
      case 'overcapacity': return Users;
      case 'maintenance': return Clock;
      default: return AlertTriangle;
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': return { background: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca' };
      case 'medium': return { background: '#ffedd5', color: '#c2410c', borderColor: '#fed7aa' };
      case 'low': return { background: '#fef9c3', color: '#a16207', borderColor: '#fef08a' };
      default: return { background: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' };
    }
  };

  const activeConflicts = conflicts.filter(conflict => !conflict.resolved);
  const resolvedConflicts = conflicts.filter(conflict => conflict.resolved);

  return (
    <Container>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Conflict Resolver</h1>
        <p style={{ color: '#6b7280' }}>Manage and resolve booking conflicts efficiently</p>
      </div>

      <StatsGrid>
        <StatCard>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Active Conflicts</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{activeConflicts.length}</p>
          </div>
          <IconBox style={{ backgroundColor: '#fee2e2' }}>
            <AlertTriangle color="#dc2626" size={24} />
          </IconBox>
        </StatCard>
        <StatCard>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Resolved Today</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{resolvedConflicts.length}</p>
          </div>
          <IconBox style={{ backgroundColor: '#bbf7d0' }}>
            <CheckCircle color="#16a34a" size={24} />
          </IconBox>
        </StatCard>
        <StatCard>
          <div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Resolution Rate</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>94%</p>
          </div>
          <IconBox style={{ backgroundColor: '#dbeafe' }}>
            <Clock color="#2563eb" size={24} />
          </IconBox>
        </StatCard>
      </StatsGrid>

      {/* Active Conflicts */}
      <Section>
        <SectionHeader>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Active Conflicts</h2>
        </SectionHeader>
        <SectionBody>
          {activeConflicts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeConflicts.map((conflict, index) => {
                const Icon = getConflictIcon(conflict.type);
                const priorityStyle = getPriorityStyle(conflict.priority);
                return (
                  <ConflictCard
                    key={conflict.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <IconBox style={{ backgroundColor: '#fee2e2' }}>
                          <Icon size={20} color="#dc2626" />
                        </IconBox>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827' }}>{conflict.roomName}</h3>
                            <Badge style={priorityStyle}>{conflict.priority} priority</Badge>
                          </div>
                          <p style={{ color: '#4b5563', marginBottom: '12px' }}>{conflict.description}</p>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                            <span>Type: {conflict.type.replace('_', ' ')}</span>
                            <span>Bookings affected: {conflict.bookings.length}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ActionButton style={{ backgroundColor: '#16a34a' }} onClick={() => resolveConflict(conflict.id)}>
                          <CheckCircle size={16} /> Resolve
                        </ActionButton>
                        <ActionButton style={{ backgroundColor: '#2563eb' }}>
                          <ArrowRight size={16} /> Reassign
                        </ActionButton>
                      </div>
                    </div>
                  </ConflictCard>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <IconBox style={{ backgroundColor: '#bbf7d0', margin: '0 auto 16px' }}>
                <CheckCircle size={24} color="#16a34a" />
              </IconBox>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>No Active Conflicts</h3>
              <p style={{ color: '#6b7280' }}>All booking conflicts have been resolved!</p>
            </div>
          )}
        </SectionBody>
      </Section>

      {/* Resolution History */}
      <Section>
        <SectionHeader>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Resolution History</h2>
        </SectionHeader>
        <SectionBody>
          {resolvedConflicts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {resolvedConflicts.map((conflict, index) => {
                const Icon = getConflictIcon(conflict.type);
                return (
                  <ConflictCard
                    key={conflict.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    style={{ backgroundColor: '#f9fafb' }}
                  >
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <IconBox style={{ backgroundColor: '#bbf7d0' }}>
                        <Icon size={20} color="#16a34a" />
                      </IconBox>
                      <div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827' }}>{conflict.roomName}</h3>
                          <span style={{ padding: '4px 8px', backgroundColor: '#bbf7d0', color: '#166534', fontSize: '12px', borderRadius: '999px' }}>Resolved</span>
                        </div>
                        <p style={{ color: '#4b5563', marginBottom: '8px' }}>{conflict.description}</p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                          <span>Type: {conflict.type.replace('_', ' ')}</span>
                          <span>Resolved: 2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </ConflictCard>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280' }}>
              No conflicts have been resolved yet today.
            </div>
          )}
        </SectionBody>
      </Section>
    </Container>
  );
};

export default ConflictResolver;