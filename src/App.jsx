import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
  List,
  ListItem,
  Divider,
} from "@mui/material";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [callId, setCallId] = useState(null);
  const messagesEndRef = useRef(null);

  const ASSISTANT_ID = "2d5787be-50ad-47ff-b702-a9217f97150a";
  const API_KEY = "3ac572c6-065d-4b15-9add-0199f2b3cbc2";
  const BASE_URL = "https://api.vapi.ai";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      if (!callId) {
        // Create new call
        const { data } = await axios.post(
          `${BASE_URL}/call`,
          { assistantId: ASSISTANT_ID },
          { headers: { Authorization: `Bearer ${API_KEY}` } }
        );
        setCallId(data.id);
      }

      // Send message
      const response = await axios.post(
        `${BASE_URL}/call/${callId}/message`,
        { message: input },
        { headers: { Authorization: `Bearer ${API_KEY}` } }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.message.content },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `Error: ${error.response?.data?.message || error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            VAPI.ai Assistant
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ height: 400, overflow: "auto", p: 2, mb: 3 }}>
          <List>
            {messages.map((msg, i) => (
              <React.Fragment key={i}>
                <ListItem
                  sx={{
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: "80%",
                      bgcolor: msg.role === "user" ? "#e3f2fd" : "#f1f8e9",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </Typography>
                    <Typography>{msg.content}</Typography>
                  </Paper>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>
          {isLoading && <CircularProgress sx={{ my: 2 }} />}
        </Paper>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Type your message"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            Send
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
