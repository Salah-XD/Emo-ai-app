// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// VAPI.ai Integration - Full Stack Implementation


// STEP 1: Setting up a React frontend with Vite

// First, install Node.js and npm from https://nodejs.org/

// Then, create a new Vite project
// Run these commands in your terminal:
// npm create vite@latest vapi-ai-app -- --template react
// cd vapi-ai-app
// npm install

// STEP 2: Install required dependencies
// npm install axios @mui/material @emotion/react @emotion/styled react-speech-recognition

// STEP 3: Create your React application

// File: src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [assistantId, setAssistantId] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiKey || !assistantId) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call VAPI.ai API
      const response = await axios.post(
        'https://api.vapi.ai/conversation/send-message',
        {
          assistant_id: assistantId,
          message: input
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Add assistant response to chat
      if (response.data && response.data.response) {
        const assistantMessage = { role: 'assistant', content: response.data.response };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      }
    } catch (error) {
      console.error('Error calling VAPI.ai:', error);
      setMessages(prevMessages => [...prevMessages, { 
        role: 'system', 
        content: `Error: ${error.response?.data?.message || error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            VAPI.ai Assistant
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Configuration</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="VAPI.ai API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Assistant ID"
            value={assistantId}
            onChange={(e) => setAssistantId(e.target.value)}
          />
        </Paper>

        <Paper elevation={3} sx={{ height: '400px', overflow: 'auto', p: 2, mb: 3 }}>
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start" sx={{
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      maxWidth: '80%',
                      bgcolor: message.role === 'user' ? '#e3f2fd' : 
                              message.role === 'system' ? '#ffebee' : '#f1f8e9'
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {message.role === 'user' ? 'You' : 
                       message.role === 'assistant' ? 'Assistant' : 'System'}
                    </Typography>
                    <Typography variant="body1">{message.content}</Typography>
                  </Paper>
                </ListItem>
                <Divider variant="middle" />
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>
          {isLoading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Paper>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Type your message"
            variant="outlined"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={isLoading || !apiKey || !assistantId}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;




/* STEP 4: Optional Backend Server for API Key Security
   For production, you should create a backend to securely handle API keys
   Below is a simple Express server for reference */

// File: server.js (create this file in the project root)
/*
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Securely store your API key in a .env file
const VAPI_API_KEY = process.env.VAPI_API_KEY;

app.post('/api/vapi', async (req, res) => {
  try {
    const { assistantId, message } = req.body;
    
    const response = await axios.post(
      'https://api.vapi.ai/conversation/send-message',
      {
        assistant_id: assistantId,
        message: message
      },
      {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error processing request',
      message: error.response?.data?.message || error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

// STEP 5: Add Voice Interface (Optional enhancement)

// File: src/VoiceInterface.jsx
// Add this component if you want voice interaction capabilities
/*
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Box, IconButton, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

const VoiceInterface = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  useEffect(() => {
    if (transcript && !listening && isListening) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, listening, isListening, onTranscript, resetTranscript]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
      <IconButton onClick={toggleListening} color={isListening ? 'secondary' : 'default'}>
        {isListening ? <MicOffIcon /> : <MicIcon />}
      </IconButton>
      <Typography variant="body2" color="textSecondary">
        {isListening ? 'Listening...' : 'Click to speak'}
      </Typography>
    </Box>
  );
};

export default VoiceInterface;
*/

// STEP 6: Run the application
// npm run dev
// Your app will be available at http://localhost:5173/


