const RAGService = require('../../services/RAGService');

const RAGResolver = {
  Query: {
    ragQuery: async (_, { content, question }) => {
      try {
        const result = await RAGService.queryDocument(content, question);
        return result;
      } catch (error) {
        console.error('RAG query error:', error);
        throw new Error('Failed to query document');
      }
    },

    ragSummarize: async (_, { content }) => {
      try {
        const result = await RAGService.summarizeDocument(content);
        return result;
      } catch (error) {
        console.error('RAG summarize error:', error);
        throw new Error('Failed to summarize document');
      }
    },

    ragAnalyze: async (_, { content }) => {
      try {
        const result = await RAGService.analyzeDocument(content);
        return result;
      } catch (error) {
        console.error('RAG analyze error:', error);
        throw new Error('Failed to analyze document');
      }
    },

    ragHealth: async () => {
      try {
        const healthy = await RAGService.checkHealth();
        return {
          success: healthy,
          status: healthy ? 'healthy' : 'unhealthy'
        };
      } catch (error) {
        return {
          success: false,
          status: 'error',
          error: error.message
        };
      }
    }
  }
};

module.exports = RAGResolver;
