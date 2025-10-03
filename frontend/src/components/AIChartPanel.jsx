import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { RAG_QUERY, RAG_SUMMARIZE, RAG_ANALYZE } from '../queries/RAG';
import '../css/AIChartPanel.css';

const AIChartPanel = ({ isOpen, onToggle, documentContent }) => {
  const [activeTab, setActiveTab] = useState('qa');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [ragQuery] = useLazyQuery(RAG_QUERY);
  const [ragSummarize] = useLazyQuery(RAG_SUMMARIZE);
  const [ragAnalyze] = useLazyQuery(RAG_ANALYZE);

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
                {!analytics ? (
                  <div className="empty-state">
                    <span className="empty-icon">📈</span>
                    <h4>Document Analytics</h4>
                    <p>Get detailed insights about your document</p>
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
                          <div className="card-label">Total Words</div>
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
                      🔄 Refresh Analysis
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChartPanel;
