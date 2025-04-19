'use client';

import { BoardSquareType } from '../../types/BoardSquareType';
import { useDrop } from 'react-dnd';
import { useEffect, useState } from 'react';
import Square from '@/app/components/ui/Square';
import Piece from './Piece';
import { handleMove } from '@/logic/chessLogic';
import { gameSubject } from '@/logic/chessLogic';
import Promote from './Promote';

export default function BoardSquare({ piece, isWhite, pos }: { piece: BoardSquareType, isWhite: boolean, pos: string }) {
  const [promo, setPromo] = useState<{ from: string; to: string; color: string } | null>(null);

  const [ , drop ] = useDrop({
    accept: 'piece',
    drop: (item: { piece: BoardSquareType }) => {
      const fromPos = item!.piece!.square;
      handleMove(fromPos, pos);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    const subscribe = gameSubject.subscribe(({ pendingPromo }) => {
      if (pendingPromo?.to === pos) {
        setPromo(pendingPromo);
      } else {
        setPromo(null);
      }
    });

    return () => subscribe.unsubscribe();
  })

  return ( 
    <div className="w-full h-full" ref={drop}>
      <Square isWhite={isWhite}>
        {promo ? (<Promote promo={promo} />) : piece ? (<Piece piece={piece} pos={pos} />) : null}
      </Square>
    </div>
  );
}