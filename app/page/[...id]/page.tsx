import Image from "next/image";
import TFGDetails from "@/app/page/[...id]/TFGDetails";
import { increaseTFGViews } from "@/app/lib/actions/tfg";
import { redirect } from "next/navigation";
import { iFullTFG } from "@/app/types/interfaces";
import { IconChevronRight, IconCloudDownload, IconDownload, IconEye } from "@tabler/icons-react";
import prisma from "@/app/lib/db";
import { tfgFullFields } from "@/app/types/prismaFieldDefs";
import { montserrat } from "@/app/lib/fonts";
import Info from "./InfoComponent";
import { Role } from "@/app/lib/enums";

const getTFGData = async (id: number) => {
    const tfgRaw = await prisma.tfg.findUnique({
        where: {
            id: id,
        },
        select: tfgFullFields,
    });

    if (!tfgRaw) return null;

    const tfg: iFullTFG = {
        id: tfgRaw.id,
        thumbnail: tfgRaw.thumbnail,
        banner: tfgRaw.banner,
        title: tfgRaw.title,
        description: tfgRaw.description,
        author: tfgRaw.users
            .filter((userRelation) => userRelation.user.role === Role.STUDENT)
            .map((userRelation) => ({
                name: userRelation.user.name,
                contactDetails: userRelation.user.contactDetails ?? undefined,
                image: userRelation.user.image ?? undefined,
            })),
        tutor: tfgRaw.users
            .filter((userRelation) => userRelation.user.role === Role.TUTOR)
            .map((userRelation) => ({
                name: userRelation.user.name,
                contactDetails: userRelation.user.contactDetails ?? undefined,
                image: userRelation.user.image ?? undefined,
            })),
        department: tfgRaw.department
            ? {
                  name: tfgRaw.department.name,
                  link: tfgRaw.department.link ?? undefined,
              }
            : undefined,
        content: tfgRaw.content,
        pages: tfgRaw.pages,
        documentLink: tfgRaw.documentLink,
        tags: tfgRaw.tags,
        views: tfgRaw.views,
        score: tfgRaw.score,
        createdAt: tfgRaw.createdAt,
        college: {
            name: tfgRaw.college.name,
            image: tfgRaw.college.image ?? undefined,
        },
    };
    return tfg;
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id[0]);
    if (isNaN(id)) {
        redirect("/");
    }

    const TFG = await getTFGData(id);
    if (!TFG) {
        redirect("/");
    }
    await increaseTFGViews(parseFloat(params.id));

    return (
        <div className="pt-[66px]">
            <div className="aspect-video lg:aspect-wide relative z-0 grid grid-stack max-h-[600px] w-full">
                <div className="hidden z-40 pl-16 pt-12 pb-8 md:grid grid-cols-6 text-shadow-light-dark/20 lg:container mx-auto">
                    <div className={`${montserrat.className} col-span-4 lg:col-span-3 `}>
                        <Info TFG={TFG} />
                    </div>
                </div>
                <div className="h-full hidden md:block w-full bg-gradient-to-r from-nova-darker-2/80 to-80% z-20"></div>
                <Image src={TFG.banner} priority draggable="false" alt={TFG.title} fill className="object-cover z-10" />
                <div className="h-[70px] w-full absolute left-0 z-10 bottom-0 bg-gradient-to-t from-dark pointer-events-none"></div>
            </div>

            <div className="block md:hidden p-5">
                <Info TFG={TFG} />
            </div>

            <TFGDetails />
        </div>
    );
}
