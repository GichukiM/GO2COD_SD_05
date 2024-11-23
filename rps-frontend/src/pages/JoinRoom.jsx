import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from '../utils/socket.js';

const JoinRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [playerName, setPlayerName] = useState('');
  const [enteredRoomId, setEnteredRoomId] = useState('');
  const [error, setError] = useState(''); // To display error message if room not found

  // Extract `roomId` from the URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomIdFromURL = queryParams.get('roomId');
    if (roomIdFromURL) {
      setEnteredRoomId(roomIdFromURL);
    }
  }, [location.search]);

  // Handle socket events
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('player-joined', (roomId, playerName) => {
      if (roomId) {
        navigate(`/${roomId}?name=${playerName}&id=${socket.id}&action=join`);
      }
    });

    socket.on('joined-room', (roomId, playerName) => {
      // Successfully joined room
      navigate(`/${roomId}?name=${playerName}&id=${socket.id}&action=join`);
    });

    socket.on('room-not-found', () => {
      setError('Room not found. Please check the room ID and try again.');
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('player-joined');
      socket.off('joined-room');
      socket.off('room-not-found');
    };
  }, [navigate]);

  // Handle room join
  const handleJoinRoom = () => {
    if (enteredRoomId.trim() && playerName.trim()) {
      setError(''); // Clear error message when user tries to join again
      socket.emit('join-room', enteredRoomId, playerName, socket.id);
    } else {
      alert('Please enter both the Room ID and your name.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="flex flex-col items-center bg-white shadow-lg p-6 m-4 rounded-lg w-3/4 sm:w-1/2 md:w-1/3">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Join Room - Rock Paper Scissors
        </h1>

        {/* Room ID Input */}
        <div className="flex flex-col items-center w-full mb-6">
          <label htmlFor="roomId-input" className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Enter Room ID:
          </label>
          <input
            id="roomId-input"
            type="text"
            aria-label="Enter Room ID"
            placeholder="Enter Room ID"
            value={enteredRoomId}
            onChange={(e) => setEnteredRoomId(e.target.value)}
            className="mt-4 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 bg-transparent"
          />
        </div>

        {/* Player Name Input */}
        <div className="flex flex-col items-center w-full mb-6">
          <label htmlFor="name-input" className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Enter your name:
          </label>
          <input
            id="name-input"
            type="text"
            aria-label="Enter Your Name"
            placeholder="Enter Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="mt-4 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 bg-transparent"
          />
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-lg font-semibold">{error}</div>
        )}

        {/* Join Game Button */}
        <button
          id="start-game-btn"
          aria-label="Start Game"
          disabled={!enteredRoomId.trim() || !playerName.trim()}
          onClick={handleJoinRoom}
          className={`py-2 mt-6 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 ${
            enteredRoomId.trim() && playerName.trim()
              ? 'enabled'
              : 'cursor-not-allowed bg-gray-300'
          }`}
        >
          Join Game
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
