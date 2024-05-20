
import { successResponse } from "@/app/utils/util";
import { getAllCategories } from "@/app/lib/fetchCategories";
import prisma from "@/app/lib/db";
import { Titulation } from "@/app/types/interfaces";

export async function GET() {
    const titulations = (await prisma.titulation.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })) as Titulation[];
    
    return successResponse(titulations);
}
