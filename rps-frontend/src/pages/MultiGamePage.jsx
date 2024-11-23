import { useParams, useSearchParams } from 'react-router-dom';
import MultiGame from '../components/MultiGame'; // Directly import MultiGame

const MultiGamePage = () => {
  // Extract parameters from URL and query string
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();

  // Get search parameters with default values where applicable
  const playerName = searchParams.get('name');
  const socketId = searchParams.get('id');
  const action = searchParams.get('action');
  const rounds = searchParams.get('rounds') || 5;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 px-4">
      <h1 className="text-2xl font-bold text-center text-white my-4">
        Multiplayer Game Room
      </h1>

      {/* Pass the extracted parameters directly to the MultiGame component */}
      <MultiGame
        roomId={roomId}
        playerName={playerName}
        socketId={socketId}
        action={action}
        rounds={rounds}
      />
    </div>
  );
};

export default MultiGamePage;
