'use client'

import { BoardSquareType } from '@/types/BoardSquareType';
import BoardSquare from './BoardSquare';

export default function ChessBoard({ board }: { board: BoardSquareType[][] }) {
    function isWhite(i: number) {
        const { x, y } = getPos(i);
        return (x + y) % 2 === 0;
    }
    
    function getPos(i: number) {
        const x = i % 8;
        const y = Math.abs(Math.floor(i / 8) - 7);
        return { x, y };
    }

    function getPosInChessNotation(i: number) {
        const { x, y } = getPos(i);
        const letter = 'abcdefgh'[x];
        return `${letter}${y + 1}`;
    }

    return (
        <div className="w-[min(100vw,80vh)] aspect-square mx-auto">
            <div className="grid grid-cols-8 w-full h-full">
                {board.flat().map((piece, i) => 
                    <div key={i} className="relative w-full aspect-square">
                        <BoardSquare isWhite={isWhite(i)} piece={piece} pos={getPosInChessNotation(i)} />
                    </div>
                )}
            </div>
        </div>
    );
}