import prisma from "@/app/lib/db";
import { tfgFields } from "@/app/types/prismaFieldDefs";
import iRedis from "@/app/lib/iRedis";
import { badResponse, successResponse } from "@/app/utils/util";
import { getAllCategories } from "@/app/lib/fetchCategories";

export async function GET() {
    const categories = await getAllCategories();
    return successResponse(categories);
}
