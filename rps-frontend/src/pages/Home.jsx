import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 px-4">
      {/* Single Player Section */}
      <div className="flex flex-col items-center bg-white shadow-lg p-8 m-4 rounded-lg transform transition-all hover:scale-105 hover:shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-indigo-600">SinglePlayer</h2>
        <p className="mt-4 text-gray-700 text-center">
          Play against the computer and test your luck! The computer randomly selects between Rock, Paper, and Scissors.
        </p>
        <Link to="/single-player">
          <button className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 px-6 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all w-full sm:w-auto">
            Play Now
          </button>
        </Link>
      </div>

      {/* Multiplayer Section */}
      <div className="flex flex-col items-center bg-white shadow-lg p-8 m-4 rounded-lg transform transition-all hover:scale-105 hover:shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-indigo-600">MultiPlayer</h2>
        <p className="mt-4 text-gray-700 text-center">
          Play against real players across the world and fight for the win! You can even invite your friends for the battle or play with a random player.
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6 w-full">
          <Link to="/create-room">
            <button className="bg-gradient-to-r from-green-400 to-green-500 text-white py-2 px-6 rounded-full hover:from-green-500 hover:to-green-600 transition-all w-full sm:w-auto mb-4 sm:mb-0">
              Create a Room
            </button>
          </Link>
          <Link to="/join-room">
            <button className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 px-6 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all w-full sm:w-auto">
              Join a Room
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
