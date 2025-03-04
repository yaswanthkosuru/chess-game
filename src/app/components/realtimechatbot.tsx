"use client";
import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSyncAlt as RefreshCw } from "react-icons/fa";
import { useChannel } from "ably/react";
import { useBoardSize } from "@/hooks/useBoardSize";
import { useParams, useSearchParams } from "next/navigation";

interface Message {
  text: string;
  sender: string;
  timestamp?: Date;
}

export default function RealTimeChatBot() {
  const boardSize = useBoardSize();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const searchParams = useSearchParams();
  const color = searchParams.get("color");

  // Use Ably for real-time messaging
  const { publish } = useChannel(id as string, "live-chat", (message) => {
    const userMessage: Message = message.data;
    const { sender } = userMessage;
    if (sender === color) return;
    setMessages((prev) => [...prev, userMessage]);
  });

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
    console.log(input, "input");
    const userMessage: Message = {
      text: input,
      sender: color as string,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      await publish("live-chat", userMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const resetChat = () => {
    setMessages([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (date?: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <h3 className="font-medium">Live Chat</h3>
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
              msg.sender === color ? "justify-end" : "justify-start"
            } mb-3`}
          >
            <div
              className={`relative p-3 rounded-2xl max-w-[85%] shadow-md ${
                msg.sender === color
                  ? "bg-green-600 text-white rounded-tr-none"
                  : "bg-white rounded-tl-none"
              }`}
            >
              <p className="text-sm md:text-base">{msg.text}</p>
              <span
                className={`text-xs block mt-1 ${
                  msg.sender === color ? "text-green-100" : "text-gray-500"
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
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Chat message"
          />
          <button
            className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            // onClick={sendMessage}
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
