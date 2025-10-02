import React, { useState, useRef, useEffect } from 'react';
import '../css/CollaborationChat.css';

const CollaborationChat = ({ isOpen, onToggle, currentUser }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'John Doe',
      text: 'Hey team, let\'s review this section',
      timestamp: new Date(Date.now() - 300000),
      color: '#4285f4'
    },
    {
      id: 2,
      user: 'Jane Smith',
      text: 'Looks good to me!',
      timestamp: new Date(Date.now() - 120000),
      color: '#ea4335'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: currentUser?.name || 'You',
        text: newMessage,
        timestamp: new Date(),
        color: currentUser?.color || '#34a853'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className={`collaboration-chat ${isOpen ? 'open' : 'closed'}`}>
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">💬</span>
          <h4>Team Chat</h4>
          <span className="chat-count">{messages.length}</span>
        </div>
        <button className="chat-toggle-btn" onClick={onToggle}>
          {isOpen ? '−' : '+'}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className="chat-message">
                <div
                  className="message-avatar"
                  style={{ backgroundColor: message.color }}
                >
                  {message.user.charAt(0)}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-user">{message.user}</span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CollaborationChat;
