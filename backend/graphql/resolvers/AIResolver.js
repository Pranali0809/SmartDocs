const AIService = require('../../services/AIService');

const aiResolver = {
  Query: {
    async getAISuggestion(_, { context, currentWord }, contextObj) {
      console.log("🤖 GraphQL getAISuggestion called:", { context: context?.substring(0, 50), currentWord });
      
      try {
        if (!context && !currentWord) {
          throw new Error('Context or current word is required');
        }

        const suggestion = await AIService.generateSuggestion(context, currentWord);
        console.log("✅ AI suggestion result:", suggestion);
        
        return {
          suggestion,
          success: true,
        };
      } catch (error) {
        console.error('❌ AI Suggestion GraphQL Error:', error);
        return {
          suggestion: '',
          success: false,
          error: error.message,
        };
      }
    },

    async getSmartSuggestion(_, { fullText, cursorPosition }, contextObj) {
      console.log("🧠 GraphQL getSmartSuggestion called:", { 
        fullTextLength: fullText?.length, 
        cursorPosition 
      });
      
      try {
        if (!fullText) {
          throw new Error('Full text is required');
        }

        const suggestion = await AIService.generateSmartSuggestion(fullText, cursorPosition);
        console.log("✅ Smart AI suggestion result:", suggestion);
        
        return {
          suggestion,
          success: true,
        };
      } catch (error) {
        console.error('❌ Smart AI Suggestion GraphQL Error:', error);
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