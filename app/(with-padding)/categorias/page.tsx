import Link from "next/link";
import { Category } from "@/app/types/interfaces";
import { IconBuildingBank } from "@tabler/icons-react";
import { getAllCategories } from "@/app/lib/fetchData";


export default async function Categorias() {
    const categories: Category[] = await getAllCategories();
    return (
        <div className="py-5 lg:pt-0">
            <h1 className="text-2xl font-bold mb-3">Categorias</h1>
            <div className="grid gap-3 w-full grid-cols-2 sm:grid-auto-13rem">
                {categories.map((c, i) => {
                    return (
                        <Link
                            key={i}
                            href={`/categoria/${c.id}`}
                            className="rounded-xl flex items-center justify-center text-center transition-all aspect-square border-1 border-white/50 hover:bg-white/10"
                        >
                            <div>
                                <div className="text-center py-4">
                                    <IconBuildingBank
                                        className="stroke-1 mx-auto"
                                        size={64}
                                    />
                                </div>
                                <div className="pb-3">{c.name}</div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
