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
        const startTime = Date.now();
        const response = await axios.post(`${API_URL}/predict`, {
          fen_string: game.fen(),
        });
        const { from, to } = response.data;
        const nextMove = { from, to };

        const elapsedTime = Date.now() - startTime;
        const delay = Math.max(1000 - elapsedTime, 0);

        setTimeout(() => {
          makeAMove(nextMove);
          setTurn("w");
        }, delay);
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
    } else if (currentMove.from) {
      setCurrentMove((prev) => ({ ...prev, to: square }));
    }
  };

  const boardSize = useBoardSize();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b md:bg-gradient-to-r from-[#282626] to-[#211919] text-white p-6">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        Play Online Chess
      </h1>

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

        <div className=" p-4 rounded-lg shadow-md">
          <ChatBot fenstring={game.fen()} />
        </div>
      </div>
    </div>
  );
}
