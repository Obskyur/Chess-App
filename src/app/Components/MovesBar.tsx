
interface MovesBarProps {
    moves: string[];
}

export default function MovesBar({ moves }: MovesBarProps) {

    return (
        <div className='flex flex-col items-center w-[250px] h-full bg-bg-light border-2 border-accent2'>
            <h2 className='my-2 text-fg2 font-bold text-4xl underline'>Moves</h2>
            <div className='flex flex-col w-[80%] h-[90%] bg-bg-dark mt-6 rounded-xl'>
                {moves.map((move: string, index: number) => {
                    if (index % 2 === 0) {
                        return (
                            <div key={index} className='grid grid-cols-[min-content_auto_auto] items-center w-full h-12 px-2'>
                                <p className='mr-4 text-fg3 font-bold text-xl'>{index / 2 + 1}</p>
                                <p className='text-fg3 font-bold text-xl'>{move}</p>
                                {moves[index + 1] && <p className='text-fg3 font-bold text-xl'>{moves[index + 1]}</p>}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}