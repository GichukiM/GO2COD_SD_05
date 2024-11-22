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
      if (choice === computer) result = "draw";
      else if (
        (choice === "rock" && computer === "scissors") ||
        (choice === "paper" && computer === "rock") ||
        (choice === "scissors" && computer === "paper")
      )
        result = "player";
      else result = "computer";
  
      if (result === "player") setPlayerScore(playerScore + 1);
      else if (result === "computer") setComputerScore(computerScore + 1);
  
      if (currentRound >= rounds) {
        setWinner(
          playerScore > computerScore
            ? "You"
            : playerScore < computerScore
            ? "Computer"
            : "Draw"
        );
      } else {
        setCurrentRound(currentRound + 1);
      }
    };
  
    if (!gameStarted) {
      return (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold">Rock Paper Scissors</h2>
          <input
            type="number"
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            placeholder="Enter total rounds"
            className="mt-2 p-2 border rounded"
          />
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold">Round {currentRound}</h2>
        <div className="flex justify-between w-1/2 mt-4">
          <p>You: {playerScore}</p>
          <p>Computer: {computerScore}</p>
        </div>
        {winner ? (
          <div className="flex flex-col items-center">
            <h3 className="mt-4">{winner} Won!</h3>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => {
                setGameStarted(false);
                setRounds("");
                setCurrentRound(1);
                setPlayerScore(0);
                setComputerScore(0);
                setWinner("");
              }}
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="flex space-x-2 mt-4">
            {["rock", "paper", "scissors"].map((choice) => (
              <button
                key={choice}
                className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                onClick={() => handleChoice(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
        <div className="mt-4">
          <p>You chose: {playerChoice}</p>
          <p>Computer chose: {computerChoice}</p>
        </div>
      </div>
    );
  };
  
  export default SinglePlayer;
  