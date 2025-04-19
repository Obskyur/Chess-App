import Image from 'next/image';

interface CollapseButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

export default function CollapseButton({ onClick, isOpen }: CollapseButtonProps) {
    return (
        <button className="flex items-center justify-between w-55 h-12 my-6 mx-auto px-3 hover:cursor-pointer" onClick={onClick}>
            <Image 
            src='/images/collapse.svg' 
            alt='collapse' 
            width='40' 
            height='40' 
            className={isOpen ? '' : 'rotate-180'}
            />
            {isOpen && <span className={`w-35 text-2xl tracking-wider`}>Collapse</span>}
        </button>
    );
}