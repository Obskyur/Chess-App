'use client';

import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { gameSubject, startOnlineGame } from '@/logic/chessLogic';
import { BoardSquareType } from '@/types/BoardSquareType';
import { auth, db } from '@/lib/firebase';
import ChessBoard from '@/app/components/ChessBoard';
import MovesBar from '@/app/components/MovesBar';

export default function Play() {
    const [board, setBoard] = useState<BoardSquareType[][]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [moves, setMoves] = useState<string[]>([]);
    const [perspective, setPerspective] = useState<'w' | 'b'>('w');
    
    useEffect(() => {
        const subscription = gameSubject.subscribe(game => {
            setBoard(game.board);
            setMoves(game.history);
            setIsGameOver(game.gameOver);
            setResult(game.result);
        })

        return () => subscription.unsubscribe();;
    }, []);

    async function startNewGame() {
        try {
            const piece = await startOnlineGame(auth, db);
            setPerspective(piece);
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex items-center justify-center w-full">
                {isGameOver && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10 pointer-events-auto">
                        <div className="bg-white p-4 rounded shadow-lg text-center pointer-events-auto">
                            <h2 className="text-xl font-bold text-accent">{result}</h2>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer" onClick={startNewGame}>Play Again</button>
                        </div>
                    </div>
                )}
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <button className="top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer" onClick={startNewGame}>Start Online Game</button>
                    <ChessBoard board={board} perspective={perspective} />
                </div>
                <MovesBar moves={moves} />
            </div>
        </DndProvider>
    );
}