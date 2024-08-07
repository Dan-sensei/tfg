import { getServerSession } from "next-auth";
import ProjectForm from "./form";
import prisma from "@/app/lib/db";
import { authOptions } from "@/app/lib/authOptions";
import { Role, TFGStatus } from "@/app/lib/enums";
import { Category, Titulation, FullDepartment, FullUser, ProjectFormData } from "@/app/types/interfaces";
import { getTopTags } from "@/app/lib/fetchData";
import { redirect } from "next/navigation";
import { BlockInfo, TFG_BLockElement } from "@/app/components/TFG_BlockDefinitions/BlockDefs";

export default async function Project() {
    const session = await getServerSession(authOptions);
    if (!session) return redirect("/dashboard");
    const college = await prisma.college.findUnique({
        where: {
            id: session.user.collegeId,
        },
        select: {
            name: true,
            image: true,
            titulations: {
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
            status: true,
            authors: {
                select: {
                    id: true,
                    name: true,
                    socials: true,
                    image: true,
                    role: true,
                    showImage: true,
                    personalPage: true,
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

    const categories: Category[] = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    if (!college) {
        return null;
    }
    const tutors: FullUser[] = college.user;
    const titulations: Titulation[] = college.titulations;
    const departments: FullDepartment[] = college.departments;

    const popularTags = await getTopTags(10);
    let authors: FullUser[] = [];
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
        authors = tfgRaw.authors.map((author) => ({
            id: author.id,
            name: author.name,
            image: author.image,
            role: author.role,
            socials: author.socials,
            showImage: author.showImage,
            personalPage: author.personalPage,
        }));
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
            authors={authors}
            tfg={tfg}
            college={{ id: session.user.collegeId, name: college.name, image: college.image }}
            departments={departments}
            tutors={tutors}
            titulations={titulations}
            categories={categories}
            popularTags={popularTags.map((t) => t.tag)}
            projectStatus={tfgRaw ? tfgRaw.status : null}
        />
    );
}
