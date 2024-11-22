import { Link } from "react-router-dom";

const Home = () => {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center bg-white shadow-lg p-6 m-4 rounded-lg">
          <h2 className="text-2xl font-bold">SinglePlayer</h2>
          <p className="mt-2 text-gray-600">
            Play against the computer and test your luck! The computer randomly
            selects between Rock, Paper, and Scissors.
          </p>
          <Link to="/single-player">
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Play Now
          </button>
          </Link>
        </div>
        <div className="flex flex-col items-center bg-white shadow-lg p-6 m-4 rounded-lg">
          <h2 className="text-2xl font-bold">MultiPlayer</h2>
          <p className="mt-2 text-gray-600">
            Play against real players across the world and fight for the win! You
            can even invite your friends for the battle or play with a random
            player.
          </p>
          <div className="flex space-x-2 mt-4">
            <Link to="/create-room">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Create a Room
            </button>
            </Link>
            <Link to="/join-room">
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
            >
              Join a Room
            </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;
  