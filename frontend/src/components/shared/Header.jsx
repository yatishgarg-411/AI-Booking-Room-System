import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Calendar,
  MessageSquare,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const { getAnalytics } = useData();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const analytics = getAnalytics();
  const isAdmin = user?.role === 'admin';

  const navigation = [
    { name: 'Home', href: '/', icon: Building2 },
    { name: 'Dashboard', href: '/dashboard', icon: isAdmin ? BarChart3 : Calendar },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare }
  ];

  const notifications = [
    { id: 1, message: 'Room 3 booking confirmed for 2:00 PM', time: '5 min ago', type: 'success' },
    { id: 2, message: 'Conflict detected in Room 2', time: '10 min ago', type: 'warning' },
    { id: 3, message: 'Weekly usage report available', time: '1 hour ago', type: 'info' }
  ];

  return (
    <header
      style={{
        background: 'white',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem'
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: '#2563eb', borderRadius: '0.5rem' }}>
                <Building2 color="white" size={24} />
              </div>
              <div style={{ display: 'none', smDisplay: 'block' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>Smart Rooms</h1>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Intelligent Booking</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: 'none', mdDisplay: 'flex', gap: '2rem' }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href === '/dashboard' && location.pathname.startsWith('/dashboard'));
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    borderRadius: '0.5rem',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#2563eb' : '#4b5563',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Real-time Stats */}
            <div style={{ display: 'none', lgDisplay: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  background: '#22c55e',
                  borderRadius: '9999px',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span style={{ color: '#4b5563' }}>{analytics.availableRooms} Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  background: '#ef4444',
                  borderRadius: '9999px'
                }}></div>
                <span style={{ color: '#4b5563' }}>{analytics.bookedRooms} Booked</span>
              </div>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  padding: '0.5rem',
                  background: 'transparent',
                  borderRadius: '0.5rem',
                  border: 'none',
                  color: '#4b5563',
                  cursor: 'pointer'
                }}
              >
                <Bell size={20} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-0.25rem',
                    right: '-0.25rem',
                    height: '1rem',
                    width: '1rem',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.75rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  3
                </span>
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '0.5rem',
                      width: '20rem',
                      background: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb',
                      zIndex: 50
                    }}
                  >
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Notifications</h3>
                    </div>
                    <div style={{ maxHeight: '16rem', overflowY: 'auto' }}>
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid #f3f4f6',
                            cursor: 'pointer'
                          }}
                        >
                          <p style={{ fontSize: '0.875rem', color: '#111827' }}>{n.message}</p>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: '#2563eb',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User color="white" size={16} />
                </div>
                <div style={{ display: 'none', smDisplay: 'block', textAlign: 'left' }}>
                  <p style={{ fontWeight: 500, color: '#111827' }}>{user?.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>{user?.role}</p>
                </div>
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '0.5rem',
                      width: '12rem',
                      background: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb',
                      zIndex: 50
                    }}
                  >
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user?.email}</p>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard/profile')}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        color: '#374151',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <User size={16} />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        color: '#dc2626',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
