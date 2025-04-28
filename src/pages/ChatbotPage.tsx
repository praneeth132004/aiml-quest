import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot } from 'lucide-react'; // Import Bot icon

// --- Configuration ---
// --- Configuration ---
// !!! SECURITY WARNING !!!
// Hardcoding API keys in the frontend is insecure and exposes your key.
// It's strongly recommended to use a backend proxy instead.
const GROQ_API_KEY = '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';
const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'llama3-8b-8192'; // Or your preferred Groq model

const SYSTEM_PROMPT = `
You are a professional and friendly programming tutor.
Your goal is to help users understand programming concepts, debug code, and learn best practices.
Be patient, explain concepts clearly, provide examples, and ask clarifying questions.
Keep track of the conversation history to provide contextually relevant assistance.
Respond in Markdown format.
`;

// --- Types ---
interface Message {
  role: 'user' | 'assistant' | 'system'; // 'system' for initial prompt
  content: string;
}

// --- Chatbot Component ---
const ChatbotPage: React.FC = () => { // Renamed component to match filename convention
  // State for messages, input, loading, and errors
  const [messages, setMessages] = useState<Message[]>([
    // Initialize with the system prompt (won't be displayed directly)
    // and a welcome message from the assistant.
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'assistant', content: "Hello! I'm your programming tutor. How can I help you today?" }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for scrolling to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Send Message Function ---
  const sendMessage = useCallback(async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput) return; // Don't send empty messages

    // Add user message to the chat display
    const newUserMessage: Message = { role: 'user', content: trimmedInput };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setUserInput(''); // Clear input field
    setIsLoading(true); // Show loading indicator
    setError(null); // Clear previous errors

    try {
      // Direct call to Groq API (Insecure - Key exposed)
      const response = await fetch(GROQ_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`, // Use the hardcoded key
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: updatedMessages, // Send full history including system prompt
          temperature: 0.7, // Optional: Adjust creativity
        }),
      });

      if (!response.ok) {
        // Handle HTTP errors from Groq API
        const errorData = await response.json();
        console.error("Groq API Error Response:", errorData);
        throw new Error(errorData.error?.message || `API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract the assistant's response from the Groq API structure
      const assistantReply = data.choices?.[0]?.message?.content;

      if (assistantReply) {
        const assistantMessage: Message = { role: 'assistant', content: assistantReply.trim() };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      } else {
        console.error("Unexpected Groq API response structure:", data);
        throw new Error("Received an unexpected or empty response from the AI.");
      }

    } catch (err: any) {
      console.error("Error calling Groq API:", err);
      const errorMessage = `Failed to get response: ${err.message}. Check the console for details.`;
      setError(errorMessage);
      // Add an error message to the chat
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error: ${err.message}` }]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  }, [userInput, messages]); // Dependencies for useCallback

  // Handle Enter key press in input
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  // --- Render Component ---
  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold text-center">Programming Tutor Chat</h1>
      </header>

      {/* Chat Messages Area */}
      {/* Removed overflow-y-auto to disable scrollbar */}
      <div className="flex-1 p-4 space-y-4">
        {messages.filter(msg => msg.role !== 'system').map((message, index) => ( // Don't display system message
          <div
            key={index}
            className={`flex items-end space-x-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} // Added items-end and space-x-2
          >
            {/* Conditionally render Bot avatar for assistant messages */}
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mb-1">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <div
              className={`max-w-lg lg:max-w-xl px-4 py-2 rounded-lg shadow ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
              }`}
            >
              {/* Basic Markdown rendering (bold/italics) - consider a library for full Markdown */}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg shadow bg-white text-gray-500 rounded-bl-none animate-pulse">
              Typing...
            </div>
          </div>
        )}
        {/* Error Message */}
        {error && (
           <div className="flex justify-start">
             <div className="px-4 py-2 rounded-lg shadow bg-red-100 text-red-700 rounded-bl-none">
                Error: {error}
             </div>
           </div>
        )}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 shadow-inner">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a programming question..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading} // Disable input while loading
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || userInput.trim().length === 0} // Disable button if loading or input empty
            className={`px-5 py-2 rounded-full text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
              isLoading || userInput.trim().length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage; // Export the main component
