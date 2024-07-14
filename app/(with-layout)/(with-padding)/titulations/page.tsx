import Link from "next/link";
import { TitulationByCollege } from "@/app/types/interfaces";
import { getAllTitulationsByCollege } from "@/app/lib/fetchData";
import { sanitizeString } from "@/app/utils/util";

export default async function Categorias() {
    const titulationsByCollege: TitulationByCollege[] = await getAllTitulationsByCollege();
    return (
        <div className="py-5 lg:pt-0">
            {titulationsByCollege.map((college) => (
                <div key={college.collegeId} className="flex flex-col mb-5">
                    <h1 className="text-2xl font-bold mb-3">{college.collegeName}</h1>
                    <div className="grid gap-3 w-full grid-cols-2 sm:grid-auto-13rem">
                        {college.titulations.map((t, i) => {
                            return (
                                <Link
                                    key={i}
                                    href={`/titulation/${t.id}/${sanitizeString(t.name)}`}
                                    className="rounded-xl bg-[#07090c] font-semibold flex items-center justify-center text-center transition-all py-10 border-1 border-white/5 hover:bg-white/10">
                                    <div>{t.name}</div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
