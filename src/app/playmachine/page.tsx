"use client";
import { useEffect, useState } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { CustomSquareRender } from "@/app/components/customsquareRender";
import { useBoardSize } from "@/hooks/useBoardSize";
import ChatBot from "../components/Chatbot";
import axios from "axios";
import { API_URL } from "@/constants";

export default function PlayRandomMoveEngine() {
  const [turn, setTurn] = useState("w");
  const [game, setGame] = useState<Chess>(new Chess());
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [currentMove, setCurrentMove] = useState<{
    from: Square | undefined;
    to: Square | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isThinking, setIsThinking] = useState(false);

  function makeAMove(move: any) {
    setGame((prevgame) => {
      const current = new Chess(prevgame.fen());
      try {
        current.move(move);
        return current;
      } catch (e) {
        console.log(e);
        return prevgame;
      }
    });
    return true;
  }

  useEffect(() => {
    if (currentMove.from && currentMove.to) {
      const move = makeAMove({
        from: currentMove.from as Square,
        to: currentMove.to as Square,
        promotion: "q",
      });
      if (move) {
        setCurrentMove({ from: undefined, to: undefined });
        setPossibleMoves([]);
        setTurn((prev) => (prev === "w" ? "b" : "w"));
      }
    } else if (currentMove.from) {
      const moves = game.moves({
        square: currentMove.from as Square,
        verbose: true,
      });
      setPossibleMoves(moves.map((move) => move.to));
    }
  }, [currentMove.from, currentMove.to, game]);

  useEffect(() => {
    if (turn === "b") {
      (async () => {
        setIsThinking(true); // Start showing the spinner
        try {
          const response = await axios.post(`${API_URL}/predict`, {
            fen_string: game.fen(),
          });
          const { from, to } = response.data;
          const nextMove = { from, to };
          setTimeout(() => {
            setCurrentMove((prev) => ({
              ...prev,
              from: nextMove.from,
            }));
          }, 200);
          setTimeout(() => {
            setCurrentMove((prev) => ({
              ...prev,
              to: nextMove.to,
            }));
            setIsThinking(false); // Stop showing the spinner once the move is completed
          }, 400);
        } catch (error) {
          console.error("Error fetching move:", error);
          setIsThinking(false);
        }
      })();
    }

    if (game.isGameOver() || game.isCheckmate()) {
      setTimeout(() => {
        alert(`Game Over! ${game.turn() === "w" ? "Black" : "White"} Wins`);
      }, 50);
    }
  }, [game, turn]);

  const onSquareClick = (square: Square, piece: string | undefined) => {
    if (piece && piece.startsWith(turn)) {
      setCurrentMove((prev) => ({ ...prev, from: square }));
    } else if (currentMove.from && possibleMoves.includes(square)) {
      setCurrentMove((prev) => ({ ...prev, to: square }));
    }
  };

  const boardSize = useBoardSize();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b md:bg-gradient-to-r from-[#282626] to-[#211919] text-white p-6">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        Play With Our Trained Bots
      </h1>
      <div className="min-h-20">
        {/* Show spinner and message while engine is thinking */}
        {isThinking && (
          <div className="flex items-center mb-4 min-h-10">
            <svg
              className="animate-spin h-6 w-6 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span>Engine is thinking...</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 w-full max-w-6xl">
        <div className="flex justify-center">
          <Chessboard
            customBoardStyle={{
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
              borderRadius: "8px",
            }}
            position={game.fen()}
            onSquareClick={onSquareClick}
            isDraggablePiece={() => false}
            animationDuration={400}
            boardWidth={boardSize}
            customDarkSquareStyle={{ backgroundColor: "#769656" }}
            customLightSquareStyle={{ backgroundColor: "#eeeeD2" }}
            customSquare={({ children, style, square }) => (
              <CustomSquareRender
                square={square}
                style={style}
                possibleMovesofpiece={possibleMoves}
              >
                {children}
              </CustomSquareRender>
            )}
          />
        </div>

        <div className="p-4 rounded-lg shadow-md">
          <ChatBot fenstring={game.fen()} />
        </div>
      </div>
    </div>
  );
}
