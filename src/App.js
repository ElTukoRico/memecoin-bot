import React, { useState } from 'react';
import axios from 'axios';
import pruebaLogo from './prueba.png'; // Import logo
import prueba2 from './prueba2.png';  // Import background image
import './App.css';
import './index.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // For storing chat history
  const [chatResponse, setChatResponse] = useState(''); // For displaying the bot's response

  // Handle sending message and getting a response from OpenAI
  const handleChat = async () => {
    const newMessage = { sender: 'user', message: userMessage };
    setChatHistory([...chatHistory, newMessage]);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions', // Use the correct API endpoint for chat
        {
          model: 'gpt-3.5-turbo',  // Or 'gpt-4'
          messages: [
            { role: 'system', content: 'You are an expert cryptocurrency assistant.' },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Authorization with API Key
          },
        }
      );

      // Get the response text and add it to the chat history
      const botMessage = { sender: 'bot', message: response.data.choices[0].message.content.trim() };
      setChatHistory([...chatHistory, newMessage, botMessage]);

      // Set the bot's response for display
      setChatResponse(response.data.choices[0].message.content.trim());
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

  // Handle Enter key press in the textarea
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleChat();
    }
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

        {/* Display the latest bot response */}
        {chatResponse && (
          <div className="bot-response">
            <strong>Bot:</strong> {chatResponse}
          </div>
        )}

        {/* Chat Input */}
        <div>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyPress}  // Listen for Enter key press
            placeholder="Ask me anything about cryptocurrency..."
            style={{ color: 'black' }}  // Ensure black text for user input
          />
          <button onClick={handleChat}>Send</button>
        </div>
      </header>
    </div>
  );
}

export default App;

