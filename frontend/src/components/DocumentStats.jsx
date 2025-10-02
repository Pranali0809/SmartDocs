import React, { useState, useEffect } from 'react';
import '../css/DocumentStats.css';

const DocumentStats = ({ content, createdAt, openedAt }) => {
  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    pages: 0,
    timeOpened: '0m',
    timeCreated: 'Just now'
  });

  useEffect(() => {
    if (content) {
      const text = content.replace(/<[^>]*>/g, '');
      const characters = text.length;
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      const pages = Math.max(1, Math.ceil(characters / 3000));

      setStats(prev => ({
        ...prev,
        characters,
        words,
        pages
      }));
    }
  }, [content]);

  useEffect(() => {
    const calculateTime = () => {
      if (openedAt) {
        const now = Date.now();
        const opened = typeof openedAt === 'number' ? openedAt : new Date(openedAt).getTime();
        const diff = now - opened;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
          setStats(prev => ({ ...prev, timeOpened: `${hours}h ${minutes % 60}m` }));
        } else {
          setStats(prev => ({ ...prev, timeOpened: `${minutes}m` }));
        }
      }

      if (createdAt) {
        const now = Date.now();
        const created = typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime();
        const diff = now - created;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor(diff / 60000);

        let timeCreated;
        if (days > 0) {
          timeCreated = `${days}d ago`;
        } else if (hours > 0) {
          timeCreated = `${hours}h ago`;
        } else if (minutes > 0) {
          timeCreated = `${minutes}m ago`;
        } else {
          timeCreated = 'Just now';
        }

        setStats(prev => ({ ...prev, timeCreated }));
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);

    return () => clearInterval(interval);
  }, [openedAt, createdAt]);

  return (
    <div className="document-stats">
      <div className="stat-item">
        <span className="stat-value">{stats.characters}</span>
        <span className="stat-label">characters</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-item">
        <span className="stat-value">{stats.words}</span>
        <span className="stat-label">words</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-item">
        <span className="stat-value">{stats.pages}</span>
        <span className="stat-label">pages</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-item">
        <span className="stat-value">{stats.timeOpened}</span>
        <span className="stat-label">opened</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-item">
        <span className="stat-value">{stats.timeCreated}</span>
        <span className="stat-label">created</span>
      </div>
    </div>
  );
};

export default DocumentStats;
