import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { BehaviorSubject } from 'rxjs';


const chess = new Chess();

export const gameSubject = new BehaviorSubject<{
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  gameOver: boolean;
  result: string | null;
  gameState: string;
  fen: string;
  history: string[];
  pendingPromo: { from: string; to: string; color: string } | null;
}>({
  board: chess.board(),
  gameOver: false,
  result: null,
  gameState: 'white',
  fen: chess.fen(),
  history: chess.history(),
  pendingPromo: null,
});

export function initGame() {
  chess.reset();
  updateGame();
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

export function resetGame() {
  chess.reset();
  updateGame();
}

function updateGame(pendingPromo: { from: string, to: string, color: string } | null = null) {
  const newGameState = {
    board: chess.board(),
    gameOver: chess.isGameOver(),
    result: chess.isGameOver() ? getGameResult() : null,
    gameState: chess.turn(),
    fen: chess.fen(),
    history: chess.history(),
    pendingPromo,
  }

  gameSubject.next(newGameState);
}

function getGameResult() {
  if (chess.isCheckmate())
    return chess.turn() === 'w' ? 'Winner - Black' : 'Winner - White';
  if (chess.isDraw()) {
    return `Draw: (${chess.isThreefoldRepetition() ? 'threefold repetition' :
      chess.isInsufficientMaterial() ? 'insufficient material' :
      chess.isStalemate() ? 'stalemate' : '50 moves rule'})`;
  }
  return null;
}
