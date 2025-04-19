'use client';

import Image from 'next/image';
import { BoardSquareType } from '../types/BoardSquareType';
import { useDrag } from 'react-dnd';
import { useEffect, useState } from 'react';
import { gameSubject } from '../logic/chessLogic';

export default function Piece({ piece }: { piece: BoardSquareType }) {
    const [canDrag, setCanDrag] = useState(true);
    const { color, type } = piece!;
    const pieceImage = `/images/pieces/${color === "w" ? "White" : "Black"}${type.toUpperCase()}.png`;

    useEffect(() => {
        const subscription = gameSubject.subscribe(({ gameOver }) => {
            setCanDrag(!gameOver);
        });

        return () => subscription.unsubscribe();
    }, []);

    const [{ isDragging }, drag] = useDrag({
        type: 'piece',
        item: () => ({ piece, id: `${color}${type}` }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => canDrag
    });

    return (
        <div ref={drag} className={`relative z-10 w-full h-full flex items-center justify-center ${canDrag ? 'cursor-grab' : 'cursor-default'}`}>
            <div className="relative w-[70%] h-full">
                <Image
                    src={pieceImage}
                    alt={`${color === "w" ? "White" : "Black"} ${type}`}
                    fill
                    sizes="(max-width: 768px) 40px, 60px"
                    className={`object-contain ${isDragging ? 'opacity-0' : ''}`}
                />
            </div>
        </div>
    );
}
