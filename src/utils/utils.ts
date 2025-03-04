import axios from "axios";
import { Chess, Move } from "chess.js";

type MoveParams = {
  from: string;
  to: string;
  promotion?: string;
};

export class ChessGame extends Chess {
  private game: Chess;

  constructor(game?: Chess) {
    super();
    this.game = game || new Chess();
  }

  public isValidMove(move: MoveParams): boolean {
    const legalMoves: Move[] = this.game.moves({ verbose: true });
    console.log(move, "legal move");
    console.log(legalMoves, "legal moves");
    const foundMove = legalMoves.some(
      (legalMove) => legalMove.from === move.from && legalMove.to === move.to
    );
    console.log(foundMove, "found move");
    return foundMove;
  }

  public makeAMove(move: { from: string; to: string; promotion?: string }) {
    console.log(
      this.game.moves({ verbose: true }),
      this.game.turn(),
      move,
      "makeAMove"
    );
    this.game.move(move);
    return this.game.fen();
  }
}

interface getNextMove {
  Game: ChessGame;
}
export const getNextMove = async ({ Game }: getNextMove) => {
  const body = await axios.post("/api/predict", {
    fen_string: Game.fen(),
    possible_moves: Game.moves({ verbose: true }),
  });
  const { nextmove } = body.data;
  return nextmove;
};
