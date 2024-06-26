"use client";
import { Button } from "@nextui-org/button";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { DEF_ICON_SIZE } from "../types/defaultData";

export default function SignOutButton() {
    return (
        <Button
            color="danger"
            className="rounded-lg w-full justify-start transition-colors ease-in-out py-3 px-4 bg-nova-red/10 h-10 hover:bg-nova-red/20 border-l-2 border-l-nova-red"
            onClick={() => signOut({ callbackUrl: "/home" })}>
            <IconLogout className="text-red-500 w-5 h-5" size={DEF_ICON_SIZE} />
            Cerrar sesión
        </Button>
    );
}
