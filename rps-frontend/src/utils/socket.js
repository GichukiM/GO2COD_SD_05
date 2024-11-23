// utils/socket.js
import { io } from 'socket.io-client';

// Replace with your backend's URL
const SERVER_URL = 'https://rps-backend-4757.onrender.com';

const socket = io(SERVER_URL, {
  autoConnect: true,
  reconnectionAttempts: 5, // Optional: Retry connecting 5 times
  transports: ['websocket'], // Use WebSocket as the transport
});

export default socket;
