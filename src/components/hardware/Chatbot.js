import React, { useState } from 'react';
import axios from 'axios';

// Define your endpoint and API key
const API_ENDPOINT = 'https://api.openai.com/v1/engines/davinci/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const chatWithGPT3 = async (userInput) => {
    try {
      const response = await axios.post(API_ENDPOINT, {
        prompt: userInput,
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error communicating with the API:', error);
      return 'An error occurred.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { text: input, user: true }]);
    const response = await chatWithGPT3(input);
    setMessages([...messages, { text: input, user: true }, { text: response, user: false }]);
    setInput('');
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot interface */}
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user ? 'user-message' : 'ai-message'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
