import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, Shield } from 'lucide-react';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 3rem;
    align-items: center;
  }
`;

const HeroSection = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  
  @media (max-width: 1023px) {
    text-align: center;
    padding: 1rem;
  }
`;

const LogoCard = styled.div`
  background: #1976d2;
  color: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  
  @media (max-width: 1023px) {
    margin: 0 auto 2rem auto;
  }
`;

const LogoIcon = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  color: #1976d2;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 1023px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const FeatureValue = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #1976d2;
  margin-bottom: 0.5rem;
`;

const FeatureLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const FormCard = styled(motion.div)`
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  max-width: 450px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 1023px) {
    margin: 0 auto;
    padding: 2rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 400;
  color: #1976d2;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const MaterialInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }
  
  &:not(:placeholder-shown) {
    border-color: #1976d2;
  }
`;

const MaterialSelect = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  font-family: inherit;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  z-index: 1;
`;

const MaterialButton = styled.button`
  width: 100%;
  background: #1976d2;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: #1565c0;
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.3);
  }
`;

const ToggleSection = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: inherit;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ForgotLink = styled.a`
  color: #666;
  font-size: 0.875rem;
  text-align: center;
  display: block;
  margin-top: 1rem;
  text-decoration: none;
  
  &:hover {
    color: #1976d2;
    text-decoration: underline;
  }
`;

const LoginPage = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const loginForm = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
        const res = await axios.post(`${API_URL}/${formData.role}/login`, loginForm);
        alert(res.data.msg);
        setToken(res.data.token);
        if(formData.role ==='admin'){navigate('/dashboard');}
        else if(formData.role ==='user'){navigate('/user');}
        setIsLogin(false)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("User doesnot exists!!");
          setIsLogin(false);
        }else if(error.response && error.response.status === 401){
          alert("Incorrect Password!!");
        }
      }
    }
    else {
      const signupForm = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
        const res = await axios.post(`${API_URL}/${formData.role}/signup`, signupForm);
        alert(res.data.msg);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("User already exists!!");
          setIsLogin(true);
        }
      }
    }
    console.log('Form submitted:', formData);
  };

  return (
    <PageWrapper>
      <Container>
        <HeroSection
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoCard>
            <LogoIcon>
              <Building2 color="white" size={32} />
            </LogoIcon>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '500', margin: '0 0 0.25rem 0' }}>
                Smart Rooms
              </h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
                Intelligent Booking System
              </p>
            </div>
          </LogoCard>

          <HeroTitle>
            Book Smart.<br />
            Save Time.<br />
            <span style={{ color: '#1976d2' }}>Stay Productive.</span>
          </HeroTitle>

          <HeroSubtitle>
            Experience the future of room booking with AI-powered suggestions, 
            real-time availability, and intelligent conflict resolution.
          </HeroSubtitle>

          <FeatureGrid>
            <FeatureCard>
              <FeatureValue>98%</FeatureValue>
              <FeatureLabel>Booking Success Rate</FeatureLabel>
            </FeatureCard>
            <FeatureCard>
              <FeatureValue>{'< 30s'}</FeatureValue>
              <FeatureLabel>Average Booking Time</FeatureLabel>
            </FeatureCard>
          </FeatureGrid>
        </HeroSection>

        <FormCard
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FormTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</FormTitle>
          <FormSubtitle>
            {isLogin ? 'Sign in to access your dashboard' : 'Join us to start booking rooms smarter'}
          </FormSubtitle>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <InputGroup>
                <InputWrapper>
                  <InputIcon><User size={20} /></InputIcon>
                  <MaterialInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </InputWrapper>
              </InputGroup>
            )}

            <InputGroup>
              <InputWrapper>
                <InputIcon><Mail size={20} /></InputIcon>
                <MaterialInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <InputIcon><Lock size={20} /></InputIcon>
                <MaterialInput
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <InputIcon><Shield size={20} /></InputIcon>
                <MaterialSelect name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="user">User - Book & Manage Rooms</option>
                  <option value="admin">Admin - Full System Access</option>
                </MaterialSelect>
              </InputWrapper>
            </InputGroup>

            <MaterialButton type="submit">
              {isLogin ? 'Sign In' : 'Create Account'}
            </MaterialButton>
          </form>

          <ToggleSection>
            <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <ToggleButton onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </ToggleButton>
            </p>
            {isLogin && (
              <ForgotLink href="#">Forgot your password?</ForgotLink>
            )}
          </ToggleSection>
        </FormCard>
      </Container>
    </PageWrapper>
  );
};

export default LoginPage;
