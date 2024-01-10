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

interface LinkProps {
    name: string;
    href: string;
    isCategories?: boolean;
}

const DefaultLink = ({ href, name, isCategories }: LinkProps & {isCategories?: Boolean}) => {
    return (
        <Link
            color="foreground"
            className="text-xl font-semibold h-full px-2 flex items-center transition-colors ease-in-out text-violet-50 hover:text-violet-500"
            href={href}
        >
            {name}
            {isCategories && <IconChevronDown className=" ml-2 mt-1" size={20} />}
        </Link>
    );
};
const TooltipLink = ({ href, name, categoriesElements }: LinkProps & { categoriesElements: string[] }) => {
    const firstColumn = categoriesElements.slice(0, categoriesElements.length/2);
    const secondColumn = categoriesElements.slice(6);
    return (
        <div className="h-full group ">
            <DefaultLink href={href} name={name} isCategories={true} />
            <div className="px-10 py-5 absolute top-[100%] -left-[80px] transition-all opacity-0 group-hover:opacity-100 w-[650px] bg-popup rounded-xl group-hover:visible invisible">
                <div className="arrow-up absolute left-[127px] top-[-10px]"></div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9">
                        <h1 className="text-xl font-bold">Tema</h1>
                        <div className="grid grid-cols-2 pl-3 text-gray-400 ">
                            <div className="">
                                {
                                    firstColumn.map((category, index) => (
                                        <Link key={index} href={"#"} className="hover:text-violet-400 transition-colors block font-bold pt-1">
                                            <div>{category}</div>
                                        </Link>
                                    )
                                )}
                            </div>
                            <div className="">
                                {
                                    secondColumn.map((category, index) => (
                                        <Link key={index} href={"#"} className="hover:text-violet-400 transition-colors font-bold block pt-1">
                                            <div>{category}</div>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="pl-3 text-gray-400">
                            <Link href={"#"} className="hover:text-violet-400 transition-colors block font-bold pt-1">
                                Ver todos <IconChevronRight className="inline text-violet-600" size={20} /> 
                            </Link>
                        </div>
                    </div>
                    
                    <div className="col-span-3 flex flex-col gap-4">
                        <div className="flex-1">
                            <Button href="#" className="w-full h-full font-bold" color="secondary" variant="ghost">
                                Grados y másters
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Button href="#" className="w-full h-full font-bold" color="secondary" variant="ghost">
                                Mejor valorados
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Button href="#" className="w-full h-full font-bold" color="secondary" variant="ghost">
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
    { name: "Categorias", href: "/categorias", isCategories: true },
    { name: "Próximas defensas", href: "/defensas" },
    { name: "Favoritos", href: "/favoritos" },
];


export default function Navigation({categoriesList} : { categoriesList : string[]}) {
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
            
            onMenuOpenChange={setIsMenuOpen}
            className={` ${
                hasScrolled ? "bg-dark" : "lg:bg-transparent"
            } transition-colors fixed`}
        >
            <div className="h-[120px] w-full hidden lg:block absolute top-0 left-0 -z-10 bg-gradient-to-b from-dark"></div>
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
                            ? "after:border-b-4 after:border-b-violet-700 after:absolute after:w-full after:h-full after:top-0 after:left-0"
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
                    <Link href={"/search"} className="lg:p-3 lg:pr-16">
                        <IconSearch className="w-8 h-8 text-gray-300" />
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="lg:bg-transparent">
                {links.map((link, index) => (
                    <NavbarMenuItem key={`${index}`}>
                        <Link
                            className="w-full transition-colors ease-in-out text-violet-50 hover:text-violet-500"
                            href={link.href}
                        >
                            <span
                                className={
                                    pathName === link.href
                                        ? "text-violet-600 font-bold"
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
