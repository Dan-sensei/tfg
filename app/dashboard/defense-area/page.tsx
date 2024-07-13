import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { Role } from "@/app/lib/enums";
import DefenseButton from "@/app/components/dashboardComponents/defenseButton";
import DefenseList from "./defenseList";
import { DefenseData, Location } from "@/app/types/interfaces";
import * as v from "valibot";
import { YearMonthSchema } from "@/app/lib/schemas";
import { endOfMonthUTC, startOfMonthUTC } from "@/app/utils/util";
import { revalidatePath } from "next/cache";

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

    return (
        <main className="w-full flex flex-col">
            <h1 className="text-3xl font-semibold">Defensas</h1>
            <DefenseList year={year} month={month} />
        </main>
    );
}
