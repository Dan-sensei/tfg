import { getServerSession } from "next-auth";
import ProjectForm from "./form";
import prisma from "@/app/lib/db";
import { authOptions } from "@/app/lib/authOptions";
import { Role } from "@/app/lib/enums";
import { Category, Titulation, FullDepartment, FullUser, ProjectFormData } from "@/app/types/interfaces";
import { getTopTags } from "@/app/lib/fetchData";
import { redirect } from "next/navigation";
import { BlockInfo, TFG_BLockElement } from "@/app/components/TFG_BlockDefinitions/BlockDefs";



export default async function Project() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role != Role.STUDENT) return redirect("/dashboard");
    const college = await prisma.college.findUnique({
        where: {
            id: session.user.collegeId,
        },
        select: {
            name: true,
            image: true,
            titulation: {
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            },
            user: {
                where: {
                    role: {
                        in: [Role.TUTOR, Role.MANAGER, Role.ADMIN],
                    },
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                    personalPage: true,
                },
            },
            departments: {
                select: {
                    id: true,
                    link: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            },
        },
    });

    const tfgRaw = await prisma.tfg.findFirst({
        where: {
            authors: {
                some: {
                    id: session.user.uid,
                },
            },
        },
        select: {
            id: true,
            thumbnail: true,
            banner: true,
            title: true,
            description: true,
            authors: {
                select: {
                    id: true,
                    name: true,
                    socials: true,
                    image: true,
                    role: true,
                },
            },
            tutors: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            role: true,
                            personalPage: true,
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
            contentBlocks: true,
            pages: true,
            documentLink: true,
            tags: true,
        },
    });

    const categories = (await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    })) as Category[];

    if (!college) {
        return null;
    }
    const tutors: FullUser[] = college.user;
    const titulations: Titulation[] = college.titulation;
    const departments: FullDepartment[] = college.departments;

    const popularTags = await getTopTags(10);

    let tfg: ProjectFormData | null = null;
    if (tfgRaw) {
        let contentBlocks: BlockInfo[] = [];
        try {
            const tfgBlocks: TFG_BLockElement[] = JSON.parse(tfgRaw.contentBlocks);
            tfgBlocks.map((block, index) => {
                contentBlocks.push({
                    ...block,
                    id: index,
                    files: [],
                    errors: [],
                });
            });
        } catch (e) {
            console.log(e);
        }

        tfg = {
            id: tfgRaw.id,
            thumbnail: tfgRaw.thumbnail,
            banner: tfgRaw.banner,
            title: tfgRaw.title,
            description: tfgRaw.description,
            tutors: tfgRaw.tutors.map((userRelation) => ({
                id: userRelation.user.id,
                name: userRelation.user.name,
                personalPage: userRelation.user.personalPage,
                image: userRelation.user.image,
            })),
            department: tfgRaw.department,
            category: tfgRaw.category,
            titulation: tfgRaw.titulation,
            pages: tfgRaw.pages,
            contentBlocks: contentBlocks,
            documentLink: tfgRaw.documentLink,
            tags: tfgRaw.tags,
        };
    }

    return (
        <ProjectForm
            tfg={tfg}
            college={{ id: session.user.collegeId, name: college.name, image: college.image }}
            departments={departments}
            tutors={tutors}
            titulations={titulations}
            categories={categories}
            popularTags={popularTags.map((t) => t.tag)}
        />
    );
}
