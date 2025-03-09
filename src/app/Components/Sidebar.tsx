'use client'

import { useState } from 'react';
import Image from 'next/image';
import logo from '../../../public/images/Logo.png';
import NavButton from './NavButton';
import CollapseButton from './CollapseButton';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const handleCollapse = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={`flex flex-col ${isOpen ? 'w-[250px]' : 'w-[60px]'} h-screen bg-bg-light border-r-2 border-accent`}>
            <Image src={logo} alt="Logo" width='250' height='125'/>
            <NavButton imgPath={'/images/play.svg'} text={'Play'} href={'/play'} isOpen={isOpen} />
            <hr className="mx-4 border-t-1 border-accent" />
            <NavButton imgPath={'/images/puzzles.svg'} text={'Puzzles'} href={'/puzzles'} isOpen={isOpen} />
            <hr className="mx-4 border-t-1 border-accent" />
            <NavButton imgPath={'/images/review.svg'} text={'Review'} href={'/review'} isOpen={isOpen} />
            <hr className="mx-4 border-t-1 border-accent" />
            <hr className="my-auto border-none"/>
            <CollapseButton onClick={handleCollapse} isOpen={isOpen} />
        </div>
    );
}