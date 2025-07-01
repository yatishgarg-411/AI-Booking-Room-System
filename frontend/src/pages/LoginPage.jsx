import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, Shield } from 'lucide-react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #eff6ff, #ffffff, #eef2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const GridWrapper = styled.div`
  display: grid;
  max-width: 64rem;
  width: 100%;
  gap: 2rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Branding = styled(motion.div)`
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div`
  padding: 0.75rem;
  background-color: #2563eb;
  border-radius: 0.75rem;
`;

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #bfdbfe;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-size: 1rem;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #bfdbfe;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #2563eb;
  color: white;
  padding: 0.75rem;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const ToggleLink = styled.button`
  color: #2563eb;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ForgotLink = styled.a`
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  display: block;
  margin-top: 1rem;

  &:hover {
    color: #111827;
  }
`;

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // purely frontend: just log to console
    console.log('Form submitted:', formData);
  };

  return (
    <PageWrapper>
      <GridWrapper>
        <Branding
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoWrapper>
            <LogoIcon>
              <Building2 color="white" size={32} />
            </LogoIcon>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Smart Rooms</h1>
              <p style={{ color: '#6b7280' }}>Intelligent Booking System</p>
            </div>
          </LogoWrapper>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', lineHeight: 1.2 }}>
              Book Smart.<br />
              Save Time.<br />
              <span style={{ color: '#2563eb' }}>Stay Productive.</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              Experience the future of room booking with AI-powered suggestions, real-time availability, and intelligent conflict resolution.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '2rem' }}>
            <div style={{ padding: '1rem', background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>98%</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Booking Success Rate</div>
            </div>
            <div style={{ padding: '1rem', background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{'< 30s'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Average Booking Time</div>
            </div>
          </div>
        </Branding>

        <FormCard
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
            <p style={{ color: '#6b7280' }}>{isLogin ? 'Sign in to access your dashboard' : 'Join us to start booking rooms smarter'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <InputGroup>
                <Label>Full Name</Label>
                <InputWrapper>
                  <Icon><User size={20} /></Icon>
                  <Input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required />
                </InputWrapper>
              </InputGroup>
            )}

            <InputGroup>
              <Label>Email Address</Label>
              <InputWrapper>
                <Icon><Mail size={20} /></Icon>
                <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Password</Label>
              <InputWrapper>
                <Icon><Lock size={20} /></Icon>
                <Input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your password" required />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Account Type</Label>
              <InputWrapper>
                <Icon><Shield size={20} /></Icon>
                <Select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="user">User - Book & Manage Rooms</option>
                  <option value="admin">Admin - Full System Access</option>
                </Select>
              </InputWrapper>
            </InputGroup>

            <SubmitButton type="submit">
              {isLogin ? 'Sign In' : 'Create Account'}
            </SubmitButton>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#6b7280' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <ToggleLink onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </ToggleLink>
            </p>
          </div>

          {isLogin && (
            <ForgotLink href="#">Forgot your password?</ForgotLink>
          )}
        </FormCard>
      </GridWrapper>
    </PageWrapper>
  );
};

export default LoginPage;
