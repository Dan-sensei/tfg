import { iFullTFG, iTFG } from "@/app/types/interfaces";
import Image from "next/image";
import prisma from "@/app/lib/db";
import TFGDetails from "@/app/components/TFGDetails";
import {headers} from 'next/headers';
import { increaseTFGViews } from "@/app/lib/actions";
import { redirect } from "next/navigation";

async function getPage(id: number) {
    const tfg = (await prisma.tFG.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            thumbnail: true,
            banner: true,
            title: true,
            description: true,
            author: true,
            tutor: true,
            content: true,
            pages: true,
            documentLink: true,
            tags: true,
            views: true,
            score: true,
            createdAt: true,
        },
    })) as iFullTFG;

    return tfg;
}
async function updateViews(id: number, views: number) {
    console.log(id)
    const result = await prisma.tFG.update({
        where: {
            id: id,
        },
        data: {
            views: {
                increment: 1
            },
        },
    });
    console.log(result)
}



export default async function Page({params }: { params: { id: string } }) {
    const id = Number(params.id[0])
    if(isNaN(id)) {
        redirect("/");
    }
    const TFG = await getPage(id);
    increaseTFGViews(parseFloat(params.id));
    //updateViews(id, TFG.views);
    //updateViews(parseFloat(params.id), TFG.views);
    
    return (
        <div className="-mt-[134px] -mx-4 md:-mx-14 ">
            <div className="aspect-wide relative z-0">
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
                <div className="absolute z-20 right-0 pr-10 -top-11 shadow-2xl">
                    <div className="aspect-file w-32 rounded-xl relative overflow-hidden  border-white border-small">
                        <Image
                            src={TFG.thumbnail}
                            draggable="false"
                            fill
                            className="object-cover"
                            alt="Download"
                        />
                    </div>
                    <div className="text-gray-300 text-lg">
                        Descargar <br /> memoria
                    </div>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="text-5xl font-bold">{TFG.title}</div>
                    <div className="text-3xl font-bold text-gray-400 mt-2">
                        {TFG.author}
                    </div>
                    <div className="text-2xl font-bold text-gray-600 mt-2">
                        Tutor: {TFG.tutor}
                    </div>
                    <div className="text-2xl font-bold text-gray-600 mt-2">
                        View: {TFG.views}
                    </div>
                </div>
            </div>
            <TFGDetails />
        </div>
    );
}
