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

export function move(from, to) {
  
}