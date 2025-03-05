"use client";
import { useCallback, useEffect, useState } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { CustomSquareRender } from "@/app/components/customsquareRender";
import { useBoardSize } from "@/hooks/useBoardSize";
import { useParams, useSearchParams } from "next/navigation";
import {
  ChannelProvider,
  useChannel,
  usePresence,
  usePresenceListener,
} from "ably/react";
import RealTimeChatBot from "@/app/components/realtimechatbot";
function PlayRandomMoveEngine() {
  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  const [turn, setTurn] = useState("w");
  const [game, setGame] = useState<Chess>(new Chess());
  const { id } = useParams();
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const [currentMove, setCurrentMove] = useState<{
    from: Square | undefined;
    to: Square | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const { channel } = useChannel(id as string);
  usePresence(id as string);
  const { presenceData } = usePresenceListener(id as string);
  console.log(presenceData, "presenceData");

  useChannel(id as string, "move", (message) => {
    const { moveBy, move } = message.data;
    console.log(move, moveBy, "message");
    if (color?.startsWith(moveBy)) {
      return;
    }
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
    setTurn((prev) => (prev === "w" ? "b" : "w"));
  });
  useEffect(() => {
    if (game.isGameOver() || game.isCheckmate()) {
      setTimeout(() => {
        alert(`Game Over! ${game.turn() === "w" ? "Black" : "White"} Wins`);
      }, 50);
    }
  }, [game, turn]);

  const makeAMove = useCallback(
    (move: { from: Square; to: Square; promotion?: string }) => {
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
      const calldata = {
        move: move,
        moveBy: game.turn(),
      };
      channel.publish("move", calldata);
      return true;
    },
    [game, channel]
  );

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
  }, [currentMove.from, currentMove.to, game, makeAMove]);

  const onSquareClick = (square: Square, piece: string | undefined) => {
    if (piece && piece.startsWith(turn)) {
      setCurrentMove((prev) => ({ ...prev, from: square }));
    } else if (currentMove.from && possibleMoves.includes(square)) {
      setCurrentMove((prev) => ({ ...prev, to: square }));
    }
  };

  const boardSize = useBoardSize();
  if (presenceData.length < 2 && !loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-semibold text-red-500 bg-gray-100 px-6 py-3 rounded-lg shadow-md">
          Opponent Left 😢
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b md:bg-gradient-to-r from-[#282626] to-[#211919] text-white p-6">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        Play Against Machine
      </h1>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 w-full max-w-6xl">
        <div className="flex justify-center w-full">
          <Chessboard
            customBoardStyle={{
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
              borderRadius: "8px",
            }}
            boardOrientation={color as "white" | "black"}
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
          <RealTimeChatBot />
        </div>
      </div>
    </div>
  );
}
const ProviderComponent = () => {
  const { id } = useParams();
  return (
    <ChannelProvider channelName={id as string}>
      <PlayRandomMoveEngine />
    </ChannelProvider>
  );
};

export default ProviderComponent;
