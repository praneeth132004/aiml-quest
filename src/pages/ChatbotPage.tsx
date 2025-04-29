import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bot, Send, Copy, Check } from "lucide-react"; // Import relevant icons
import ReactMarkdown from "react-markdown"; // Parses Markdown content
import remarkGfm from "remark-gfm"; // Plugin for GitHub Flavored Markdown (tables, code blocks, etc.)
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // For code syntax highlighting
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Choose a theme (e.g., vscDarkPlus)

// --- Configuration ---
// !!! SECURITY WARNING !!! - Keep your API key secure, preferably via a backend proxy.
const GROQ_API_KEY = "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"; // <-- Replace or use environment variables securely
const GROQ_API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "llama3-8b-8192";

// --- System Prompt ---
const SYSTEM_PROMPT = `
You are a professional and friendly programming tutor.
Your goal is to help users understand programming concepts, debug code, and learn best practices.
Be patient, explain concepts clearly, provide examples, and ask clarifying questions.
Keep track of the conversation history to provide contextually relevant assistance.
Respond in Markdown format. Use standard Markdown code blocks (triple backticks) for code examples, specifying the language where possible (e.g., \`\`\`python ... \`\`\`).
`;

// --- Types ---
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// --- Custom Code Block Component ---
// This component renders code blocks with syntax highlighting and a copy button.
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, ""); // Extract code text

  // Function to copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
      },
      (err) => {
        console.error("Failed to copy code: ", err);
        // Optional: Show an error message to the user
      },
    );
  };

  // Render inline code differently (optional, could just use default)
  if (inline) {
    return <code className="bg-gray-200 px-1 rounded text-sm">{children}</code>;
  }

  // Render block code with syntax highlighting and copy button
  return !match ? (
    // Fallback for code blocks without a language specified
    <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto relative group text-sm my-2">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-gray-600 hover:bg-gray-500 rounded text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <code>{children}</code>
    </pre>
  ) : (
    // Render with syntax highlighting
    <div className="relative group my-2">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <SyntaxHighlighter
        // @ts-ignore // Ignore type error for style prop if necessary
        style={vscDarkPlus} // Apply the chosen theme
        language={match[1]} // Detected language
        PreTag="div" // Use div instead of pre to avoid nesting issues
        className="rounded-md p-4 text-sm !bg-gray-800" // Override default background if needed, add padding
        wrapLongLines={true} // Optional: wrap long lines
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

// --- Chatbot Component ---
const ChatbotPage: React.FC = () => {
  // --- State Management ---
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "assistant",
      content:
        "Hello! I'm your programming tutor. How can I help you today? Ask me for code examples!",
    },
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Refs ---
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Core Logic: Sending Messages ---
  const sendMessage = useCallback(async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    const newUserMessage: Message = { role: "user", content: trimmedInput };
    const updatedMessagesForApi = [...messages, newUserMessage];

    setMessages(updatedMessagesForApi);
    setUserInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(GROQ_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: updatedMessagesForApi,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error("Groq API Error Response:", errorData);
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorData = { error: { message: `HTTP error ${response.status}` } };
        }
        throw new Error(
          errorData.error?.message || `API error: ${response.statusText}`,
        );
      }

      const data = await response.json();
      const assistantReply = data.choices?.[0]?.message?.content;

      if (assistantReply) {
        const assistantMessage: Message = {
          role: "assistant",
          content: assistantReply.trim(),
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } else {
        console.error("Unexpected Groq API response structure:", data);
        throw new Error(
          "Received an unexpected or empty response from the AI.",
        );
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      const errorMessage = `Failed to get response: ${err.message}. See console for details.`;
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, messages, isLoading]);

  // --- Event Handlers ---
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  // --- Render Component ---
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md flex-shrink-0 h-16 flex items-center justify-center">
        <h1 className="text-xl font-semibold">Programming Tutor Chat</h1>
      </header>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4">
        {messages
          .filter((msg) => msg.role !== "system")
          .map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                // Changed to items-start for better alignment with multi-line messages
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Assistant Avatar */}
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mt-1 border border-gray-300">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-xl lg:max-w-2xl ${
                  // Removed padding/rounding here, will be handled by Markdown/CodeBlock
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-xl rounded-br-lg shadow-sm px-4 py-2.5" // User bubble style
                    : "bg-white text-gray-800 border border-gray-200 rounded-xl rounded-bl-lg shadow-sm" // Assistant bubble base style (padding added below)
                }`}
              >
                {/* Render content using ReactMarkdown */}
                {/* Apply padding only if it's not a user message (handled above) */}
                {/* Apply prose styles to the container div */}
                <div
                  className={`${message.role !== "user" ? "px-4 py-2.5" : ""} prose prose-sm max-w-none`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown
                    components={{
                      // Use our custom CodeBlock component to render code elements
                      code: CodeBlock,
                      // Optional: Style other elements like paragraphs, lists, etc.
                      p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props} />
                      ), // Add margin to paragraphs
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal list-inside my-2"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside my-2" {...props} />
                      ),
                    }}
                    // className="prose prose-sm max-w-none" // Removed from here
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* User Avatar Placeholder */}
              {message.role === "user" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-300 mt-1 border border-gray-400">
                  {/* User icon can go here */}
                </div>
              )}
            </div>
          ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start items-end space-x-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mb-1 border border-gray-300">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="px-4 py-2.5 rounded-xl shadow-sm bg-white text-gray-500 border border-gray-200 rounded-bl-lg animate-pulse">
              Typing...
            </div>
          </div>
        )}

        {/* Error Message Display */}
        {error && (
          <div className="flex justify-start items-end space-x-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mb-1 border border-gray-300">
              <Bot className="w-5 h-5 text-red-600" />
            </div>
            <div className="px-4 py-2.5 rounded-xl shadow-sm bg-red-50 text-red-700 border border-red-200 rounded-bl-lg">
              {error}
            </div>
          </div>
        )}

        {/* Scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Increased padding and centered elements */}
      <div className="px-8 py-8 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-center space-x-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a programming question..."
            className="flex-1 border border-gray-300 rounded-full px-6 py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || userInput.trim().length === 0}
            className={`p-4 rounded-full text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center ${
              isLoading || userInput.trim().length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
