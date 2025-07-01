import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Calendar, Clock, Users, AlertCircle, Lightbulb, Target } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 90rem;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #4b5563;
`;

const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => props.bg};
  color: ${(props) => props.color};
`;

const PredictionInsights = () => {
  const predictions = [
    {
      id: 1,
      type: 'utilization',
      title: 'Peak Usage Prediction',
      description: 'Room 3 is predicted to be unused tomorrow from 2-5 PM based on historical patterns',
      confidence: 87,
      impact: 'high',
      timeframe: 'Tomorrow 2:00-5:00 PM',
      icon: Clock,
      color: 'blue'
    },
    {
      id: 2,
      type: 'demand',
      title: 'Increased Demand Forecast',
      description: 'Bookings typically increase by 40% on Fridays after 2 PM. Consider opening additional rooms.',
      confidence: 92,
      impact: 'medium',
      timeframe: 'This Friday',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance Window Opportunity',
      description: 'Room 5 shows low usage pattern next Tuesday morning - ideal for scheduled maintenance',
      confidence: 78,
      impact: 'low',
      timeframe: 'Next Tuesday 9:00-11:00 AM',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      id: 4,
      type: 'optimization',
      title: 'Resource Optimization',
      description: 'Engineering team prefers rooms with projectors. Consider upgrading Room 4 equipment.',
      confidence: 85,
      impact: 'medium',
      timeframe: 'Long-term',
      icon: Lightbulb,
      color: 'purple'
    }
  ];

  const insights = [
    {
      title: 'Seasonal Patterns',
      description: 'Meeting room usage drops by 25% during holiday seasons',
      metric: '25% decrease',
      trend: 'seasonal'
    },
    {
      title: 'Team Behavior',
      description: 'Marketing team books 30% longer meetings than average',
      metric: '+30% duration',
      trend: 'behavioral'
    },
    {
      title: 'Feature Preference',
      description: 'Rooms with whiteboards are booked 40% more frequently',
      metric: '+40% bookings',
      trend: 'preference'
    },
    {
      title: 'Time Clustering',
      description: 'Most conflicts occur between 2-4 PM on weekdays',
      metric: '60% of conflicts',
      trend: 'temporal'
    }
  ];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return { text: '#16a34a', bg: '#dcfce7' };
    if (confidence >= 70) return { text: '#ea580c', bg: '#ffedd5' };
    return { text: '#dc2626', bg: '#fee2e2' };
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return { bg: '#fee2e2', color: '#b91c1c' };
      case 'medium': return { bg: '#ffedd5', color: '#c2410c' };
      case 'low': return { bg: '#dcfce7', color: '#166534' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <Container>
      <div style={{ marginBottom: '2rem' }}>
        <Title>AI Prediction Insights</Title>
        <Subtitle>Intelligent forecasting and optimization recommendations</Subtitle>
      </div>

      <CardGrid>
        <StatCard>
          <StatIcon color="#ede9fe"><Brain size={24} color="#7c3aed" /></StatIcon>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>94%</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Prediction Accuracy</p>
        </StatCard>

        <StatCard>
          <StatIcon color="#dbeafe"><Target size={24} color="#2563eb" /></StatIcon>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>12</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Active Predictions</p>
        </StatCard>

        <StatCard>
          <StatIcon color="#d1fae5"><TrendingUp size={24} color="#16a34a" /></StatIcon>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>18%</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Efficiency Improvement</p>
        </StatCard>

        <StatCard>
          <StatIcon color="#ffedd5"><Lightbulb size={24} color="#ea580c" /></StatIcon>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>7</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Optimization Opportunities</p>
        </StatCard>
      </CardGrid>
    </Container>
  );
};

export default PredictionInsights;