import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { RAG_QUERY, RAG_SUMMARIZE, RAG_ANALYZE } from '../queries/RAG';
import '../css/RightSidebar.css';

const RightSidebar = ({ isCollapsed, onToggle, documentContent, documentId, userId, userSettings }) => {
  const [activeTab, setActiveTab] = useState('contributions');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [ragQuery] = useLazyQuery(RAG_QUERY);
  const [ragSummarize] = useLazyQuery(RAG_SUMMARIZE);
  const [ragAnalyze] = useLazyQuery(RAG_ANALYZE);

  const contributors = [
    { id: 1, name: 'John Doe', color: '#4285f4', contribution: 450, percentage: 45 },
    { id: 2, name: 'Jane Smith', color: '#ea4335', contribution: 320, percentage: 32 },
    { id: 3, name: 'Bob Wilson', color: '#34a853', contribution: 230, percentage: 23 }
  ];

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !documentContent) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: question,
      timestamp: new Date()
    };

    setChatHistory([...chatHistory, userMessage]);
    const currentQuestion = question;
    setQuestion('');
    setIsLoading(true);

    try {
      const { data } = await ragQuery({
        variables: {
          content: documentContent,
          question: currentQuestion
        }
      });

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: data?.ragQuery?.answer || 'I apologize, but I could not process your question.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('RAG query error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!documentContent) return;
    setIsLoading(true);

    try {
      const { data } = await ragSummarize({
        variables: { content: documentContent }
      });

      if (data?.ragSummarize?.success) {
        setSummary(data.ragSummarize);
        const summaryMessage = {
          id: Date.now(),
          type: 'ai',
          text: `**Document Summary:**\n\n${data.ragSummarize.summary}`,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, summaryMessage]);
      }
    } catch (error) {
      console.error('Summarization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!documentContent) return;
    setIsLoading(true);

    try {
      const { data } = await ragAnalyze({
        variables: { content: documentContent }
      });

      if (data?.ragAnalyze?.success) {
        setAnalytics(data.ragAnalyze);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className={`right-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isCollapsed ? '←' : '→'}
      </button>

      {!isCollapsed && (
        <div className="sidebar-content">
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${activeTab === 'contributions' ? 'active' : ''}`}
              onClick={() => setActiveTab('contributions')}
            >
              👥 Contributors
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'qa' ? 'active' : ''}`}
              onClick={() => setActiveTab('qa')}
            >
              🤖 Q&A
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📊 Analytics
            </button>
          </div>

          <div className="sidebar-body">
            {activeTab === 'contributions' && (
              <div className="contributions-section">
                <h3>Team Contributions</h3>
                <div className="contributors-list">
                  {contributors.map((contributor) => (
                    <div key={contributor.id} className="contributor-item">
                      <div className="contributor-header">
                        <div
                          className="contributor-avatar"
                          style={{ backgroundColor: contributor.color }}
                        >
                          {contributor.name.charAt(0)}
                        </div>
                        <div className="contributor-info">
                          <div className="contributor-name">{contributor.name}</div>
                          <div className="contributor-stats">
                            {contributor.contribution} characters
                          </div>
                        </div>
                        <div className="contributor-percentage">
                          {contributor.percentage}%
                        </div>
                      </div>
                      <div className="contribution-bar">
                        <div
                          className="contribution-fill"
                          style={{
                            width: `${contributor.percentage}%`,
                            backgroundColor: contributor.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="qa-section">
                <h3>Ask AI about this Document</h3>
                <div className="qa-chat">
                  {chatHistory.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">💡</span>
                      <p>Ask questions about your document</p>
                      <button
                        className="summarize-btn"
                        onClick={handleSummarize}
                        disabled={!documentContent || isLoading}
                      >
                        📄 Summarize Document
                      </button>
                    </div>
                  ) : (
                    <div className="chat-messages">
                      {chatHistory.map((msg) => (
                        <div key={msg.id} className={`qa-message ${msg.type}`}>
                          <div className="message-bubble">{msg.text}</div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="qa-message ai">
                          <div className="message-bubble loading">
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <form className="qa-input-form" onSubmit={handleAskQuestion}>
                  <input
                    type="text"
                    className="qa-input"
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="qa-send-btn"
                    disabled={!question.trim() || isLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="analytics-section">
                <h3>Document Analytics</h3>
                {!analytics ? (
                  <div className="empty-state">
                    <span className="empty-icon">📈</span>
                    <p>Get detailed insights</p>
                    <button
                      className="analyze-btn"
                      onClick={handleAnalyze}
                      disabled={!documentContent || isLoading}
                    >
                      {isLoading ? 'Analyzing...' : '🔍 Analyze Document'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="analytics-grid">
                      <div className="analytics-card">
                        <div className="card-icon">📝</div>
                        <div className="card-content">
                          <div className="card-value">{analytics.word_count?.toLocaleString()}</div>
                          <div className="card-label">Words</div>
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-icon">📄</div>
                        <div className="card-content">
                          <div className="card-value">{analytics.sentence_count}</div>
                          <div className="card-label">Sentences</div>
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-icon">🔤</div>
                        <div className="card-content">
                          <div className="card-value">{analytics.character_count?.toLocaleString()}</div>
                          <div className="card-label">Characters</div>
                        </div>
                      </div>
                      <div className="analytics-card">
                        <div className="card-icon">📊</div>
                        <div className="card-content">
                          <div className="card-value">{analytics.average_word_length?.toFixed(1)}</div>
                          <div className="card-label">Avg Word Length</div>
                        </div>
                      </div>
                    </div>
                    {analytics.top_words && analytics.top_words.length > 0 && (
                      <div className="top-words-section">
                        <h4>Most Frequent Words</h4>
                        <div className="top-words-list">
                          {analytics.top_words.slice(0, 10).map((item, idx) => (
                            <div key={idx} className="top-word-item">
                              <span className="word-rank">#{idx + 1}</span>
                              <span className="word-text">{item.word}</span>
                              <span className="word-count">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      className="refresh-btn"
                      onClick={handleAnalyze}
                      disabled={isLoading}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
