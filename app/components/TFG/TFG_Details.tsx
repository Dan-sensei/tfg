import { montserrat } from "../../lib/fonts";
import { iDetailsTFG } from "../../types/interfaces";
import TFG_BasicInfo from "./BasicInfo";
import Image from "next/image";
import InfoBlocks from "./InfoBlocks";
import { isNullOrEmpty } from "@/app/utils/util";
import { DEF_BANNER } from "@/app/types/defaultData";
import { TFG_BLockElement } from "../TFG_BlockDefinitions/BlockDefs";
import FavButton from "../home-components/FavButton";

type Props = {
    TFG: iDetailsTFG;
};

export default function TFG_Details({ TFG }: Props) {
    let content: TFG_BLockElement[] = [];
    try {
        if (!isNullOrEmpty(TFG.contentBlocks)) {
            content = JSON.parse(TFG.contentBlocks);
        }
    } catch (e) {
        console.error(e);
        content = [];
    }

    return (
        <>
            <div className="aspect-video lg:aspect-wide relative z-0 grid grid-stack max-h-[600px] w-full border-b-[1px] border-b-white/10">
                <div className="hidden z-40 pl-16 pt-12 pb-8 md:grid grid-cols-6 text-shadow-light-dark/20 lg:container mx-auto">
                    <div className={`${montserrat.className} col-span-4 lg:col-span-3 `}>
                        <TFG_BasicInfo TFG={TFG} />
                    </div>
                </div>
                <div className="h-full hidden md:block w-full bg-gradient-to-r from-nova-darker-2/80 to-80% z-20"></div>
                <Image src={TFG.banner ? TFG.banner : DEF_BANNER} priority draggable="false" alt={TFG.title} fill className="object-cover z-10" />
                <div className="z-20 absolute top-2 right-2">
                    <FavButton id={TFG.id} />
                </div>
            </div>

            <main className="p-5">
                <div className="block md:hidden">
                    <TFG_BasicInfo TFG={TFG} />
                </div>
                <div className="text-center italic pt-10 whitespace-pre-wrap">{TFG.description}</div>
                <InfoBlocks blocks={content} />
            </main>
        </>
    );
}
