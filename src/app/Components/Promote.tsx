import Image from 'next/image';

const promotionPieces = 'rnbq'

export default function Promote({promo}: { promo: { from: string; to: string; color: string } }) {
  const { from, to, color } = promo;

  console.log('Rendering promotion dialog:', { color, from, to });

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 grid grid-cols-2 rounded-lg">
        {promotionPieces.split('').map((piece, i) => {
          const imagePath = `/images/pieces/${color === 'w' ? 'White' : 'Black'}${piece.toUpperCase()}.png`;
          
          return (
            <div 
              key={i} 
              className="relative aspect-square w-full flex items-center justify-center cursor-pointer hover:bg-white/20 rounded-md"
            >
              <div className="relative w-[90%] h-full">
                <Image
                  src={imagePath}
                  alt={`${color === 'w' ? 'White' : 'Black'} ${piece}`}
                  fill
                  sizes="33vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
