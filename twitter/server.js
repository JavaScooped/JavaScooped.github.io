const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB (Make sure to have MongoDB running locally or provide the connection string)
mongoose.connect('mongodb://localhost:27017/image_text_sharing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const contentSchema = new mongoose.Schema({
  imageUrl: String,
  text: String,
});

const Content = mongoose.model('Content', contentSchema);

// Express Middleware to parse JSON
app.use(express.json());

// API Endpoint to handle content sharing
app.post('/api/share', async (req, res) => {
  const { imageUrl, text } = req.body;
  try {
    const newContent = new Content({ imageUrl, text });
    await newContent.save();
    io.emit('newContent', newContent);
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to share content' });
  }
});

// API Endpoint to fetch all shared content
app.get('/api/content', async (req, res) => {
  try {
    const content = await Content.find();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Socket.IO event when a new client connects
io.on('connection', (socket) => {
  console.log('New client connected');

  // Emit event to send all existing content to the new client
  Content.find()
    .then((content) => {
      socket.emit('existingContent', content);
    })
    .catch((error) => {
      console.error('Error sending existing content:', error);
    });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
