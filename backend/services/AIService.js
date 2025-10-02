const { HfInference } = require('@huggingface/inference');

class AIService {
  constructor() {
    console.log("🤖 Initializing AI Service...");
    // if (!process.env.HF_API_KEY) {
    //   console.error("❌ HUGGINGFACE_API_KEY not found in environment variables");
    //   throw new Error("Hugging Face API key is required");
    // }
    // console.log("✅ Hugging Face API key found:", process.env.HF_API_KEY.substring(0, 10) + "...");

    this.hf = new HfInference("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");

    const textGenerationModels = [
      'gpt2',
      'distilgpt2',
      'EleutherAI/gpt-neo-125m',
      'EleutherAI/gpt-neo-1.3B',
      'EleutherAI/gpt-neo-2.7B',
      'EleutherAI/gpt-j-6b',
      'bigscience/bloom-560m',
      'bigscience/bloom-1b1',
      'microsoft/DialoGPT-medium',
      'microsoft/DialoGPT-large',
      'mistralai/Mistral-7B-v0.1',
      'mistralai/Mistral-7B-Instruct-v0.1',
      'meta-llama/Llama-2-7b-hf',
      'meta-llama/Llama-2-7b-chat-hf',
      'tiiuae/falcon-7b',
      'tiiuae/falcon-7b-instruct',
      'google/flan-t5-base',
      'google/flan-t5-large'
    ];

    this.model = process.env.HF_API_KEY || 'gpt2';

    if (!textGenerationModels.includes(this.model) && !this.model.includes('gpt') && !this.model.includes('llama') && !this.model.includes('mistral') && !this.model.includes('falcon')) {
      console.warn(`⚠️ Warning: Model '${this.model}' may not support text generation. Defaulting to 'gpt2'.`);
      console.warn(`⚠️ Supported models: ${textGenerationModels.join(', ')}`);
      this.model = 'gpt2';
    }

    console.log("✅ Using Hugging Face model:", this.model);
  }

  async generateSuggestion(context, currentWord) {
    console.log("🤖 Generating suggestion:", { context: context?.substring(0, 50), currentWord });

    try {
      const prompt = `${context} ${currentWord}`;

      console.log("🚀 Making Hugging Face API call...");
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 20,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
          do_sample: true,
        }
      });

      const suggestion = response.generated_text?.trim();
      console.log("✅ AI suggestion received:", suggestion);
      return suggestion || '';
    } catch (error) {
      console.error('❌ AI Service Error:', error.message);
      if (error.response) {
        console.error('❌ Hugging Face API Error Response:', JSON.stringify(error.response));
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
      const beforeCursor = fullText.substring(0, cursorPosition);

      const words = beforeCursor.trim().split(/\s+/);
      const lastWord = words[words.length - 1] || '';
      const context = words.slice(-10).join(' ');

      console.log("📝 Text analysis:", {
        lastWord,
        context,
        wordsCount: words.length
      });

      if (lastWord.length < 2) {
        console.log("🚫 Last word too short, returning empty");
        return '';
      }

      const prompt = `${context} ${lastWord}`;

      console.log("🚀 Making smart Hugging Face API call...");
      const response = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 30,
          temperature: 0.5,
          top_p: 0.9,
          return_full_text: false,
          do_sample: true,
        }
      });

      const suggestion = response.generated_text?.trim();
      console.log("✅ Smart AI suggestion received:", suggestion);
      return suggestion || '';
    } catch (error) {
      console.error('❌ Smart AI Service Error:', error.message);
      if (error.response) {
        console.error('❌ Hugging Face API Error Response:', JSON.stringify(error.response));
      }
      return '';
    }
    return "";
  }
}



module.exports = new AIService();
