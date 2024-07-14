import Link from "next/link";
import { Category } from "@/app/types/interfaces";
import { IconBuildingBank } from "@tabler/icons-react";
import { getAllCategories } from "@/app/lib/fetchData";
import { sanitizeString } from "@/app/utils/util";
import { s_cache } from "@/app/lib/cache";

const getCachedCategories = s_cache(
    async () => {
        return await getAllCategories();
    },
    ["categories"],
    {
        tags: ["categories"],
    }
);

export default async function Categorias() {
    const categories: Category[] = await getCachedCategories();
    return (
        <div className="py-5 lg:pt-0">
            <h1 className="text-2xl font-bold mb-3">Categorias</h1>
            <div className="grid gap-3 w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                {categories.map((c, i) => {
                    return (
                        <Link
                            key={i}
                            href={`/categoria/${c.id}/${sanitizeString(c.name)}`}
                            className="rounded-xl  bg-[#07090c] font-semibold flex items-center justify-center text-center transition-all py-10 border-1 border-white/5 hover:bg-white/10">
                            <div>{c.name}</div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
