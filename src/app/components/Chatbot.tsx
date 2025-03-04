import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSyncAlt as RefreshCw } from "react-icons/fa";
import axios from "axios";
import { useBoardSize } from "@/hooks/useBoardSize";
import { API_URL } from "@/constants";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp?: Date;
}

interface ChatBotProps {
  fenstring: string;
  difficulty?: number;
}

export default function ChatBot({ fenstring, difficulty = 1 }: ChatBotProps) {
  const boardSize = useBoardSize();
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I can help analyze your chess position. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        fen_string: fenstring,
        messages: messages.map((msg) => ({
          text: msg.text,
          sender: msg.sender,
        })),
        question: input,
        difficulty: difficulty,
      });

      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Typing...", sender: "bot" }]);
        scrollToBottom();
      }, 500);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            text:
              response.data.answer ||
              "I couldn't analyze that. Could you try asking differently?",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting to the analysis engine. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        text: "Hello! I can help analyze your chess position. What would you like to know?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="flex w-full flex-col text-black rounded-xl overflow-hidden border border-green-700 shadow-lg bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]"
      style={{
        maxHeight: `${boardSize}px`,
        height: `${boardSize}px`,
      }}
    >
      <div className="bg-green-700 text-white p-3 flex justify-between items-center">
        <h3 className="font-medium">Chess Assistant</h3>
        <button
          onClick={resetChat}
          className="p-1 rounded-full hover:bg-green-600 transition-colors"
          aria-label="Reset conversation"
          title="Reset conversation"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } mb-3`}
          >
            <div
              className={`relative p-3 rounded-2xl max-w-[85%] shadow-md ${
                msg.sender === "user"
                  ? "bg-green-600 text-white rounded-tr-none"
                  : "bg-white rounded-tl-none"
              }`}
            >
              <p className="text-sm md:text-base">{msg.text}</p>
              <span
                className={`text-xs block mt-1 ${
                  msg.sender === "user" ? "text-green-100" : "text-gray-500"
                }`}
              >
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-green-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            className="flex-1 p-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 transition-all"
            placeholder="Ask about your chess position..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            aria-label="Chat message"
          />
          <button
            className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            title="Send message"
            type="submit"
          >
            <FaPaperPlane size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
