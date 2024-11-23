import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/socket.js'; // Assuming you have a centralized socket setup

const CreateRoom = () => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState('');
  const [playerName, setPlayerName] = useState('');

  // Socket connection status
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with socket ID:', socket.id);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  // Handle room creation event
  useEffect(() => {
    socket.on('room-created', (roomId, rounds, playerName) => {
      navigate(`/${roomId}?rounds=${rounds}&name=${playerName}&id=${socket.id}&action=create`);
    });

    socket.on('create-room-response', (response) => {
      if (response.success) {
        console.log('Room created:', response.roomId);
      } else {
        alert('Failed to create room');
      }
    });

    return () => {
      socket.off('room-created');
      socket.off('create-room-response');
    };
  }, [navigate]);

  // Handle game start
  const handleStartGame = () => {
    if (rounds >= 1 && playerName.trim().length > 0) {
      socket.emit('create-room', { rounds, playerName });
    } else {
      alert('Please enter valid rounds and a player name.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="flex flex-col items-center bg-white shadow-lg p-6 m-4 rounded-lg w-3/4 sm:w-1/2 md:w-1/3">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Create Room - Rock Paper Scissors
        </h2>

        <div className="flex flex-col items-center w-full mb-6">
          <label htmlFor="rounds-input" className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Enter total rounds:
          </label>
          <input
            id="rounds-input"
            type="number"
            min="1"
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            placeholder="Enter total rounds"
            className="mt-4 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 bg-transparent"
          />
        </div>

        <div className="flex flex-col items-center w-full mb-6">
          <label htmlFor="name-input" className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Enter your name:
          </label>
          <input
            id="name-input"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="mt-4 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 bg-transparent"
          />
        </div>

        <button
          aria-label="Start Game"
          disabled={!rounds || rounds < 1 || !playerName.trim()}
          onClick={handleStartGame}
          className={`mt-6 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-300 ${rounds >= 1 && playerName.trim() ? 'enabled' : 'cursor-not-allowed bg-gray-300'}`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
