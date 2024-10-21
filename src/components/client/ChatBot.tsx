"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const ChatBot = () => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleConvertTextToText = async () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }
    setError(null);
    setIsLoading(true);

    const newMessage: Message = { sender: "user", text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await axios.post("/api/get-response", { text });
      const aiMessage: Message = { sender: "ai", text: response.data.result };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);

      setText(""); 
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        err.response?.data?.error || "Failed to get response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Personal ChatBot</h1>

      <div className="space-y-4">
        <div className="h-64 overflow-y-auto border p-4 rounded-md bg-gray-100">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                } p-2 rounded-md max-w-xs break-words`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for response"
          className="w-full p-2 border rounded-md min-h-[80px]"
          disabled={isLoading}
        />

        <button
          onClick={handleConvertTextToText}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md ${
            isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors`}
        >
          {isLoading ? "Processing..." : "Get Response"}
        </button>

        {error && (
          <p className="text-red-500 p-2 bg-red-50 rounded-md">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
