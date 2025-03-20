import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { Box, IconButton, Typography } from '@mui/material';
// import MicIcon from '@mui/icons-material/Mic';
// import MicOffIcon from '@mui/icons-material/MicOff';

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