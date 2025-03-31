import React, { useState } from 'react';
import axios from 'axios';
import pruebaLogo from './prueba.png'; // Import logo
import prueba2 from './prueba2.png';  // Import background image
import './App.css';
import './index.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // For storing chat history

  // Handle sending message and getting a response from OpenAI
  const handleChat = async () => {
    // Save the user message in the chat history
    const newMessage = { sender: 'user', message: userMessage };
    setChatHistory([...chatHistory, newMessage]);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003', // Use 'gpt-4' for better performance
          prompt: `You are an expert cryptocurrency assistant. Answer the following questions related to crypto. Provide links to reliable sources if needed: \n\nQ: ${userMessage}\nA:`,
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      // Get the response text and add it to the chat history
      const botMessage = { sender: 'bot', message: response.data.choices[0].text.trim() };
      setChatHistory([...chatHistory, newMessage, botMessage]);
      setChatResponse(response.data.choices[0].text.trim());
    } catch (error) {
      console.error('Error getting response from OpenAI:', error);
      setChatResponse('Sorry, there was an error. Please try again.');
    }

    // Clear the input field after sending the message
    setUserMessage('');
  };

  // Set background styles
  const divStyle = {
    backgroundImage: `url(${prueba2})`,   
    backgroundSize: 'cover',               
    backgroundPosition: 'center center',   
    height: '100vh',            
  };

  return (
    <div className="App" style={divStyle}>
      <header className="App-header">
        <img src={pruebaLogo} alt="Logo" className="logo" />
        <h1>Crypto Expert Chatbot</h1>

        {/* Display chat history */}
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={message.sender === 'user' ? 'user-message' : 'bot-message'}>
              <strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong> {message.message}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask me anything about cryptocurrency..."
          />
          <button onClick={handleChat}>Send</button>
        </div>
        <p>{chatResponse}</p>
      </header>
    </div>
  );
}

export default App;
