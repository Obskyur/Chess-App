import { Piece } from '../logic/chessLogic';
import Image from 'next/image';
import { pieceImages } from '../logic/pieceImages';

interface BoardSquareProps {
    piece: Piece;
    isWhite: boolean;
}

export default function BoardSquare({ piece, isWhite }: BoardSquareProps) {
    const pieceImage = piece ? pieceImages[piece] : '';
    return (
        <div className={`w-full h-full ${isWhite ? 'bg-gray-300' : 'bg-gray-500'}`}>
            
            {pieceImage && <Image src={pieceImage} alt={piece} width='110' height='110' />}
        </div>
    );
}