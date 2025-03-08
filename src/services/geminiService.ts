// This service would integrate with Google's Gemini API
// For the demo, we're using mock implementations

// The actual API key would be used in a backend service, not directly in the frontend
const GOOGLE_API_KEY = "AIzaSyCqNzDqQ6grXOKAdLIkOKjcD0AIqApNcGg";

export const translateContent = async (content: string, targetLanguage: string): Promise<string> => {
  console.log(`Translating content to ${targetLanguage} using Gemini`);
  
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GOOGLE_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate the following text to ${targetLanguage}: ${content}`
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    // Fallback in case of error
    if (targetLanguage === 'Hindi' && content.includes('loan')) {
      return 'कैसे एक छोटे व्यवसाय के लिए ऋण प्राप्त करें? मेरे पास एक छोटा डेयरी फार्म है और मैं अपने व्यवसाय का विस्तार करना चाहता हूं। मुझे सरकारी योजनाओं या बैंकों के बारे में जानकारी चाहिए जो न्यूनतम कागजी कार्रवाई के साथ ग्रामीण उद्यमियों को ऋण प्रदान करते हैं।';
    }
    
    if (targetLanguage === 'Hindi') {
      return 'हिंदी में अनुवादित सामग्री';
    }
    
    // Default case - return original content if we're translating back to English
    return content;
    
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to default in case of API errors
    return content;
  }
};

export const processVoiceInput = async (transcribedText: string): Promise<string> => {
  console.log('Processing voice input with Gemini:', transcribedText);
  
  try {
    // Send the transcribed text to Gemini for processing
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GOOGLE_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Extract the main search query from this text: ${transcribedText}`
          }]
        }]
      })
    });

    const data = await response.json();
    console.log('Gemini response for processing voice input:', data);
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    
    // If API fails, return the original transcribed text
    return transcribedText;
  } catch (error) {
    console.error('Voice processing error:', error);
    return transcribedText;
  }
};

export const extractQuestionDetails = async (transcribedText: string): Promise<{
  question: string;
  description: string;
  name?: string;
  tags: string[];
}> => {
  console.log('Extracting question details with Gemini from:', transcribedText);
  
  try {
    const prompt = `
      I need you to extract structured information from the following voice input about a financial question:
      
      "${transcribedText}"
      
      Please extract and return ONLY the following fields in JSON format:
      1. question: A concise title for the question (max 100 characters)
      2. description: Detailed description of the question
      3. name: The person's name if mentioned (can be null)
      4. tags: An array of 2-5 relevant tags for categorizing this question
      
      Return ONLY valid JSON with these fields.
    `;
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GOOGLE_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    console.log('Gemini response for extracting question details:', data);
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      try {
        // Try to parse the JSON response
        const jsonText = data.candidates[0].content.parts[0].text;
        // Find and extract JSON if it's within code blocks or other text
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : jsonText;
        
        const result = JSON.parse(jsonString);
        return {
          question: result.question || "How can I apply for a farming subsidy?",
          description: result.description || "I need to understand the process for applying for agricultural subsidies for my small farm.",
          name: result.name,
          tags: Array.isArray(result.tags) ? result.tags : ["farming", "subsidy", "agriculture"]
        };
      } catch (e) {
        console.error('Failed to parse Gemini JSON response:', e);
        throw e;
      }
    }
    
    throw new Error("Failed to get a valid response from Gemini");
  } catch (error) {
    console.error('Question extraction error:', error);
    throw error;
  }
};

// Mock data for initial questions
export const getMockQuestions = () => [
  {
    id: "q1",
    title: "How to apply for Kisan Credit Card?",
    description: "I am a small farmer and want to apply for a Kisan Credit Card. What are the requirements and where can I apply?",
    author: {
      name: "Suresh Patel",
      avatar: "",
    },
    tags: ["kisan", "credit", "agriculture"],
    answerCount: 3,
    createdAt: "2 days ago",
  },
  {
    id: "q2",
    title: "What are the requirements for Pradhan Mantri Awas Yojana (PMAY)?",
    description: "I want to build a house in my village. Can I get financial assistance through the PMAY scheme?",
    author: {
      name: "Geeta Devi",
      avatar: "",
    },
    tags: ["housing", "PMAY", "government scheme"],
    answerCount: 5,
    createdAt: "1 week ago",
  },
  {
    id: "q3",
    title: "How to open a Jan Dhan account?",
    description: "I don't have a bank account and want to open a Jan Dhan account. What documents do I need?",
    author: {
      name: "Rajesh Kumar",
      avatar: "",
    },
    tags: ["banking", "jan dhan", "account"],
    answerCount: 4,
    createdAt: "3 days ago",
  },
  {
    id: "q4",
    title: "Insurance schemes for crops",
    description: "What are the government insurance schemes available for protecting crops from natural disasters?",
    author: {
      name: "Mohan Singh",
      avatar: "",
    },
    tags: ["insurance", "agriculture", "crop protection"],
    answerCount: 2,
    createdAt: "5 days ago",
  },
  {
    id: "q5",
    title: "Pension schemes for rural citizens",
    description: "I am 58 years old and want to know about pension schemes available for rural citizens.",
    author: {
      name: "Lakshmi Devi",
      avatar: "",
    },
    tags: ["pension", "elderly", "social security"],
    answerCount: 3,
    createdAt: "2 weeks ago",
  }
];

// Mock answer data
export const getMockAnswers = (questionId: string) => [
  {
    id: "a1",
    content: "To apply for a Kisan Credit Card, visit your nearest bank branch or cooperative society with your land records, identity proof, and address proof. The application process is simple, and you can get a credit limit based on your land holdings and crop pattern.",
    author: {
      name: "Bank Manager",
      avatar: "",
    },
    createdAt: "1 day ago",
    isAccepted: true,
  },
  {
    id: "a2",
    content: "I recently got my Kisan Credit Card. Make sure you also bring your Aadhaar card and a passport-sized photograph. Some banks also ask for a soil health card if you have one. The interest rate is subsidized if you repay on time.",
    author: {
      name: "Ramesh Farmer",
      avatar: "",
    },
    createdAt: "20 hours ago",
    isAccepted: false,
  }
];
