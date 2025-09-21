const AIService = require('../../services/AIService');

const aiResolver = {
  Query: {
    async getAISuggestion(_, { context, currentWord }, contextObj) {
      try {
        if (!context && !currentWord) {
          throw new Error('Context or current word is required');
        }

        const suggestion = await AIService.generateSuggestion(context, currentWord);
        return {
          suggestion,
          success: true,
        };
      } catch (error) {
        console.error('AI Suggestion Error:', error);
        return {
          suggestion: '',
          success: false,
          error: error.message,
        };
      }
    },

    async getSmartSuggestion(_, { fullText, cursorPosition }, contextObj) {
      try {
        if (!fullText) {
          throw new Error('Full text is required');
        }

        const suggestion = await AIService.generateSmartSuggestion(fullText, cursorPosition);
        return {
          suggestion,
          success: true,
        };
      } catch (error) {
        console.error('Smart AI Suggestion Error:', error);
        return {
          suggestion: '',
          success: false,
          error: error.message,
        };
      }
    },
  },
};

module.exports = aiResolver;