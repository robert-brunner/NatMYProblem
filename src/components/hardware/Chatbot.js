import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

// Define your endpoint and API key
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatWithGPT3 = async (userInput) => {
    setIsLoading(true);
    try {
      const response = await axios.post(API_ENDPOINT, {
        model: "gpt-3.5-turbo-1106",
        messages: [{"role": "user", "content": userInput}]
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      setIsLoading(false);
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error communicating with the API:', error);
      setIsLoading(false);
      return 'An error occurred.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, user: true }];
    setMessages(newMessages);
    
    setInput(''); //delete the message upon send

    const response = await chatWithGPT3(input);
    setMessages([...newMessages, { text: response, user: false }]);  //trigger for loading bar

  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user ? 'user-message' : 'ai-message'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && 
          <span className="load">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </span>
        }
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
