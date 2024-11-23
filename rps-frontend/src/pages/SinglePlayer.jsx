import React from "react";

const SinglePlayer = () => {
  const [rounds, setRounds] = React.useState("");
  const [gameStarted, setGameStarted] = React.useState(false);
  const [currentRound, setCurrentRound] = React.useState(1);
  const [playerScore, setPlayerScore] = React.useState(0);
  const [computerScore, setComputerScore] = React.useState(0);
  const [playerChoice, setPlayerChoice] = React.useState("");
  const [computerChoice, setComputerChoice] = React.useState("");
  const [winner, setWinner] = React.useState("");

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleChoice = (choice) => {
    const choices = ["rock", "paper", "scissors"];
    const computer = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setComputerChoice(computer);

    let result = "";

    // First check if it's a draw
    if (choice === computer) {
      result = "draw";
    } else if (
      (choice === "rock" && computer === "scissors") ||
      (choice === "paper" && computer === "rock") ||
      (choice === "scissors" && computer === "paper")
    ) {
      result = "player";
    } else {
      result = "computer";
    }

    if (result === "player") {
      setPlayerScore(playerScore + 1);
    } else if (result === "computer") {
      setComputerScore(computerScore + 1);
    }

    // Check if the current round is the last one
    if (currentRound >= rounds) {
      if (result === "draw") {
        setWinner("It's a draw");
      } else {
        setWinner(
          playerScore > computerScore
            ? "You"
            : playerScore < computerScore
            ? "Computer"
            : "Draw"
        );
      }
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="flex flex-col items-center bg-white shadow-lg p-6 m-4 rounded-lg w-3/4 sm:w-1/2 md:w-1/3">
          <h2 className="text-2xl font-bold text-center text-purple-600">
            Rock Paper Scissors
          </h2>
          <input
            type="number"
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            placeholder="Enter total rounds"
            className="mt-4 p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="flex flex-col items-center bg-white shadow-lg p-6 m-4 rounded-lg w-3/4 sm:w-1/2 md:w-1/3">
        <h2 className="text-2xl font-bold text-center text-purple-600">
          Round {currentRound}
        </h2>
        <div className="flex justify-between w-full mt-4 text-xl text-gray-800">
          <p>You: {playerScore}</p>
          <p>Computer: {computerScore}</p>
        </div>

        {winner ? (
          <div className="flex flex-col items-center mt-6">
            <h3
              className={`text-2xl font-bold ${
                winner === "It's a draw" ? "text-yellow-500" : "text-green-500"
              }`}
            >
              {winner === "It's a draw" ? "It's a draw" : `${winner} Won!`}
            </h3>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition"
              onClick={() => {
                setGameStarted(false);
                setRounds("");
                setCurrentRound(1);
                setPlayerScore(0);
                setComputerScore(0);
                setWinner("");
              }}
            >
              Reset Game
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-4 mt-6">
            {["rock", "paper", "scissors"].map((choice) => (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                className={`relative group bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 border-4 rounded-full p-4 hover:bg-gradient-to-r transition-all transform hover:scale-105 disabled:opacity-50 w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center ${
                  choice === "rock"
                    ? "border-yellow-400 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600"
                    : choice === "paper"
                    ? "border-blue-400 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600"
                    : choice === "scissors"
                    ? "border-red-400 hover:from-red-400 hover:via-red-500 hover:to-red-600"
                    : ""
                }`}
              >
                <img
                  src={`/${choice}.svg`}
                  alt={choice}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </button>
            ))}
          </div>
        )}
        <div className="mt-6 text-center text-lg">
          <p>You chose: {playerChoice}</p>
          <p>Computer chose: {computerChoice}</p>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayer;
