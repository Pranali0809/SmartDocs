const axios = require('axios');

class RAGService {
  constructor() {
    this.ragServiceUrl = process.env.RAG_SERVICE_URL || 'http://localhost:5000';
    console.log('🤖 RAG Service initialized with URL:', this.ragServiceUrl);
  }

  async queryDocument(content, question) {
    try {
      console.log('📝 Querying document with question:', question.substring(0, 50));

      const response = await axios.post(`${this.ragServiceUrl}/api/rag/query`, {
        content,
        question
      }, {
        timeout: 30000
      });

      console.log('✅ RAG query successful');
      return {
        success: true,
        answer: response.data.answer,
        context: response.data.context_used,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      console.error('❌ RAG query error:', error.message);
      return {
        success: false,
        error: error.message,
        answer: 'I apologize, but I encountered an error processing your question. Please try again.'
      };
    }
  }

  async summarizeDocument(content) {
    try {
      console.log('📄 Summarizing document...');

      const response = await axios.post(`${this.ragServiceUrl}/api/rag/summarize`, {
        content
      }, {
        timeout: 30000
      });

      console.log('✅ Summarization successful');
      return {
        success: true,
        summary: response.data.summary,
        statistics: response.data.statistics,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      console.error('❌ Summarization error:', error.message);
      return {
        success: false,
        error: error.message,
        summary: 'Unable to generate summary at this time.'
      };
    }
  }

  async analyzeDocument(content) {
    try {
      console.log('🔍 Analyzing document...');

      const response = await axios.post(`${this.ragServiceUrl}/api/rag/analyze`, {
        content
      }, {
        timeout: 30000
      });

      console.log('✅ Analysis successful');
      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('❌ Analysis error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.ragServiceUrl}/health`, {
        timeout: 5000
      });
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('❌ RAG service health check failed:', error.message);
      return false;
    }
  }
}

module.exports = new RAGService();
