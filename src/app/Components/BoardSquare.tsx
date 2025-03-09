import { Piece } from '../logic/chessLogic';
import Image from 'next/image';

interface BoardSquareProps {
    piece: Piece;
}

export default function BoardSquare({ piece }: BoardSquareProps) {
    const pieceImage = piece ? pieceImages[piece] : '';
    return (
        <div className="w-12 h-12">
            {pieceImage && <Image src={pieceImage} alt={piece} width={48} height={48} />}
        </div>
    );
}