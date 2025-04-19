'use client';

import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { gameSubject } from '@/app/logic/chessLogic';
import MovesBar from '@/app/components/MovesBar';
import { BoardSquareType } from '@/app/types/BoardSquareType';
import ChessBoard from '@/app/components/ChessBoard';


export default function Play() {
    const [ board, setBoard ] = useState<BoardSquareType[][]>([]);
    
    useEffect(() => {
        const subscription = gameSubject.subscribe(game => setBoard(game.board));

        return () => subscription.unsubscribe();;
    }, []);

    const moves = [
        'pe4', 'pe5', 'nf3', 'nc6', 'bb5', 'na5', 'bxd7'
    ]

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex items-center justify-center w-full">
                <div className="flex justify-center items-center w-full h-full">
                    <ChessBoard board={board} />
                </div>
                <MovesBar moves={moves} />
            </div>
        </DndProvider>
    );
}