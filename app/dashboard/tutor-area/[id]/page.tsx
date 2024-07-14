import prisma from "@/app/lib/db";
import { iDetailsTFG } from "@/app/types/interfaces";
import TutorPanel from "./tutorPanel";
import { Role, TFGStatus, TFGStatusText } from "@/app/lib/enums";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { redirect } from "next/navigation";
import { IconX } from "@tabler/icons-react";
type Props = {
    params: {
        id: string;
    };
};
export default async function ProjectReview({ params }: Props) {
    const projectID = parseInt(params.id);
    const session = await getServerSession(authOptions);
    if (!session || ![Role.TUTOR, Role.MANAGER, Role.ADMIN].includes(session.user.role as Role)) return redirect("/dashboard");

    const userId = session.user.uid;

    if (isNaN(projectID))
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-xl bg-grid">
                Invalid project ID:
                <div className="text-yellow-500 text-3xl">{params.id}</div>
            </div>
        );

    const tfgRaw = await prisma.tfg.findFirst({
        where: {
            id: projectID,
        },
        select: {
            id: true,
            title: true,
            description: true,
            authors: {
                select: {
                    name: true,
                    image: true,
                },
            },
            tutors: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
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
            college: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            titulation: {
                select: {
                    id: true,
                    name: true,
                },
            },
            status: true,
            contentBlocks: true,
            pages: true,
            documentLink: true,
            banner: true,
            tags: true,
            views: true,
            score: true,
            createdAt: true,
            thumbnail: true,
            _count: {
                select: {
                    reviewMessages: {
                        where: {
                            reads: {
                                none: {
                                    userId: userId,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!tfgRaw) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-xl bg-grid">
                Could not find project with ID:
                <div className="text-yellow-500 text-3xl">{params.id}</div>
            </div>
        );
    }

    if (!tfgRaw.tutors.find((tutor) => tutor.user.id === userId)) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-xl bg-grid">
                <IconX size={80} className="text-nova-error stroke-1" />
                No eres tutor de este proyecto
            </div>
        );
    }

    const TFG: iDetailsTFG = {
        id: tfgRaw.id,
        thumbnail: tfgRaw.thumbnail,
        banner: tfgRaw.banner,
        title: tfgRaw.title,
        description: tfgRaw.description,
        author: tfgRaw.authors,
        tutors: tfgRaw.tutors.map((tutor) => tutor.user),
        department: tfgRaw.department,
        contentBlocks: tfgRaw.contentBlocks,
        pages: tfgRaw.pages,
        documentLink: tfgRaw.documentLink,
        views: tfgRaw.views,
        score: tfgRaw.score,
        createdAt: tfgRaw.createdAt,
        tags: tfgRaw.tags,
        college: tfgRaw.college,
    };

    return (
        <div className="flex relative overflow-hidden w-full">
            <TutorPanel
                extraInfo={{
                    category: tfgRaw.category,
                    status: tfgRaw.status as TFGStatus,
                    titulation: tfgRaw.titulation,
                }}
                hasUnreadMessages={tfgRaw._count.reviewMessages > 0}
                TFG={TFG}
            />
        </div>
    );
}
