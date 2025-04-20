import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { BehaviorSubject } from 'rxjs';
import { Firestore, DocumentReference, DocumentData, collection, addDoc, updateDoc, query, where, limit, getDocs } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { db } from '@/lib/firebase';

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
  private dbGameRef: DocumentReference<DocumentData> | null = null;

  constructor() {
    this.chess = new Chess();
    this.gameSubject = new BehaviorSubject<GameState>({
      board: this.chess.board(),
      gameOver: false,
      result: null,
      gameState: 'white',
      fen: this.chess.fen(),
      history: this.chess.history(),
      pendingPromo: null,
    });
    this.createInitialGameState();
  }

  public getGameSubject(): BehaviorSubject<GameState> {
    return this.gameSubject;
  }

  public startNewGame(): void {
    this.chess.reset();
  }

  public async startOnlineGame(auth: Auth, db: Firestore): Promise<'w' | 'b'> {
    this.startNewGame();
    const member = {
      uid: auth.currentUser?.uid,
      piece: Math.random() < 0.5 ? 'b' : 'w',
      name: auth.currentUser?.displayName,
      creator: true
    };
    
    const game = {
      status: 'waiting',
      members: [member],
      board: this.gameSubject.getValue().fen,
      history: this.gameSubject.getValue().history,
    };

    try {
      const gamesCollection = collection(db, 'games');
      const docRef = await addDoc(gamesCollection, game);
      this.dbGameRef = docRef;
      console.log('Game created with ID:', docRef.id);
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
    this.updateGameState();
    return member.piece as 'w' | 'b';
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

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private saveGameToStorage(fen: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('chessGame', fen);
    }
  }

  private loadGameFromStorage(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('chessGame');
    }
    return null;
  }

  private async createInitialGameState(): Promise<GameState> {
    if (db) {
      try {
        const gamesRef = collection(db, 'games');
        const q = query(
          gamesRef,
          where('status', 'in', ['waiting', 'ongoing']),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const gameDoc = querySnapshot.docs[0];
          this.dbGameRef = gameDoc.ref;
          const gameData = gameDoc.data();
          
          // Load the game state from Firestore
          this.chess.load(gameData.board);
          return {
            board: this.chess.board(),
            gameOver: this.chess.isGameOver(),
            result: gameData.result || null,
            gameState: this.chess.turn(),
            fen: gameData.board,
            history: gameData.history || [],
            pendingPromo: null,
          };
        }
      } catch (error) {
        console.error('Error loading game from Firestore:', error);
      }
    }
    
    const savedGame = this.loadGameFromStorage();

    if (savedGame) {
      this.chess.load(savedGame);
    }
    
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

  private async updateGameState(pendingPromo: PendingPromotion | null = null): Promise<void> {
    const newGameState: GameState = {
      board: this.chess.board(),
      gameOver: this.chess.isGameOver(),
      result: this.chess.isGameOver() ? this.determineGameResult() : null,
      gameState: this.chess.turn(),
      fen: this.chess.fen(),
      history: this.chess.history(),
      pendingPromo,
    };

    // Save to local storage
    this.saveGameToStorage(this.chess.fen());
    
    // Update Firestore if this is an online game
    if (this.dbGameRef) {
      try {
        await updateDoc(this.dbGameRef, {
          board: newGameState.fen,
          history: newGameState.history,
          status: newGameState.gameOver ? 'finished' : 'ongoing',
          result: newGameState.result
        });
      } catch (error) {
        console.error('Error updating game in Firestore:', error);
      }
    }

    // Update local state
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
      .find(([ , value]) => value)?.[0] ?? '50 moves rule';

    return `Draw: (${reason})`;
  }
}

// Export instance and methods
const chessManager = new ChessGameManager();
export const gameSubject = chessManager.getGameSubject();
export const resetGame = () => chessManager.startNewGame();
export const handleMove = (from: string, to: string) => chessManager.attemptMove(from, to);
export const move = (from: string, to: string, promotion?: string) => 
  chessManager.executeMove({ from, to, promotion });
export const startOnlineGame = async (auth: Auth, db: Firestore) => await chessManager.startOnlineGame(auth, db);