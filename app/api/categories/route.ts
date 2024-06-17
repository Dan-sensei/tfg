import { successResponse } from "@/app/utils/util";
import { getAllCategories } from "@/app/lib/fetchData";

export async function GET() {
    const categories = await getAllCategories();
    return successResponse(categories);
}
