// ChatbotPage.jsx
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  Calendar,
  Clock,
  Users,
  MapPin,
  Bot,
  User,
  Sparkles
} from 'lucide-react';

const dummyUser = { name: 'Akshita' };

const dummyRooms = [
  {
    id: '101',
    name: 'Orchid Room',
    capacity: 6,
    status: 'available',
    features: ['Projector', 'Whiteboard']
  },
  {
    id: '102',
    name: 'Lily Room',
    capacity: 4,
    status: 'booked',
    features: ['Video Call', 'AC']
  }
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f9fafb;
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BotBubble = styled.div`
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  padding: 0.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Subtitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const OnlineStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-size: 0.875rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

const InputSection = styled.div`
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 1rem;
  resize: none;
`;

const SendButton = styled.button`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: #2563eb;
  color: white;
  padding: 0.5rem;
  border-radius: 0.75rem;
  &:disabled {
    opacity: 0.5;
  }
`;

const SuggestionBar = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Suggestion = styled.button`
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  &:hover {
    background: #e5e7eb;
  }
`;

const MessageBubble = styled.div`
  background: ${props => (props.type === 'user' ? '#2563eb' : 'white')};
  color: ${props => (props.type === 'user' ? 'white' : '#111827')};
  border: ${props => (props.type === 'user' ? 'none' : '1px solid #e5e7eb')};
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  max-width: 60%;
  align-self: ${props => (props.type === 'user' ? 'flex-end' : 'flex-start')};
  margin-bottom: 1rem;
`;

const ChatbotPage = () => {
  const messagesEndRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      content: `Hi ${dummyUser.name}! I'm your AI assistant. Try saying something like: "Book a quiet room for 2 people at 3 PM".`,
      suggestions: ['Book a room for 4 people', 'Available rooms now', 'Book with projector']
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };

    const botMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: `Booking request received for: "${inputValue}". Checking availability...`,
      suggestions: ['Yes, confirm it!', 'Show me more options']
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BotBubble><Bot size={20} /></BotBubble>
          <div>
            <Title>AI Booking Assistant</Title>
            <Subtitle>Book rooms using natural language</Subtitle>
          </div>
        </div>
        <OnlineStatus>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Online
        </OnlineStatus>
      </Header>

      <MessagesContainer>
        {messages.map(msg => (
          <MessageBubble key={msg.id} type={msg.type}>
            {msg.content}
            {msg.suggestions && (
              <div style={{ marginTop: '0.5rem' }}>
                {msg.suggestions.map((s, i) => (
                  <Suggestion key={i} onClick={() => setInputValue(s)}>
                    {s}
                  </Suggestion>
                ))}
              </div>
            )}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputSection>
        <div style={{ position: 'relative' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={1}
            placeholder="Type a message..."
          />
          <SendButton onClick={sendMessage} disabled={!inputValue.trim()}>
            <Send size={16} />
          </SendButton>
        </div>
        <SuggestionBar>
          <Suggestion onClick={() => setInputValue('Available rooms now')}>
            <Sparkles size={14} /> Show rooms
          </Suggestion>
          <Suggestion onClick={() => setInputValue('Room for 4 people')}>
            <Calendar size={14} /> Book for 4
          </Suggestion>
          <Suggestion onClick={() => setInputValue('Room with projector')}>
            <Users size={14} /> Projector
          </Suggestion>
        </SuggestionBar>
      </InputSection>
    </Container>
  );
};

export default ChatbotPage;
