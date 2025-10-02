const AIService = require('../../services/AIService');

const aiResolver = {
  Query: {
    

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