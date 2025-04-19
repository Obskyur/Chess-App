'use client';

import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { gameSubject } from '@/app/logic/chessLogic';
import MovesBar from '@/app/components/MovesBar';
import { BoardSquareType } from '@/app/types/BoardSquareType';
import ChessBoard from '@/app/components/ChessBoard';


export default function Play() {
    const [board, setBoard] = useState<BoardSquareType[][]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    
    useEffect(() => {
        const subscription = gameSubject.subscribe(game => {
            setBoard(game.board);
            setIsGameOver(game.gameOver);
            setResult(game.result);
        })

        return () => subscription.unsubscribe();;
    }, []);

    const moves = [
        'pe4', 'pe5', 'nf3', 'nc6', 'bb5', 'na5', 'bxd7'
    ]

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex items-center justify-center w-full">
                {isGameOver && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10 pointer-events-auto">
                        <div className="bg-white p-4 rounded shadow-lg text-center pointer-events-auto">
                            <h2 className="text-xl font-bold text-accent">{result}</h2>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Play Again</button>
                        </div>
                    </div>
                )}
                <div className="flex justify-center items-center w-full h-full">
                    <ChessBoard board={board} />
                </div>
                <MovesBar moves={moves} />
            </div>
        </DndProvider>
    );
}