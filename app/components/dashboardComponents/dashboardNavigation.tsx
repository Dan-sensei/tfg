"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/navbar";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FullCollege, LinkProps } from "@/app/types/interfaces";
import {
    IconArrowLeft,
    IconBox,
    IconCalendarClock,
    IconCalendarUser,
    IconCategoryFilled,
    IconEyeUp,
    IconHeartFilled,
    IconHome,
    IconHomeFilled,
    IconListDetails,
    IconPasswordUser,
    IconSchool,
    IconSitemap,
    IconStarFilled,
    IconTrendingUp,
    IconUserScan,
} from "@tabler/icons-react";
import { DEF_ICON_SIZE, ROLE_NAMES } from "@/app/types/defaultData";
import { useSession } from "next-auth/react";
import { Avatar } from "@nextui-org/avatar";
import { Role } from "../../lib/enums";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import clsx from "clsx";

import "simplebar-react/dist/simplebar.min.css";
import { useDashboard } from "../../contexts/DashboardContext";
import Autocomplete from "../Autocomplete";

interface Props {
    className?: string;
}

const iconStyles = "stroke-2 w-5 h-5 mx-0";

const CommonLinks: LinkProps[] = [
    { name: "Home", href: "/dashboard", icon: <IconHome className={iconStyles} /> },
    { name: "Perfil", href: "/dashboard/profile", icon: <IconUserScan className={iconStyles} /> },
    { name: "Proyecto", href: "/dashboard/project", icon: <IconBox className={iconStyles} /> },
];

const TutorLinks: LinkProps[] = [
    ...CommonLinks,
    { name: "Área tutor", href: "/dashboard/tutor-area", icon: <IconSchool className={iconStyles} /> },
];

const ManagerLinks: LinkProps[] = [
    ...TutorLinks,
    { name: "Área gestión", href: "/dashboard/manager-area", icon: <IconSitemap className={iconStyles} /> },
    { name: "Defensas", href: "/dashboard/defense-area", icon: <IconCalendarClock className={iconStyles} /> },
    { name: "Todos los proyectos", href: "/dashboard/all-projects", icon: <IconListDetails className={iconStyles} /> },
];

const LinksByRole = {
    [Role.STUDENT]: CommonLinks,
    [Role.TUTOR]: TutorLinks,
    [Role.MANAGER]: ManagerLinks,
    [Role.ADMIN]: ManagerLinks,
};

export default function DashboardNavigation({ className }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();
    const pathName = usePathname();
    const { collegeId, setCollege, allColleges } = useDashboard();

    const avatarProp = useMemo(() => {
        return session?.user?.image ? { src: session.user.image } : { name: session?.user?.name?.slice(0, 2) ?? "-" };
    }, [session]);

    if (!session) {
        return null;
    }

    const userRole = session.user.role as Role;

    const links = LinksByRole[userRole];

    const isCurrentPath = (link: string) => {
        if (link === "/dashboard") {
            return pathName === "/dashboard";
        }
        return pathName.toLowerCase().startsWith(link.toLowerCase());
    };
    return (
        <>
            <div className="hidden xl:block absolute left-0 top-0 h-full w-60 pt-3 pl-3 pb-3">
                <nav className="flex flex-col transition-width w-full h-full self-stretch gap-3 left-0">
                    <Button
                        as={Link}
                        href="/home"
                        className="rounded-lg w-full transition-colors ease-in-out flex relative justify-start items-center py-3 px-4 bg-blue-700 p-3 border-1 border-white/5 hover:bg-nova-buttonm/10  border-l-2 ">
                        <IconArrowLeft size={DEF_ICON_SIZE} />
                        Volver
                    </Button>
                    <div className="flex-1 flex flex-col relative justify-between bg-gray-900 p-3 rounded-lg border-1 border-white/5">
                        <section className="py-3 flex flex-col items-center justify-center">
                            <div className="pb-5 font-semibold text-nova block">DASHBOARD</div>
                            <div className="relative flex items-center justify-center w-full pt-5">
                                <div className="h-1px mask-borders absolute w-full left-0 bg-white"></div>
                                <Avatar color="primary" as="button" size="lg" className="transition-transform" {...avatarProp} />
                            </div>
                            <h1 className="pt-2 text-sm">{session.user.name}</h1>
                            <h1 className="text-tiny text-gray-400">{ROLE_NAMES[session.user.role as Role]}</h1>
                            {session?.user.role === Role.ADMIN && (
                                <Autocomplete
                                    required
                                    className="max-w-full w-96"
                                    data={allColleges}
                                    value={allColleges.find((c) => c.id === collegeId) ?? allColleges[0]}
                                    placeholder="Buscar..."
                                    onChange={(value) => {
                                        if (value) setCollege(value);
                                    }}
                                    displayValue={(c: FullCollege | null) => (c ? c.name : "fg")}
                                    defaultValue={<div className="text-sm/6 text-default-600">(Nueva localización)</div>}
                                />
                            )}
                        </section>
                        <section className="flex flex-col gap-2 py-10">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    className={`rounded-lg w-full transition-colors ease-in-out flex relative
                                    items-center gap-2  ${
                                        isCurrentPath(link.href)
                                            ? "bg-nova-button/10 hover:bg-nova-buttonm/10 text-[#258fe6] border-l-2 border-l-cyan-600"
                                            : "hover:bg-nova-button/10"
                                    } py-3 px-4`}
                                    href={link.href}>
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                        </section>
                        <section className="flex justify-center ">
                            <SignOutButton />
                        </section>
                    </div>
                </nav>
            </div>
            <Navbar
                isMenuOpen={isMenuOpen}
                maxWidth="full"
                isBlurred={false}
                onMenuOpenChange={setIsMenuOpen}
                className={`bg-transparent h-full`}
                classNames={{
                    base: `${clsx(className)}`,
                    wrapper: "bg-nova-darker border-b-1 border-white/10",
                    menuItem: " text-md",
                    menu: "bg-tg-dark px-3 gap-1 pt-5",
                }}>
                <NavbarContent className="xl:hidden" justify="start">
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                </NavbarContent>

                <NavbarContent className="xl:hidden pr-3" justify="center">
                    <NavbarBrand className="text-white font-semibold text-xl uppercase flex items-center gap-3 ">
                        {session?.user.role === Role.ADMIN && (
                            <Autocomplete
                                required
                                className="max-w-full w-56"
                                data={allColleges}
                                value={allColleges.find((c) => c.id === collegeId) ?? allColleges[0]}
                                placeholder="Buscar..."
                                onChange={(value) => {
                                    if (value) setCollege(value);
                                }}
                                displayValue={(c: FullCollege | null) => (c ? c.name : "fg")}
                                defaultValue={<div className="text-sm/6 text-default-600">(Nueva localización)</div>}
                            />
                        )}
                        Dashboard
                    </NavbarBrand>
                </NavbarContent>

                <NavbarMenu
                    className="bg-nova-darker backdrop-blur-sm"
                    motionProps={{
                        initial: { opacity: 0, transform: "translateY(-50px)" },
                        animate: { opacity: 1, transform: "translateY(0)" },
                        exit: { opacity: 0, transform: "translateY(-50px)" },
                        transition: { type: "easeInOut", duration: 0.2 },
                    }}>
                    <NavbarMenuItem>
                        <Link
                            className={`rounded-lg w-full transition-colors ease-in-out flex items-center gap-2
                                py-3 px-4
                            `}
                            href={"/home"}
                            onClick={() => setIsMenuOpen(false)}>
                            <IconArrowLeft size={DEF_ICON_SIZE} />
                            Volver
                        </Link>
                    </NavbarMenuItem>
                    <Divider />
                    {links.map((link, index) => (
                        <NavbarMenuItem key={`${index}`}>
                            <Link
                                className={`rounded-lg w-full transition-colors ease-in-out flex items-center gap-2   ${
                                    link.isSubcategory ? "py-2 pl-7 text-sm" : "py-3 px-4"
                                }`}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}>
                                {link.icon}
                                <span className="uppercase font-semibold">{link.name}</span>
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
        </>
    );
}
