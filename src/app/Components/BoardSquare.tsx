'use client';

import { BoardSquareType } from '../types/BoardSquareType';
import { useDrop } from 'react-dnd';
import Square from './Square';
import Piece from './Piece';
import { move } from '@/app/logic/chessLogic';

export default function BoardSquare({ piece, isWhite, pos }: { piece: BoardSquareType, isWhite: boolean, pos: string }) {
  const [ , drop ] = useDrop({
    accept: 'piece',
    drop: (item: { piece: BoardSquareType }) => {
      const fromPos = item?.piece?.square;
      move(fromPos, pos);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return ( 
    <div className="w-full h-full" ref={drop}>
      <Square isWhite={isWhite}>
        {piece && <Piece piece={piece} pos={pos} />}
      </Square>
    </div>
   );
}