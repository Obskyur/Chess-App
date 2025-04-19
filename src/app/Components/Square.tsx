'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

export default function Square({ children, isWhite }: { children: ReactNode, isWhite: boolean }) {
  const bgImage = isWhite ? '/images/LightWoodTile.jpg' : '/images/DarkWoodTile.jpg';

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <Image 
        src={bgImage}
        alt={isWhite ? "Light wood tile" : "Dark wood tile"}
        fill
        className="object-cover"
      />
      {children}
    </div>
  )
}