import Image from 'next/image';
import chessBoard from '../../../public/images/ChessBoard.png';
import MovesBar from '../Components/MovesBar';

export default function Play() {
    const moves = [
        'pe4', 'pe5', 'nf3', 'nc6', 'bb5', 'na5', 'bxd7'
    ]
    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex justify-center items-center w-full h-full">
                <Image src={chessBoard} className='px-4 py-6 w-full h-full object-contain' alt='chess board' />
            </div>
            <MovesBar moves={moves} />
        </div>
    );
}