import { getServerSession } from "next-auth";
import ProjectForm from "./form";
import prisma from "@/app/lib/db";
import { authOptions } from "@/app/lib/authOptions";
import { Role } from "@/app/lib/enums";
import { user } from "@/app/types/interfaces";

export default async function Project() {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    const collegeInfo = session.user.college;
    const college = await prisma.college.findUnique({
        where: {
            id: collegeInfo.id,
        },
        select: {
            name: true,
            image: true,
            departments: {
                select: {
                    id: true,
                    link: true,
                    name: true,
                },
            },
        },
    });

    const teachers = (await prisma.user.findMany({
        where: {
            collegeId: collegeInfo.id,
            role: {
                in: [Role.TUTOR, Role.MANAGER, Role.ADMIN],
            },
        },
        select: {
            id: true,
            name: true,
            image: true,
            contactDetails: true,
        },
    })) as user[];

    if (!college) {
        return null;
    }
    const departments = college.departments.map((d) => ({
        ...d,
        link: d.link ?? undefined,
    }));

    return <ProjectForm college={{ id: collegeInfo.id, name: college.name, image: college.image }} departments={departments} teachers={teachers} />;
}
