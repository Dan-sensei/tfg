"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/navbar";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MobileLinkProps } from "@/app/types/interfaces";
import {
    IconBox,
    IconCalendarUser,
    IconCategoryFilled,
    IconEyeUp,
    IconHeartFilled,
    IconHome,
    IconHomeFilled,
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
import { Role } from "../lib/enums";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";
interface Props {
    className?: string;
}

const StudentLinks: MobileLinkProps[] = [
    { name: "Home", href: "/dashboard", icon: <IconHome size={DEF_ICON_SIZE} /> },
    { name: "Perfil", href: "/dashboard/profile", icon: <IconUserScan size={DEF_ICON_SIZE} /> },
    { name: "Proyecto", href: "/dashboard/project", icon: <IconBox size={DEF_ICON_SIZE} /> },
];

const TutorLinks: MobileLinkProps[] = [...StudentLinks, { name: "Área tutor", href: "/dashboard/tutor", icon: <IconSchool size={DEF_ICON_SIZE} /> }];

const ManagerLinks: MobileLinkProps[] = [
    ...TutorLinks,
    { name: "Área gestión", href: "/dashboard/manager", icon: <IconSitemap size={DEF_ICON_SIZE} /> },
];

const AdminLinks: MobileLinkProps[] = [...ManagerLinks, { name: "Admin", href: "/dashboard/admin", icon: <IconPasswordUser size={DEF_ICON_SIZE} /> }];

const LinksByRole = {
    [Role.STUDENT]: StudentLinks,
    [Role.TUTOR]: TutorLinks,
    [Role.MANAGER]: ManagerLinks,
    [Role.ADMIN]: AdminLinks,
};

export default function DashboardNavigation({ className }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();
    const pathName = usePathname();

    const avatarProp = useMemo(() => {
        return session?.user?.image ? { src: session.user.image } : { name: session?.user?.name?.slice(0, 2) ?? "-" };
    }, [session]);

    if (!session) {
        return null;
    }

    const userRole = session.user.role as Role;

    const links = LinksByRole[userRole];

    const isCurrentPath = (link: string) => {
        if (link === "/") {
            return pathName === "/";
        }
        return pathName.toLowerCase().startsWith(link.toLowerCase());
    };
    return (
        <>
            <nav className="hidden lg:flex flex-col justify-between w-60  bg-gray-900 self-stretch p-3 rounded-lg">
                <section className="py-3 flex flex-col items-center justify-center">
                    <div className="pb-5 font-semibold text-nova">DASHBOARD</div>
                    <div className="relative flex items-center justify-center w-full pt-5">
                        <div className="h-1px mask-borders absolute w-full left-0 bg-white"></div>
                        <Avatar color="primary" as="button" size="lg" className="transition-transform" {...avatarProp} />
                    </div>
                    <h1 className="pt-2 text-sm">{session.user.name}</h1>
                    <h1 className="text-tiny text-gray-400">{ROLE_NAMES[session.user.role as Role]}</h1>
                </section>
                <section className="flex flex-col gap-2 py-10">
                    {links.map((link) => (
                        <Link
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
            </nav>
            <Navbar
                isMenuOpen={isMenuOpen}
                maxWidth="full"
                isBlurred={false}
                onMenuOpenChange={setIsMenuOpen}
                className={`bg-transparent h-full`}
                classNames={{
                    base: `${className ?? ""}`,
                    wrapper: "bg-nova-darker border-b-1 border-white/10",
                    menuItem: " text-md",
                    menu: "bg-tg-dark px-3 gap-1 pt-5",
                }}>
                <NavbarContent className="lg:hidden" justify="start">
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                </NavbarContent>

                <NavbarContent className="lg:hidden pr-3" justify="center">
                    <NavbarBrand>
                        <Link href={links[0].href}>
                            <picture>
                                <img alt="Logo" src="" />
                            </picture>
                        </Link>
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
