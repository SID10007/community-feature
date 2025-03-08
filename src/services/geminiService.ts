
// This service would integrate with Google's Gemini API
// For the demo, we're using mock implementations

// The actual API key would be used in a backend service, not directly in the frontend
const GOOGLE_API_KEY = "AIzaSyCqNzDqQ6grXOKAdLIkOKjcD0AIqApNcGg";

export const translateContent = async (content: string, targetLanguage: string): Promise<string> => {
  console.log(`[MOCK] Translating content to ${targetLanguage} using Gemini`);
  
  // In a real implementation, this would call the Gemini API
  // For demo purposes, we'll return mock translations
  
  if (targetLanguage === 'Hindi' && content.includes('loan')) {
    return 'कैसे एक छोटे व्यवसाय के लिए ऋण प्राप्त करें? मेरे पास एक छोटा डेयरी फार्म है और मैं अपने व्यवसाय का विस्तार करना चाहता हूं। मुझे सरकारी योजनाओं या बैंकों के बारे में जानकारी चाहिए जो न्यूनतम कागजी कार्रवाई के साथ ग्रामीण उद्यमियों को ऋण प्रदान करते हैं।';
  }
  
  if (targetLanguage === 'Hindi') {
    return 'हिंदी में अनुवादित सामग्री';
  }
  
  // Default case - return original content if we're translating back to English
  return content;
};

export const processVoiceInput = async (audioData: string): Promise<string> => {
  console.log('[MOCK] Processing voice input with Gemini');
  
  // In a real implementation, this would:
  // 1. Convert audio to text using a speech-to-text service
  // 2. Send the text to Gemini to extract structured information
  
  // For demo purposes, we'll return a mock result
  return "How to apply for a small business loan?";
};

export const extractQuestionDetails = async (voiceText: string): Promise<{
  question: string;
  description: string;
  name?: string;
  tags: string[];
}> => {
  console.log('[MOCK] Extracting question details with Gemini');
  
  // In a real implementation, this would send the text to Gemini
  // For demo purposes, we'll return a mock result
  
  return {
    question: "How to apply for a small business loan?",
    description: "I have a small dairy farm and want to expand my business. I need information about government schemes or banks that provide loans to rural entrepreneurs with minimal paperwork.",
    name: "Ramesh Kumar",
    tags: ["business loan", "agriculture", "government scheme"]
  };
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
