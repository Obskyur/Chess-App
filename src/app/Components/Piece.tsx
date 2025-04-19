'use client';

import { BoardSquareType } from '@/app/types/BoardSquareType';
import Image from 'next/image';
import { useDrag } from 'react-dnd';

export default function Piece({ piece, pos }: { piece: BoardSquareType, pos: string }) {
  const { color, type } = piece as { color: string; type: string };
  const pieceImage = `/images/pieces/${color === "w" ? "White" : "Black"}${type.toUpperCase()}.png`

  const [{ isDragging }, drag] = useDrag({
    type: 'piece',
    item: {
      piece,
      id: `${color}${type}`,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center cursor-grab" ref={drag}>
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
  )
}
