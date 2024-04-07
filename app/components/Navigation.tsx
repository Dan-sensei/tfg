"use client";

import Image from "next/image";
import Logo from "../../public/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconSearch, IconChevronDown, IconChevronRight, IconLayoutCollage } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { CategoryLink } from "../types/interfaces";
import Search from "./QuickSearch";

interface LinkProps {
    name: string;
    href: string;
    isCategories?: boolean;
}

interface TooltipLinkProps extends LinkProps {
    categoriesElements: CategoryLink[]
}

const DefaultLink = ({ href, name, isCategories }: LinkProps & {isCategories?: Boolean}) => {
    return (
        <Link
            color="foreground"
            className="text-base font-semibold h-full px-2 flex items-center transition-colors ease-in-out text-violet-50 hover:text-nova-link"
            href={href}
        >
            {name}
            {isCategories && <IconChevronDown className=" ml-2 mt-1" size={20} />}
        </Link>
    );
};
const TooltipLink = ({ href, name, categoriesElements }: TooltipLinkProps) => {
    const firstColumn = categoriesElements.slice(0, categoriesElements.length/2);
    const secondColumn = categoriesElements.slice(6);
    return (
        <div className="h-full group ">
            <DefaultLink href={href} name={name} isCategories={true} />
            <div className="px-7 py-5 absolute top-[100%] -left-[80px] transition-all opacity-0 group-hover:opacity-100 w-[670px] drop-shadow-light-dark bg-nova-light-dark rounded-xl group-hover:visible invisible">
                <div className="arrow-up border-b-[10px] border-b-nova-light-dark  absolute left-[127px] top-[-10px]"></div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9">
                        <h1 className="text-xl font-bold">Tema</h1>
                        <div className="grid grid-cols-2 pl-3 text-gray-400 ">
                            <div className="">
                                {
                                    firstColumn.map((category, index) => (
                                        <Link key={index} href={`/categoria/${category.id}`} className="hover:text-nova-link transition-colors block font-bold pt-1">
                                            <div>{category.name}</div>
                                        </Link>
                                    )
                                )}
                            </div>
                            <div className="">
                                {
                                    secondColumn.map((category, index) => (
                                        <Link key={index} href={`/categoria/${category.id}`} className="hover:text-nova-link transition-colors font-bold block pt-1">
                                            <div>{category.name}</div>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="pl-3 text-gray-400">
                            <Link href={"/categorias"} className="hover:text-nova-link transition-colors block font-bold pt-1">
                                Ver todos <IconChevronRight className="inline text-nova-link" size={20} /> 
                            </Link>
                        </div>
                    </div>
                    
                    <div className="col-span-3 flex flex-col gap-4">
                        <div className="flex-1">
                            <Button href="#" className="w-full h-full font-bold text-nova-link" color="primary" variant="ghost">
                                Titulaciones
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Button href="#" className="w-full h-full font-bold text-nova-link" color="primary" variant="ghost">
                                Mejor valorados
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Button href="#" className="w-full h-full font-bold text-nova-link" color="primary" variant="ghost">
                                Más vistos
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

const links: LinkProps[] = [
    { name: "Inicio", href: "/" },
    { name: "Trending", href: "/trending" },
    { name: "Categorias", href: "/categoria", isCategories: true },
    { name: "Próximas defensas", href: "/defensas" },
    { name: "Favoritos", href: "/favoritos" },
];


export default function Navigation({categoriesList} : { categoriesList : CategoryLink[]}) {
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const offset = 50;
            setHasScrolled(window.scrollY > offset);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const pathName = usePathname();
    return (
        <Navbar
            isMenuOpen={isMenuOpen}
            maxWidth="full"
            isBlurred={false}
            disableAnimation={true}
            onMenuOpenChange={setIsMenuOpen}
            className={` ${
                hasScrolled ? "border-b-blue-500 border-b-2 bg-nova-darker/70 backdrop-blur-sm" : "border-b-blue-500 border-b-2 bg-nova-darker/70 backdrop-blur-sm lg:backdrop-blur-0 lg:border-b-transparent lg:bg-transparent"
            } transition-colors fixed`}
        >
            <NavbarContent className="lg:hidden" justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
            </NavbarContent>

            <NavbarContent className="lg:hidden pr-3" justify="center">
                <NavbarBrand>
                    <Link href={links[0].href}>
                        <Image src={Logo} alt="Logo" height={55} />
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden lg:flex gap-4" justify="center">
                <NavbarBrand className="py-2">
                    <Link href={links[0].href}>
                        <Image src={Logo} alt="Logo" height={50} />
                    </Link>
                </NavbarBrand>
                {links.map((link, index) => (
                    <NavbarItem
                        key={`${index}`}
                        className={`h-full relative ${pathName === link.href
                            ? "after:border-b-4 after:border-b-blue-500 after:absolute after:w-full after:h-full after:top-0 after:left-0 after:pointer-events-none"
                            : ""}`
                        }
                        data-active={
                            pathName === link.href ? "true" : undefined
                        }
                    >
                        { link.isCategories ? 
                            <TooltipLink {...link} categoriesElements={categoriesList} /> :
                            <DefaultLink {...link} />
                        }
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="flex">
                    <Search />
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="bg-nova-darker/70 backdrop-blur-sm">
                {links.map((link, index) => (
                    <NavbarMenuItem key={`${index}`}>
                        <Link
                            className="w-full transition-colors ease-in-out text-violet-50 hover:text-nova-link"
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span
                                className={
                                    pathName === link.href
                                        ? "text-nova-link font-bold"
                                        : ""
                                }
                            >
                                {link.name}
                            </span>
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
