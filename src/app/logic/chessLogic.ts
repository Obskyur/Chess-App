import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { BehaviorSubject } from 'rxjs';

interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

interface PendingPromotion {
  from: string;
  to: string;
  color: string;
}

interface GameState {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  gameOver: boolean;
  result: string | null;
  gameState: string;
  fen: string;
  history: string[];
  pendingPromo: PendingPromotion | null;
}

class ChessGameManager {
  private chess: Chess;
  private gameSubject: BehaviorSubject<GameState>;

  constructor() {
    this.chess = new Chess();
    this.gameSubject = new BehaviorSubject<GameState>(this.createInitialGameState());
  }

  public getGameSubject(): BehaviorSubject<GameState> {
    return this.gameSubject;
  }

  public startNewGame(): void {
    this.chess.reset();
    this.updateGameState();
  }

  public attemptMove(from: string, to: string): void {
    const pendingPromotion = this.checkForPawnPromotion(from, to);
    
    if (pendingPromotion) {
      this.updateGameState(pendingPromotion);
      return;
    }

    if (!this.gameSubject.getValue().pendingPromo) {
      this.executeMove({ from, to });
    }
  }

  public executeMove(move: ChessMove): void {
    try {
      const isValidMove = this.chess.move(move);
      if (!isValidMove) {
        throw new Error('Invalid move');
      }
      this.updateGameState();
    } catch {
      // Do nothing if an invalid move occurs
    }
  }

  private createInitialGameState(): GameState {
    return {
      board: this.chess.board(),
      gameOver: false,
      result: null,
      gameState: 'white',
      fen: this.chess.fen(),
      history: this.chess.history(),
      pendingPromo: null,
    };
  }

  private checkForPawnPromotion(from: string, to: string): PendingPromotion | null {
    const promotionMoves = this.chess.moves({ verbose: true })
      .filter(move => move.promotion);

    const isPromotion = promotionMoves.some(move => 
      move.from === from && move.to === to
    );

    if (!isPromotion) {
      return null;
    }

    return {
      from,
      to,
      color: promotionMoves[0].color
    };
  }

  private updateGameState(pendingPromo: PendingPromotion | null = null): void {
    const newGameState: GameState = {
      board: this.chess.board(),
      gameOver: this.chess.isGameOver(),
      result: this.chess.isGameOver() ? this.determineGameResult() : null,
      gameState: this.chess.turn(),
      fen: this.chess.fen(),
      history: this.chess.history(),
      pendingPromo,
    };

    this.gameSubject.next(newGameState);
  }

  private determineGameResult(): string | null {
    if (this.chess.isCheckmate()) {
      return this.chess.turn() === 'w' ? 'Winner - Black' : 'Winner - White';
    }

    if (this.chess.isDraw()) {
      return this.getDrawReason();
    }

    return null;
  }

  private getDrawReason(): string {
    const reasons = {
      threefold: this.chess.isThreefoldRepetition(),
      insufficient: this.chess.isInsufficientMaterial(),
      stalemate: this.chess.isStalemate(),
    };

    const reason = Object.entries(reasons)
      .find(([_, value]) => value)?.[0] ?? '50 moves rule';

    return `Draw: (${reason})`;
  }
}

// Export instance and methods
const chessManager = new ChessGameManager();
export const gameSubject = chessManager.getGameSubject();
export const initGame = () => chessManager.startNewGame();
export const handleMove = (from: string, to: string) => chessManager.attemptMove(from, to);
export const move = (from: string, to: string, promotion?: string) => 
  chessManager.executeMove({ from, to, promotion });
export const resetGame = initGame;
