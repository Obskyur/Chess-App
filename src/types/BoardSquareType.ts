import { Square, PieceSymbol, Color } from 'chess.js';

export type BoardSquareType = {
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null;