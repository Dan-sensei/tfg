import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { Role } from "@/app/lib/enums";
import DefenseButton from "@/app/dashboardComponents/defenseButton";
import DefenseList from "./defenseList";
import { DefenseData, Location } from "@/app/types/interfaces";
import * as v from "valibot";
import { YearMonthSchema } from "@/app/lib/schemas";
import { endOfMonthUTC, startOfMonthUTC } from "@/app/utils/util";

type Props = {
    searchParams?: {
        year?: string;
        month?: string;
        collegeId?: string;
    };
};
export default async function DefenseArea({ searchParams }: Props) {
    const session = await getServerSession(authOptions);
    if (!session) return redirect("/dashboard");

    const yearMonthResult = v.safeParse(YearMonthSchema, { year: parseInt(searchParams?.year ?? ""), month: parseInt(searchParams?.month ?? "") });

    const { year, month } = yearMonthResult.output as v.InferInput<typeof YearMonthSchema>;
    const month0Based = month - 1;

    // If user is not admin, then he can only see his college's defenses
    let collegeId: number | null;

    if (session.user.role !== Role.ADMIN) {
        collegeId = session.user.collegeId;
    } else {
        const parsedCollegeId = parseInt(searchParams?.collegeId ?? "", 10);
        collegeId = isNaN(parsedCollegeId) ? null : parsedCollegeId;
    }

    const defenses = (await prisma.defense.findMany({
        where: {
            startTime: {
                gte: startOfMonthUTC(new Date(year, month0Based, 15)),
                lte: endOfMonthUTC(new Date(year, month0Based, 15)),
            },
            ...(collegeId? { collegeId } : {}),
        },
        select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
            collegeId: true,
            location: {
                select: {
                    id: true,
                    name: true,
                    mapLink: true,
                },
            },
        },
        orderBy: {
            startTime: "asc",
        },
    })) as DefenseData[];

    const locations = (await prisma.location.findMany({
        where: collegeId ? { collegeId } : {},
        select: {
            id: true,
            name: true,
            mapLink: true,
        },
        orderBy: {
            name: "asc",
        }
    })) as Location[];

    return (
        <main className="w-full flex flex-col">
            <h1 className="text-3xl font-semibold">Defensas</h1>
            <DefenseList defLocations={locations} defenses={defenses} year={year} month={month} />
        </main>
    );
}
