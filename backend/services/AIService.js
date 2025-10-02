class AIService {
  constructor() {
    console.log("🤖 Initializing AI Service...");
    if (!process.env.HF_API_KEY) {
      console.error("❌ HF_API_KEY not found in environment variables");
      throw new Error("Hugging Face API key is required");
    }
    console.log("✅ Hugging Face API key found:", process.env.HF_API_KEY.substring(0, 10) + "...");

    this.apiKey = process.env.HF_API_KEY;
    this.apiUrl = 'https://api-inference.huggingface.co/models/';

    const recommendedModels = [
      'mistralai/Mistral-7B-Instruct-v0.2',
      'HuggingFaceH4/zephyr-7b-beta',
      'google/flan-t5-large',
      'google/flan-t5-xxl',
      'bigscience/bloom-1b7',
      'gpt2-large',
      'EleutherAI/gpt-neo-2.7B'
    ];

    this.model = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';

    console.log("✅ Using Hugging Face model:", this.model);
    console.log("💡 Recommended models:", recommendedModels.join(', '));
  }

  async generateSuggestion(context, currentWord) {
    console.log("🤖 Generating suggestion:", { context: context?.substring(0, 50), currentWord });

    try {
      const prompt = `${context} ${currentWord}`;

      console.log("🚀 Making Hugging Face API call...");

      const response = await fetch(`${this.apiUrl}${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 20,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
            do_sample: true,
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Hugging Face API Error:', errorData);
        return '';
      }

      const result = await response.json();
      const suggestion = result[0]?.generated_text?.trim() || result.generated_text?.trim();
      console.log("✅ AI suggestion received:", suggestion);
      return suggestion || '';
    } catch (error) {
      console.error('❌ AI Service Error:', error.message);
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

      const response = await fetch(`${this.apiUrl}${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 30,
            temperature: 0.5,
            top_p: 0.9,
            return_full_text: false,
            do_sample: true,
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Hugging Face API Error:', errorData);
        return '';
      }

      const result = await response.json();
      const suggestion = result[0]?.generated_text?.trim() || result.generated_text?.trim();
      console.log("✅ Smart AI suggestion received:", suggestion);
      return suggestion || '';
    } catch (error) {
      console.error('❌ Smart AI Service Error:', error.message);
      return '';
    }
  }
}



module.exports = new AIService();
