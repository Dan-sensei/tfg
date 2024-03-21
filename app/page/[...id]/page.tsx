import Image from "next/image";
import TFGDetails from "@/app/components/TFGDetails";
//import { increaseTFGViews } from "@/app/lib/actions";
import { redirect } from "next/navigation";
import { iFullTFG } from "@/app/types/interfaces";
import { IconCloudDownload } from "@tabler/icons-react";
import prisma from "@/app/lib/db";
import { tfgFullFields } from "@/app/types/prismaFieldDefs";

const getTFGData = async (id: number) => {
    const tfg = (await prisma.tFG.findUnique({
        where: {
            id: id,
        },
        select: tfgFullFields,
    })) as iFullTFG;
    return tfg;
}

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id[0]);
    if (isNaN(id)) {
        redirect("/");
    }

    const TFG: iFullTFG = await getTFGData(id);

    //await increaseTFGViews(parseFloat(params.id));

    return (
        <div className="lg:-mt-[134px] -mx-4 md:-mx-14 ">
            <div className="aspect-video lg:aspect-wide relative z-0">
                <Image
                    src={TFG.banner}
                    priority
                    draggable="false"
                    alt={TFG.title}
                    fill
                    className="object-cover z-10"
                />
                <div className="h-[70px] w-full absolute left-0 z-10 bottom-0 bg-gradient-to-t from-dark pointer-events-none"></div>
            </div>

            <div className="text-center -mt-8 relative z-10">
                <div className="max-w-4xl mx-auto px-2 lg:px-0">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                        {TFG.title}
                    </div>
                    <div className="text-xl lg:text-3xl font-bold text-gray-400 lg:mt-2">
                        {TFG.author}
                    </div>
                    <div className="text-lg lg:text-2xl font-bold text-gray-600 lg:mt-2">
                        Tutor: {TFG.tutor}
                    </div>
                </div>
                <div className="block xl:absolute z-20 right-0 xl:pr-10 -top-11 shadow-2xl mt-7 xl:mt-0">
                    <button className="group">
                        <div className="h-28 xl:h-auto w-96 max-w-full xl:aspect-file xl:w-32 rounded-xl relative overflow-hidden mx-auto border-white border-small">
                            <div className="w-full h-full relative z-10 items-center transition-opacity opacity-0 group-hover:opacity-100 grid grid-stack">
                                <IconCloudDownload
                                    size={48}
                                    className="mx-auto duration-500 -translate-y-2 group-hover:translate-y-0 z-10 drop-shadow-glow"
                                />
                                <div className="bg-black/50 w-full h-full scale-150 duration-500 blur-md translate-y-[150%] ease-out group-hover:translate-y-0 z-0"></div>
                            </div>
                            <Image
                                src={TFG.thumbnail}
                                draggable="false"
                                fill
                                className="object-cover relative z-0"
                                alt="Download"
                            />
                        </div>
                        <div className="text-gray-300 text-lg pt-2">
                            <div className="inline-block relative after:absolute after:w-full after:origin-center after:duration-700 after:scale-0 group-hover:after:scale-100 after:bottom-0 after:left-0 after:opacity-80 after:h-[1px] after:bg-white">
                                Descargar memoria
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <TFGDetails />
        </div>
    );
}
