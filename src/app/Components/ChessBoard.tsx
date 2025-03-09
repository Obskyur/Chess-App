'use client'

import { Board } from '../logic/chessLogic';
import { useState } from 'react';
import BoardSquare from './BoardSquare';

const initialBoard: Board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

export default function ChessBoard() {
    const [board, setBoard] = useState<Board>(initialBoard);

    return (
        <div className="grid grid-cols-8 grid-rows-8 items-center justify-center h-screen mx-7 my-18">
            {board.map((row, rowIndex) => (
                row.map((piece, colIndex) => (
                    <BoardSquare
                        key={`${rowIndex}-${colIndex}`}
                        piece={piece}
                        isWhite={(rowIndex + colIndex) % 2 === 0}
                    />
                ))
            ))}
        </div>
    );
}