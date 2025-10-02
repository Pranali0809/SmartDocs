import React, { useState } from 'react';
import '../css/AIChartPanel.css';

const AIChartPanel = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('qa');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: question,
      timestamp: new Date()
    };

    setChatHistory([...chatHistory, userMessage]);
    setQuestion('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'This is a placeholder response. The Python backend integration will provide actual AI-powered answers based on your document content.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`ai-chart-panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="panel-toggle-btn" onClick={onToggle}>
        <span>{isOpen ? '↓' : '↑'}</span>
        <span className="panel-label">AI Assistant & Charts</span>
      </div>

      {isOpen && (
        <div className="panel-content">
          <div className="panel-tabs">
            <button
              className={`panel-tab ${activeTab === 'qa' ? 'active' : ''}`}
              onClick={() => setActiveTab('qa')}
            >
              <span className="tab-icon">🤖</span>
              Q&A
            </button>
            <button
              className={`panel-tab ${activeTab === 'charts' ? 'active' : ''}`}
              onClick={() => setActiveTab('charts')}
            >
              <span className="tab-icon">📊</span>
              Charts
            </button>
            <button
              className={`panel-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="tab-icon">📈</span>
              Analytics
            </button>
          </div>

          <div className="panel-body">
            {activeTab === 'qa' && (
              <div className="qa-section">
                <div className="qa-chat">
                  {chatHistory.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">💡</span>
                      <h4>Ask questions about your document</h4>
                      <p>Get AI-powered insights and answers based on your content</p>
                    </div>
                  ) : (
                    <div className="chat-messages">
                      {chatHistory.map((msg) => (
                        <div key={msg.id} className={`qa-message ${msg.type}`}>
                          <div className="message-bubble">
                            {msg.text}
                          </div>
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
                    placeholder="Ask a question about this document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <button type="submit" className="qa-send-btn" disabled={!question.trim() || isLoading}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="charts-section">
                <div className="chart-placeholder">
                  <span className="chart-icon">📊</span>
                  <h4>Document Visualizations</h4>
                  <p>Charts and graphs will be displayed here</p>
                  <div className="chart-samples">
                    <div className="sample-chart">
                      <div className="chart-title">Word Frequency</div>
                      <div className="bar-chart">
                        <div className="bar" style={{ height: '80%' }}></div>
                        <div className="bar" style={{ height: '60%' }}></div>
                        <div className="bar" style={{ height: '90%' }}></div>
                        <div className="bar" style={{ height: '40%' }}></div>
                        <div className="bar" style={{ height: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="analytics-section">
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <div className="card-icon">📝</div>
                    <div className="card-content">
                      <div className="card-value">1,234</div>
                      <div className="card-label">Total Words</div>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="card-icon">⏱️</div>
                    <div className="card-content">
                      <div className="card-value">15 min</div>
                      <div className="card-label">Avg. Read Time</div>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="card-icon">🎯</div>
                    <div className="card-content">
                      <div className="card-value">92%</div>
                      <div className="card-label">Readability</div>
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="card-icon">✏️</div>
                    <div className="card-content">
                      <div className="card-value">47</div>
                      <div className="card-label">Total Edits</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChartPanel;
