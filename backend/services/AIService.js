require('dotenv').config();
const { InferenceClient } = require("@huggingface/inference");

class AIService {
  constructor() {
    console.log("🤖 Initializing AI Service with Hugging Face...");
    // if (!process.env.HUGGINGFACE_API_KEY) {
    //   throw new Error("❌ Missing HUGGINGFACE_API_KEY");
    // }
    this.hf = new InferenceClient({
  token: "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",
});
  }

async generateSmartSuggestion(fullText, cursorPosition) {
  const context = fullText.slice(Math.max(0, cursorPosition - 50), cursorPosition + 50);
  console.log("🚀 Calling Hugging Face API with context:", context);

  try {
    // ✅ Use the newer InferenceClient API
    const response = await this.hf.textGeneration({
      model: "facebook/bart-large-cnn", // You can swap with "tiiuae/falcon-7b-instruct" or other free models
      inputs: `Complete this sentence naturally: ${context}`,
      parameters: {
        max_new_tokens: 30,
        temperature: 0.7,
        return_full_text: false // ✅ Only return the generated part
      }
    });

    // Hugging Face returns an array with `generated_text`
    const suggestion = response?.[0]?.generated_text?.trim() || "";
    console.log("✅ HF suggestion:", suggestion);
    return suggestion;
  } catch (error) {
    console.error("❌ Smart AI Service Error:", error.message);
    if (error.response) {
      console.error("❌ Hugging Face API Error Response:", await error.response.text());
    }
    return "";
  }
}

}

module.exports = new AIService();
