import prisma from "../utils/db";
import { Button } from "@nextui-org/button";


async function getTopWorks(){
    const TopWorks = await prisma.tFG.findFirst({
        select: {
            banner: true,
            title: true,
            description: true,
            views: true,
            score: true
        }
    });
    return TopWorks
}

export default async function HomeCarousel() {
    const topWorks = await getTopWorks()
    return (
        <div className="min-h-[500px] h-[40vh] lg:h-[50vh] w-full flex justify-start items-end relative mt-[-100px]">
            <img src={topWorks?.banner} alt="" className="w-full h-full object-cover pointer-events-none select-none brightness-75" />
            <div className="h-[100px] w-full absolute left-0 z-10 bottom-0 bg-gradient-to-t from-dark"></div>
            <div className="absolute w-[90%] lg:w-[40%] mx-auto p-10 mb-14 drop-shadow-lg">
                <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
                    {topWorks?.title}
                </h1>
                <span className="text-white text-lg mt-4 line-clamp-3">
                    {topWorks?.description}
                </span>
                <div className="flex gap-x-3 mt-4">
                    <Button color="secondary">Ver</Button>
                </div>
            </div>
        </div>
    );
}