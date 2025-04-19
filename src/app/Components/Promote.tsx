import Image from 'next/image';
import Square from '@/app/components/ui/Square';
import { move } from '@/logic/chessLogic';

const promotionPieces = 'rnbq'

export default function Promote({promo}: { promo: { from: string; to: string; color: string } }) {
  const { from, to, color } = promo;

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 grid grid-cols-2 rounded-lg">
        {promotionPieces.split('').map((piece, i) => {
          const imagePath = `/images/pieces/${color === 'w' ? 'White' : 'Black'}${piece.toUpperCase()}.png`;
          
          return (
            <div 
              key={i} 
              className="relative aspect-square w-full"
            >
              <Square isWhite={!(i % 3 === 0)}>
                <div className="relative w-[90%] h-full group cursor-pointer" onClick={() => move(from, to, piece)}>
                  <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-teal-400/30 transition-colors duration-200 rounded-md" />
                  <Image
                    src={imagePath}
                    alt={`${color === 'w' ? 'White' : 'Black'} ${piece}`}
                    fill
                    sizes="33vw"
                    className="object-contain relative z-10"
                    priority
                  />
                </div>
              </Square>
            </div>
          );
        })}
      </div>
    </div>
  )
}
