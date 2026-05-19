// Load the Google Gen AI library instead of Anthropic
const { GoogleGenAI } = require('@google/genai');

// Initialize the client with your free Gemini API key
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
});

async function askAI(question) {
  try {
    // Send the prompt over the network to Google's servers
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
    });

    console.log("Gemini Raw Response Object Received!");
    
    // Google's SDK provides a simple text helper property
    const aiTextAnswer = response.text;
    
    console.log("AI Answer:", aiTextAnswer);
    return aiTextAnswer;

  } catch (error) {
    console.error("Google Gemini API Error:", error.message);
    return "Error occurred: " + error.message;
  }
}

module.exports = askAI;


