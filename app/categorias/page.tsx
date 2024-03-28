import Link from "next/link";
import { Category } from "../types/interfaces";
import { IconBuildingBank } from "@tabler/icons-react";
import prisma from "../lib/db";

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
    return categories;
}

export default async function Categorias() {
    const categories: Category[] = await getAllCategories();
    return (
        <div className="py-5 lg:pt-0">
            <h1 className="text-2xl font-bold mb-3">Categorias</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
                {categories.map((c, i) => {
                    return (
                        <Link
                            key={i}
                            href={`/categoria/${c.id}`}
                            className="p-3 rounded-xl bg-slate-800 text-center transition-all hover:scale-105"
                        >
                            <div className="text-center py-4">
                                <IconBuildingBank
                                    className="stroke-1 mx-auto"
                                    size={64}
                                />
                            </div>
                            <div className="pb-3">{c.name}</div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
