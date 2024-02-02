// // server.js
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = 'YOUR_MONGODB_URI';

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB User Schema
// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   gender: String,
// });

// const User = mongoose.model('User', userSchema);

// // Socket.io
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Handle chat messages here using socket.emit and socket.on

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Express routes
// app.post('/api/signup', async (req, res) => {
//   try {
//     const { username, password, gender } = req.body;
//     const newUser = new User({ username, password, gender });
//     await newUser.save();
//     res.status(200).json({ message: 'User created successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a message schema
const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for new messages
  socket.on('sendMessage', (data) => {
    const { sender, text } = data;

    // Save the message to MongoDB
    const message = new Message({ sender, text });
    message.save();

    // Broadcast the message to all connected clients
    io.emit('messageReceived', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
