import Link from "next/link";
import { Category } from "../types/interfaces";
import { IconBuildingBank } from "@tabler/icons-react";

export default async function Categorias() {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/categories`;

    const response = await fetch(baseUrl, {
        next: { tags: ["categories"] }
    });
    
    const categories: Category[] = await response.json();
    return (
        <div>
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
