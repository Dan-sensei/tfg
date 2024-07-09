import { successResponse } from "@/app/utils/util";
import { getAllCategories } from "@/app/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET() {
    const categories = await getAllCategories();
    return successResponse(categories);
}
