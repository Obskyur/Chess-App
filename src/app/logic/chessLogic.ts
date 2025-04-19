import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { BehaviorSubject } from 'rxjs';


const chess = new Chess();

export const gameSubject = new BehaviorSubject<{
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  gameOver: boolean;
  gameState: string;
  fen: string;
  history: string[];
  pendingPromo: { from: string; to: string; color: string } | null;
}>({
  board: chess.board(),
  gameOver: false,
  gameState: 'white',
  fen: chess.fen(),
  history: chess.history(),
  pendingPromo: null,
});

export function initGame() {
  chess.reset();
  const newGameState = {
    board: chess.board(),
    gameOver: false,
    gameState: 'white',
    fen: chess.fen(),
    history: chess.history(),
    pendingPromo: null,
  }

  gameSubject.next(newGameState);
}

export function handleMove(from: string, to: string) {
  const promotions = chess.moves({ verbose: true }).filter(m => m.promotion);
  console.table(promotions);
  if (promotions.some(p => p.from === from && p.to === to)) {
    const pendingPromo = { from, to, color: promotions[0].color };
    updateGame(pendingPromo);
  }
  const { pendingPromo } = gameSubject.getValue();
  if (!pendingPromo)
    move(from, to);
}

export function move(from: string, to: string, promotion?: string) {
  const tempMove: { from: string; to: string; promotion?: string } = { from, to };
  if (promotion) {
    tempMove.promotion = promotion;
  }
  try {
    chess.move(tempMove);
    updateGame();
  } catch {
    // Silently ignore invalid moves
  }
}

function updateGame(pendingPromo: { from: string, to: string, color: string } | null = null) {
  const newGameState = {
    board: chess.board(),
    gameOver: chess.isGameOver(),
    gameState: chess.turn(),
    fen: chess.fen(),
    history: chess.history(),
    pendingPromo,
  }

  gameSubject.next(newGameState);
}