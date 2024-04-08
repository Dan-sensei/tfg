import Image from "next/image";
import TFGDetails from "@/app/page/[...id]/TFGDetails";
import { increaseTFGViews } from "@/app/lib/actions/tfg";
import { redirect } from "next/navigation";
import { iFullTFG } from "@/app/types/interfaces";
import {
    IconChevronRight,
    IconCloudDownload,
    IconDownload,
    IconEye,
} from "@tabler/icons-react";
import prisma from "@/app/lib/db";
import { tfgFullFields } from "@/app/types/prismaFieldDefs";
import { montserrat } from "@/app/lib/fonts";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import Info from "./InfoComponent";

const getTFGData = async (id: number) => {
    const tfg = (await prisma.tFG.findUnique({
        where: {
            id: id,
        },
        select: tfgFullFields,
    })) as iFullTFG;
    return tfg;
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id[0]);
    if (isNaN(id)) {
        redirect("/");
    }

    const TFG: iFullTFG = await getTFGData(id);

    await increaseTFGViews(parseFloat(params.id));

    return (
        <div className="pt-[66px]">
            <div className="aspect-video lg:aspect-wide relative z-0 grid grid-stack max-h-[600px] w-full">
                <div className="hidden z-40 pl-16 pt-12 pb-8 md:grid grid-cols-6 text-shadow-light-dark/20 lg:container mx-auto">
                    <div
                        className={`${montserrat.className} col-span-4 lg:col-span-3 `}
                    >
                        <Info TFG={TFG} />
                    </div>
                </div>
                <div className="h-full hidden md:block w-full bg-gradient-to-r from-nova-darker-2/80 to-80% z-20"></div>
                <Image
                    src={TFG.banner}
                    priority
                    draggable="false"
                    alt={TFG.title}
                    fill
                    className="object-cover z-10"
                />
                <div className="h-[70px] w-full absolute left-0 z-10 bottom-0 bg-gradient-to-t from-dark pointer-events-none"></div>
            </div>

            <div className="block md:hidden p-5">
                <Info TFG={TFG} />
            </div>

            <TFGDetails />
        </div>
    );
}
