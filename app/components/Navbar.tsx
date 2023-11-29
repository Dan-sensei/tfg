import Image from "next/image"
import Logo  from '../../public/logo.png'
import Link from "next/link"

interface LinkProps {
    name: string,
    href: string
}

const links: LinkProps[] = [
    { name: 'Inicio',  href: '/' },
    { name: 'Trending',  href: '/trending' },
    { name: 'Categorias',  href: '/categorias' },
    { name: 'Grados y masters',  href: '/grados-masters' },
    { name: 'Favoritos',  href: '/favorites' }
]

export default function Navbar() {
    return (
        <header className="flex items-center">
            <Link href={"/"} className='flex items-center'>
                <Image src={Logo} alt='Logo' height={100}  />
            </Link>
            <nav>
            <ul className='lg:flex gap-x-5 ml-10 hidden'>
                {links.map((link, index) => (
                    <li key={index}>
                        <Link href={link.href} className='text-xl font-sans transition-colors ease-in-out text-violet-50 hover:text-violet-500'>
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
            </nav>
        </header>
    )
}