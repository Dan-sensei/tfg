"use client";

import Image from "next/image";
import Logo from "../../public/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconAdjustmentsSearch,
    IconChevronDown,
    IconChevronRight,
    IconSearch,
    IconTriangle,
    IconHomeFilled,
    IconTrendingUp,
    IconCategoryFilled,
    IconCalendarUser,
    IconHeartFilled,
    IconStarFilled,
    IconEyeUp,
    IconSchool,
    IconTopologyRing2,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { CategoryLink, LinkProps } from "@/app/types/interfaces";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import Search from "./QuickSearch";
import { useSession } from "next-auth/react";
import { Avatar } from "@nextui-org/avatar";
import { signOut } from "next-auth/react";
import { DEF_ICON_SIZE } from "@/app/types/defaultData";
import { Role } from "../lib/enums";

interface TooltipLinkProps extends LinkProps {
    categoriesElements: CategoryLink[];
}

const DefaultLink = ({ href, name, isCategories }: LinkProps & { isCategories?: Boolean }) => {
    return (
        <Link
            color="foreground"
            className={`uppercase relative text-sm font-semibold h-full px-2 flex items-center transition-colors ease-in-out ${
                isCategories && "mr-2"
            }`}
            href={href}>
            {name}
            {isCategories && <IconChevronDown className=" ml-2 mt-1 absolute -right-[14px] mb-1" size={20} />}
        </Link>
    );
};
const TooltipLink = ({ href, name, categoriesElements }: TooltipLinkProps) => {
    const firstColumn = categoriesElements.slice(0, categoriesElements.length / 2);
    const secondColumn = categoriesElements.slice(6);
    return (
        <div className="h-full group ">
            <DefaultLink href={href} name={name} isCategories={true} />
            <div className="px-7 py-5 absolute top-[100%] -left-[80px] transition-all opacity-0 group-hover:opacity-100 w-[670px] drop-shadow-light-dark bg-nova-darker-2 border-1 border-white/20 rounded-xl group-hover:visible invisible">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9">
                        <h1 className="text-xl font-bold">Tema</h1>
                        <div className="grid grid-cols-2 pl-3 text-gray-400 ">
                            <div className="">
                                {firstColumn.map((category, index) => (
                                    <Link
                                        key={index}
                                        href={`/category/${category.id}`}
                                        className="hover:text-nova-link transition-colors block pt-1">
                                        <div>{category.name}</div>
                                    </Link>
                                ))}
                            </div>
                            <div className="">
                                {secondColumn.map((category, index) => (
                                    <Link
                                        key={index}
                                        href={`/category/${category.id}`}
                                        className="hover:text-nova-link transition-colors block pt-1">
                                        <div>{category.name}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="pl-3 text-gray-400">
                            <Link href={"/categories"} className="hover:text-nova-link transition-colors block pt-1">
                                Ver todos <IconChevronRight className="inline text-nova-link" size={20} />
                            </Link>
                        </div>
                    </div>

                    <div className="col-span-3 flex flex-col gap-4">
                        <div className="flex-1">
                            <Button as={Link} href="/titulations" className="w-full h-full font-bold text-nova-link bg-blue-700" color="primary" variant="flat">
                                Titulaciones
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Button as={Link} href="/most-valued" className="w-full h-full font-bold text-nova-link bg-blue-700" color="primary" variant="flat">
                                Mejor valorados
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Button as={Link} href="/populars" className="w-full h-full font-bold text-nova-link bg-blue-700" color="primary" variant="flat">
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
    { name: "Inicio", href: "/home", icon: <IconHomeFilled size={DEF_ICON_SIZE} /> },
    { name: "Trending", href: "/trending", icon: <IconTrendingUp size={DEF_ICON_SIZE} /> },
    { name: "Categorias", href: "/category", isCategories: true, icon: <IconCategoryFilled size={DEF_ICON_SIZE} /> },
    {
        name: "Titulaciones",
        href: "/titulations",
        isCategories: true,
        icon: <IconSchool size={DEF_ICON_SIZE} />,
        isSubcategory: true,
    },
    { name: "Mejor valorados", href: "/most-valued", isCategories: true, icon: <IconStarFilled size={15} />, isSubcategory: true },
    { name: "Más vistos", href: "/populars", isCategories: true, icon: <IconEyeUp size={15} />, isSubcategory: true },
    { name: "Próximas defensas", href: "/defensas", icon: <IconCalendarUser size={DEF_ICON_SIZE} /> },
    { name: "Favoritos", href: "/favoritos", icon: <IconHeartFilled size={DEF_ICON_SIZE} /> },
];
const SELECTED_ICON_SIZE = 18;

export default function Navigation({ categoriesList }: { categoriesList: CategoryLink[] }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathName = usePathname();
    const linkRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [translateLeft, setTranslateLeft] = useState<number | null>(null);
    const [showSelectArrow, setShowSelectArrow] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        if (!findSelectedLink()) {
            setShowSelectArrow(false);
        } else {
            setShowSelectArrow(true);
        }
    }, [pathName]);

    const setSelectionDisplay = (element: HTMLElement) => {
        setTranslateLeft(element.offsetLeft + (element.offsetWidth - SELECTED_ICON_SIZE) / 2);
    };
    const isCurrentPath = (link: string) => {
        if (link === "/") {
            return pathName === "/";
        }
        return pathName.toLowerCase().startsWith(link.toLowerCase());
    };
    const findSelectedLink = () => {
        const activeLinkIndex = links.findIndex((link) => isCurrentPath(link.href));
        const activeLinkElement = linkRefs.current[activeLinkIndex]?.parentElement;
        if (activeLinkElement) {
            setSelectionDisplay(activeLinkElement);
            return true;
        }
        return false;
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && !showSelectArrow) {
                findSelectedLink();
                setShowSelectArrow(true);
            } else if (window.innerWidth < 1024 && showSelectArrow) {
                setShowSelectArrow(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [findSelectedLink]);

    const loggedOptions = [
        {
            key: "profile",
            content: <p className="font-semibold">{session?.user?.name}</p>,
            className: "h-14 gap-2",
        },
        { key: "dashboard", content: "Dashboard", href: "/dashboard" },
        {
            key: "logout",
            content: "Cerrar sesión",
            color: "danger",
            onClick: () => signOut({ callbackUrl: "/calentario" }),
        },
    ];

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-50 border-b-white/10 border-b-1 bg-nova-darker lg:bg-nova-darker/50 lg:backdrop-blur-md transition-colors h-[73px]`}>
            <div className="xl:container mx-auto h-full">
                <Navbar
                    isMenuOpen={isMenuOpen}
                    maxWidth="full"
                    isBlurred={false}
                    onMenuOpenChange={setIsMenuOpen}
                    className={`bg-transparent h-full`}
                    classNames={{
                        menuItem: " text-md",
                        menu: "bg-tg-dark px-3 gap-1 pt-5",
                    }}>
                    <NavbarContent className="lg:hidden" justify="start">
                        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                    </NavbarContent>

                    <NavbarContent className="lg:hidden pr-3" justify="center">
                        <NavbarBrand>
                            <Link href={links[0].href}>
                                <IconTopologyRing2 className="stroke-[#258fe6]" size={50} />
                            </Link>
                        </NavbarBrand>
                    </NavbarContent>

                    <NavbarContent className="hidden lg:flex gap-4" justify="center">
                        <NavbarBrand className="py-2">
                            <Link href={links[0].href}>
                                <IconTopologyRing2 className="stroke-[#258fe6]" size={50} />
                            </Link>
                        </NavbarBrand>
                        {links.filter(link => !link.isSubcategory).map((link, index) => (
                            <NavbarItem key={`${index}`} className={`h-full relative`} data-active={pathName === link.href ? "true" : undefined}>
                                <div
                                    ref={(link) => {
                                        linkRefs.current[index] = link;
                                    }}
                                    className={`flex items-center h-full ${
                                        isCurrentPath(link.href) ? "text-violet-50 hover:text-nova-link" : "text-gray-400 hover:text-nova-link"
                                    }`}>
                                    {link.isCategories ? <TooltipLink {...link} categoriesElements={categoriesList} /> : <DefaultLink {...link} />}
                                </div>
                            </NavbarItem>
                        ))}
                        {translateLeft && (
                            <IconTriangle
                                className={`absolute left-0 bottom-0 stroke-[#258fe6] pointer-events-none transition-[transform,opacity] ${
                                    showSelectArrow ? "opacity-100" : "opacity-0"
                                } stroke-[3]`}
                                size={SELECTED_ICON_SIZE}
                                style={{ transform: `translate(${translateLeft}px, 10px) scaleY(0.9)` }}
                            />
                        )}
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem className="flex gap-1">
                            <Search />
                            <Button
                                as={Link}
                                href="/search"
                                className="h-[40px] flex items-center px-4 min-w-0 bg-transparent lg:bg-nova-darker-2/50  border-1 border-white/20 "
                                radius="full"
                                onClick={() => setShowSelectArrow(false)}>
                                <IconAdjustmentsSearch className="stroke-1 hidden lg:block" />
                                <IconSearch className="stroke-1 block lg:hidden" />
                            </Button>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarContent className="hidden lg:flex" justify="center">
                        <div>
                            {session && (
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <Avatar
                                            isBordered
                                            color="secondary"
                                            as="button"
                                            size="md"
                                            className="transition-transform"
                                            name={session.user.name?.slice(0, 2)}
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                                        {loggedOptions.map((item) => (
                                            <DropdownItem key={item.key} className={item.className} onClick={item.onClick} href={item.href}>
                                                {item.content}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        </div>
                    </NavbarContent>

                    <NavbarMenu
                        className="bg-nova-darker backdrop-blur-sm"
                        motionProps={{
                            initial: { opacity: 0, transform: "translateY(-50px)" },
                            animate: { opacity: 1, transform: "translateY(0)" },
                            exit: { opacity: 0, transform: "translateY(-50px)" },
                            transition: { type: "easeInOut", duration: 0.2 },
                        }}>
                        {links.map((link, index) => (
                            <NavbarMenuItem key={`${index}`}>
                                <Link
                                    className={`rounded-lg w-full transition-colors ease-in-out flex items-center gap-2  ${
                                        isCurrentPath(link.href)
                                            ? "bg-nova-button/10 hover:bg-nova-buttonm/20 text-[#258fe6]"
                                            : "hover:bg-nova-button/5"
                                    } ${link.isSubcategory ? "py-2 pl-7 text-sm" : "py-3 px-4"}`}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}>
                                    {link.icon}
                                    <span className="uppercase font-semibold">{link.name}</span>
                                </Link>
                            </NavbarMenuItem>
                        ))}
                        {session?.user.role === Role.ADMIN && (
                            <NavbarMenuItem>
                                <Link
                                    className={`rounded-lg w-full transition-colors ease-in-out flex items-center gap-2  ${
                                        isCurrentPath("/dashboard")
                                            ? "bg-nova-button/10 hover:bg-nova-buttonm/20 text-[#258fe6]"
                                            : "hover:bg-nova-button/5"
                                    } py-3 px-4`}
                                    href={"/dashboard"}
                                    onClick={() => setIsMenuOpen(false)}>
                                    DASHBOARD
                                </Link>
                            </NavbarMenuItem>
                        )}
                    </NavbarMenu>
                </Navbar>
            </div>
        </div>
    );
}
