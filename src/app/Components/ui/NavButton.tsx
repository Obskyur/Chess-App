import Image from 'next/image';
import Link from 'next/link';
  
interface NavButtonProps {
    imgPath: string;
    text: string;
    href: string;
    isOpen: boolean;
}

export default function NavButton({ imgPath, text, href, isOpen }: NavButtonProps ) {
    return (
        <Link href={href} className="flex items-center justify-between w-55 h-12 my-6 mx-auto px-3">
            <Image src={imgPath} alt={text} width='40' height='40'/>
            {isOpen && <span className='w-35 text-4xl tracking-wider'>{text}</span> }
        </Link>
    );
}