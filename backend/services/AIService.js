const OpenAI = require('openai');

class AIService {
  constructor() {
    console.log("🤖 Initializing AI Service...");
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not found in environment variables");
      throw new Error("OpenAI API key is required");
    }
    console.log("✅ OpenAI API key found:", process.env.OPENAI_API_KEY.substring(0, 10) + "...");
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSuggestion(context, currentWord) {
    console.log("🤖 Generating suggestion:", { context: context?.substring(0, 50), currentWord });
    
    try {
      const prompt = `Given the following text context and the current word being typed, provide a single, natural completion suggestion that would make sense in this context. Only return the completion text, nothing else.

Context: "${context}"
Current word: "${currentWord}"

Provide a brief, contextually appropriate completion (1-3 words maximum):`;

      console.log("🚀 Making OpenAI API call...");
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful writing assistant that provides contextual text completions. Always respond with only the completion text, no explanations or additional formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 20,
        temperature: 0.7,
      });

      const suggestion = response.choices[0]?.message?.content?.trim();
      console.log("✅ AI suggestion received:", suggestion);
      return suggestion || '';
    } catch (error) {
      console.error('❌ AI Service Error:', error.message);
      if (error.response) {
        console.error('❌ OpenAI API Error Response:', error.response.data);
      }
      return '';
    }
  }

  async generateSmartSuggestion(fullText, cursorPosition) {
    console.log("🧠 Generating smart suggestion:", { 
      fullTextLength: fullText.length, 
      cursorPosition,
      textAroundCursor: fullText.substring(Math.max(0, cursorPosition - 30), cursorPosition + 30)
    });
    
    try {
      // Extract context around cursor position
      const beforeCursor = fullText.substring(0, cursorPosition);
      const afterCursor = fullText.substring(cursorPosition);
      
      // Get the last few words for context
      const words = beforeCursor.trim().split(/\s+/);
      const lastWord = words[words.length - 1] || '';
      const context = words.slice(-10).join(' '); // Last 10 words for context

      console.log("📝 Text analysis:", {
        lastWord,
        context,
        wordsCount: words.length
      });

      if (lastWord.length < 2) {
        console.log("🚫 Last word too short, returning empty");
        return '';
      }

      const prompt = `Complete this text naturally. Given the context and the incomplete word, suggest a completion:

Context: "${context}"
Incomplete word: "${lastWord}"

Provide only the completion part (what should be added to complete the word or continue the sentence):`;

      console.log("🚀 Making smart OpenAI API call...");
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a smart text completion assistant. Provide only the text that should be added to complete the current word or continue the sentence naturally. No explanations, just the completion text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 30,
        temperature: 0.5,
      });

      const suggestion = response.choices[0]?.message?.content?.trim();
      console.log("✅ Smart AI suggestion received:", suggestion);
      return suggestion || '';
    } catch (error) {
      console.error('❌ Smart AI Service Error:', error.message);
      if (error.response) {
        console.error('❌ OpenAI API Error Response:', error.response.data);
      }
      return '';
    }
  }
}

console.log("🤖 Creating AI Service instance...");
module.exports = new AIService();