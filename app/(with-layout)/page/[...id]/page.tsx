import { increaseTFGViews } from "@/app/lib/actions/tfg";
import { notFound, redirect } from "next/navigation";
import { iDetailsTFG } from "@/app/types/interfaces";
import prisma from "@/app/lib/db";
import TFG_Details from "@/app/components/TFG/TFG_Details";
import { TFGStatus } from "@/app/lib/enums";

const getTFGData = async (id: number) => {
    const tfgRaw = await prisma.tfg.findUnique({
        where: {
            id: id,
            status: TFGStatus.PUBLISHED,
        },
        select: {
            id: true,
            thumbnail: true,
            banner: true,
            title: true,
            description: true,
            authors: {
                select: {
                    name: true,
                    socials: true,
                    personalPage: true,
                    image: true,
                    role: true,
                },
            },
            tutors: {
                select: {
                    user: {
                        select: {
                            name: true,
                            personalPage: true,
                            image: true,
                            role: true,
                        },
                    },
                },
            },
            department: {
                select: {
                    id: true,
                    name: true,
                    link: true,
                },
            },
            contentBlocks: true,
            pages: true,
            documentLink: true,
            tags: true,
            views: true,
            score: true,
            createdAt: true,
            college: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });

    if (!tfgRaw) return null;

    const tfg: iDetailsTFG = {
        id: tfgRaw.id,
        thumbnail: tfgRaw.thumbnail,
        banner: tfgRaw.banner,
        title: tfgRaw.title,
        description: tfgRaw.description,
        author: tfgRaw.authors,
        tutors: tfgRaw.tutors.map((userRelation) => ({
            name: userRelation.user.name,
            personalPage: userRelation.user.personalPage,
            image: userRelation.user.image,
        })),
        department: tfgRaw.department,
        contentBlocks: tfgRaw.contentBlocks,
        pages: tfgRaw.pages,
        documentLink: tfgRaw.documentLink,
        tags: tfgRaw.tags,
        views: tfgRaw.views,
        score: tfgRaw.score,
        createdAt: tfgRaw.createdAt,
        college: {
            name: tfgRaw.college.name,
            image: tfgRaw.college.image,
        },
    };
    return tfg;
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id[0]);
    if (isNaN(id)) {
        return notFound();
    }

    const TFG = await getTFGData(id);
    if (!TFG) {
        return notFound();
    }

    await increaseTFGViews(parseFloat(params.id));

    return (
        <div className="pt-[73px] @container">
            <TFG_Details TFG={TFG} />
        </div>
    );
}
