import { Chess } from 'chess.js';
import { BehaviorSubject } from 'rxjs';

const chess = new Chess();

export const gameSubject = new BehaviorSubject({
  board: chess.board(),
  gameOver: false,
  gameState: 'white',
  fen: chess.fen(),
  history: chess.history(),
});

export function move(from: string, to: string) {
  const legalMove = chess.move({ from, to });
  if (legalMove) {
    gameSubject.next({
      board: chess.board(),
      gameOver: chess.isGameOver(),
      gameState: chess.turn(),
      fen: chess.fen(),
      history: chess.history(),
    });
  }
}