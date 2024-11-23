import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ShareButton from "./ShareButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../utils/socket";

// eslint-disable-next-line no-unused-vars, react/prop-types
const MultiGame = ({ roomId, playerName, socketId, action, rounds }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [winner, setWinner] = useState(null);

  const [isDisabled, setIsDisabled] = useState(true); // Disable buttons initially
  const [totalRounds, setTotalRounds] = useState(rounds || 5);
  const [playerNameState, setPlayerName] = useState(playerName);
  const [opponentName, setOpponentName] = useState("Waiting..."); // Initially set to "Waiting..."
  const [isBothPlayersReady, setIsBothPlayersReady] = useState(false); // Tracks if both players are ready

  // Handle end of the game and clear choices for next round
  useEffect(() => {
    if (currentRound > totalRounds) {
      const resultMessage =
        playerScore > opponentScore
          ? `${playerNameState} Won!`
          : playerScore < opponentScore
          ? `${opponentName} Won!`
          : "It's a Tie!";
      toast(resultMessage, {
        type: playerScore > opponentScore ? "success" : "info",
        theme: "dark",
      });
      setIsDisabled(true); // Disable buttons after game ends
    }
  }, [
    currentRound,
    totalRounds,
    playerScore,
    opponentScore,
    playerNameState,
    opponentName,
  ]);

  // Determine winner after both players choose and reset choices
  useEffect(() => {
    if (playerChoice && opponentChoice) {
      const determineWinner = () => {
        if (playerChoice === opponentChoice) {
          setWinner("It's a Tie!");
        } else if (
          (playerChoice === "rock" && opponentChoice === "scissors") ||
          (playerChoice === "paper" && opponentChoice === "rock") ||
          (playerChoice === "scissors" && opponentChoice === "paper")
        ) {
          setWinner(`${playerNameState} wins this round!`);
          setPlayerScore((prev) => prev + 1);
        } else {
          setWinner(`${opponentName} wins this round!`);
          setOpponentScore((prev) => prev + 1);
        }

        // Prepare for the next round: reset choices and other round data
        setTimeout(() => {
          setPlayerChoice(null);
          setOpponentChoice(null);
          setWinner(null);
          setIsDisabled(false); // Re-enable buttons for the next round
          setCurrentRound((prev) => prev + 1);
        }, 1500); // Reset after a short delay to show the round result
      };

      determineWinner();
    }
  }, [playerChoice, opponentChoice, playerNameState, opponentName]);

  // Socket events for connecting and starting the game
  useEffect(() => {
    socket.on("connect", () => console.log("Connected: ", socket.id));
    socket.on("update-choices", (choice1, choice2, id) => {
      setOpponentChoice(id !== socket.id ? choice2 : choice1);
    });

    socket.on("start-game", ({ playerName, ownerName, rounds, id }) => {
      // Check if the current socket is the owner or the joiner
      if (socket.id === id) {
        // This client is the joiner
        setOpponentName(ownerName);
      } else {
        // This client is the creator
        setOpponentName(playerName);
      }

      // Set rounds and mark game as ready
      setTotalRounds(rounds);
      setIsBothPlayersReady(true); // Both players are ready
      setIsDisabled(false); // Enable buttons now that both players are ready
    });

    // Emit actions on room creation and joining
    const interval = setInterval(() => {
      if (socket) {
        clearInterval(interval);
        if (action === "create") {
          socket.emit(
            "room-has-created",
            roomId,
            playerName,
            rounds,
            socket.id
          );
        } else {
          socket.emit("player-has-joined", roomId, playerName, socket.id);
        }
        setPlayerName(playerName);
      }
    }, 500);

    return () => {
      socket.off("update-choices");
      socket.off("start-game");
    };
  }, [roomId, playerName, action, rounds]);

  // Handle player's choice
  const handlePlayerChoice = (choice) => {
    if (!isBothPlayersReady || currentRound > totalRounds) return;
    setPlayerChoice(choice);
    setIsDisabled(true);
    socket.emit("player-choice", choice, socket.id, roomId);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Rock, Paper, Scissors - {playerNameState}&apos;s Game</title>
          <meta name="description" content={`Join ${playerNameState}'s game`} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Helmet>
      </HelmetProvider>

      {/* Show game UI */}
      <div id="outerMostDiv" className="flex flex-col w-3/4 items-center mt-16">
        <ShareButton roomId={roomId} />
        <ToastContainer theme="dark" />

        {/* Round and Score section */}
        {/* <div className="bg-white shadow-lg p-6 m-4 rounded-lg w-full max-w-md"> */}
        <div className="flex flex-col w-full bg-white shadow-lg p-6 mt-4 rounded-lg">
          <div className="text-xl text-center font-semibold text-black">
            <p>
              Round {currentRound} / {totalRounds}
            </p>
          </div>
          <div className="flex justify-between text-lg mt-4">
            <div>
              <p>Player: {playerNameState}</p>
              <p className="text-center text-2xl font-bold">{playerScore}</p>
            </div>
            <div>
              <p>Opponent: {opponentName}</p>
              <p className="text-center text-2xl font-bold">{opponentScore}</p>
            </div>
          </div>
        </div>
        {/* </div> */}

        {/* Selections */}
        <div className="bg-white shadow-lg p-6 m-4 rounded-lg w-full max-w-md">
          <div className="text-lg text-black">
            <p>
              {playerNameState} selected: {playerChoice || "Waiting..."}
            </p>
            <p>
              {opponentName} selected: {opponentChoice || "Waiting..."}
            </p>
          </div>
        </div>

        {/* Choice buttons */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center items-center p-6 m-4 rounded-lg w-full max-w-md gap-4">
          {/* Rock Button */}
          <button
            onClick={() => handlePlayerChoice("rock")}
            disabled={isDisabled}
            className="relative group bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 border-4 border-yellow-400 rounded-full p-4 hover:bg-gradient-to-r hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 disabled:opacity-50 w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center"
          >
            <img
              src="/rock.svg"
              alt="Rock"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </button>

          {/* Paper Button */}
          <button
            onClick={() => handlePlayerChoice("paper")}
            disabled={isDisabled}
            className="relative group bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 border-4 border-blue-400 rounded-full p-4 hover:bg-gradient-to-r hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center"
          >
            <img
              src="/paper.svg"
              alt="Paper"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </button>

          {/* Scissors Button */}
          <button
            onClick={() => handlePlayerChoice("scissors")}
            disabled={isDisabled}
            className="relative group bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 border-4 border-red-400 rounded-full p-4 hover:bg-gradient-to-r hover:from-red-400 hover:via-red-500 hover:to-red-600 transition-all transform hover:scale-105 disabled:opacity-50 w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center"
          >
            <img
              src="/scissors.svg"
              alt="Scissors"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </button>
        </div>

        {/* Create Game / Join Game buttons */}
        {currentRound > totalRounds && (
          <div className="mt-4 mb-4 flex justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/create-room")} // Replace with actual navigation logic
              className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition-all"
            >
              Create Game
            </button>
            <button
              onClick={() => (window.location.href = "/join-room")} // Replace with actual navigation logic
              className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-all"
            >
              Join Game
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MultiGame;
