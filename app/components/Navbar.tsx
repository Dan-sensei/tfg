'use client'

import Image from "next/image"
import Logo  from '../../public/logo.png'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconSearch } from "@tabler/icons-react"

interface LinkProps {
    name: string,
    href: string
}

const links: LinkProps[] = [
    { name: 'Inicio',  href: '/' },
    { name: 'Trending',  href: '/trending' },
    { name: 'Categorias',  href: '/categorias' },
    { name: 'Grados y masters',  href: '/grados-masters' },
    { name: 'Próximas defensas',  href: '/defensas' },
    { name: 'Favoritos',  href: '/favoritos' }
]

export default function Navbar() {
    const pathName = usePathname()
    return (
        <header className="flex items-center px-3 pt-2 fixed z-20 top-0 h-[100px] w-full">
            <div className="h-[120px] w-full absolute top-0 left-0 -z-10 bg-gradient-to-b from-dark"></div>
            <Link href={"/"} className='flex items-center'>
                <Image src={Logo} alt='Logo' height={100}  />
            </Link>
            <nav>
                <ul className='lg:flex gap-x-5 ml-10 hidden'>
                    {links.map((link, index) => (
                        <li key={index} className={"p-1 px-2 " + (pathName === link.href ? "border-b-4 border-b-violet-700" : "")}>
                            <Link href={link.href} className='text-xl font-sans transition-colors ease-in-out text-violet-50 hover:text-violet-500'>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex-1 flex items-center justify-end">
                <Link href={"/search"} className="p-3 pr-16">
                    <IconSearch className="w-8 h-8 text-gray-300" />
                </Link>
            </div>
        </header>
    )
}