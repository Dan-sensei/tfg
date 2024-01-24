import { iFullTFG } from "@/app/types/interfaces";
import Image from "next/image";
import prisma from "@/app/utils/db";

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
function updateViews(id: number, views: number) {
    prisma.tFG.update({
        where: {
            id: id,
        },
        data: {
            views: views + 1,
        },
    });
}

const IMAGE_TEXT = ({content}: {content: string[]}) => {
    const height = content[0];
    const gap = content[1];
    const innerWidth = content[2];
    const imageDisplay = content[3];
    const imagePosition = content[4];
    const imageLink = content[5];
    const text = content[6];
    return (
        <div style={{gap: `${gap}px`, height: `${height}px`}} className={`flex min-h-[30px]`}>
            <div style={{width: `${innerWidth}%`}} className={`relative`}>
                <Image
                    src={imageLink}
                    className={`object-${imageDisplay} object-${imagePosition}`}
                    alt=""
                    fill
                />
            </div>
            <div style={{width: `${100 - parseFloat(innerWidth)}%`}}>{text}</div>
        </div>
    );
};
const TEXT_IMAGE = ({content}: {content: string[]}) => {
    const height = content[0];
    const gap = content[1];
    const innerWidth = content[2];
    const imageDisplay = content[3];
    const imagePosition = content[4];
    const imageLink = content[5];
    const text = content[6];
    return (
        <div style={{gap: `${gap}px`, height: `${height}`}} className="flex min-h-[30px]">
            <div style={{width: `${innerWidth}%`}} className="">{text}</div>
            <div style={{width: `${100-parseFloat(innerWidth)}%`}} className="relative">
                <Image
                    src={imageLink}
                    className={`object-${imageDisplay} object-${imagePosition}`}
                    alt=""
                    fill
                />
            </div>
        </div>
    );
};
const SINGLE_IMAGE = ({content}: {content: string[]}) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    return (
        <div style={{height: `${height}px`}} className="relative min-h-[30px]">
            <Image src={imageLink} className={`object-${imageDisplay} object-${imagePosition}`} alt="" fill />
        </div>
    );
};

const DOUBLE_IMAGE = ({content}: {content: string[]}) => {
    const height = content[0];
    const gap = content[1];
    const innerWidth = content[2];
    const imageDisplay = content[3];
    const imagePosition = content[4];
    const imageLink = content[5];
    const image2Display = content[6];
    const image2Position = content[7];
    const image2Link = content[8];
    return (
        <div style={{gap: `${gap}px`, height: `${height}px`}} className="flex min-h-[30px]">
            <div style={{width: `${innerWidth}%`}} className="relative">
                <Image
                    src={imageLink}
                    className={`object-${imageDisplay} object-${imagePosition}`}
                    alt=""
                    fill
                />
            </div>
            <div style={{width: `${100- parseFloat(innerWidth)}%`}} className="relative">
                <Image
                    src={image2Link}
                    className={`object-${image2Display} object-${image2Position}`}
                    alt=""
                    fill
                />
            </div>
        </div>
    );
};

const TRIPLE_IMAGE = ({content}: {content: string[]}) => {
    const height = content[0];
    const gap = content[1];
    const innerWidth1 = content[2];
    const imageDisplay = content[3];
    const imagePosition = content[4];
    const imageLink = content[5];
    const innerWidth2 = content[6];
    const image2Display = content[7];
    const image2Position = content[8];
    const image2Link = content[9];
    const image3Display = content[10];
    const image3Position = content[11];
    const image3Link = content[12];
    return (
        <div style={{gap: `${gap}px`, height: `${height}px`}} className="flex min-h-[30px]">
            <div style={{width: `${innerWidth1}%`}} className="relative">
                <Image
                    src={imageLink}
                    className={`object-${imageDisplay} object-${imagePosition}`}
                    alt=""
                    fill
                />
            </div>
            <div style={{width: `${innerWidth2}%`}} className="relative">
                <Image
                    src={image2Link}
                    className={`object-${image2Display} object-${image2Position}`}
                    alt=""
                    fill
                />
            </div>
            <div style={{width: `${100 - parseFloat(innerWidth1) - parseFloat(innerWidth2)}%`}} className="relative">
                <Image
                    src={image3Link}
                    className={`object-${image3Display} object-${image3Position}`}
                    alt=""
                    fill
                />
            </div>
        </div>
    );
};

const TRIPLE_TEXT = ({content}: {content: string[]}) => {
    const height = content[0];
    const gap = content[1];
    const innerWidth1 = content[2];
    const title1 = content[3];
    const text1 = content[4];
    const innerWidth2 = content[5];
    const title2 = content[6];
    const text2 = content[7];
    const title3 = content[8];
    const text3 = content[9];
    return (
        <div style={{gap: `${gap}px`, height: `${height}px`}} className="flex min-h-[30px]">
            <div style={{width: `${innerWidth1}%`}} className="">
                <div className="text-3xl">{title1}</div>
                <div className="">{text1}</div>
            </div>
            <div style={{width: `${innerWidth2}%`}} className="">
                <div className="text-3xl">{title2}</div>
                <div className="">{text2}</div>
            </div>
            <div style={{width: `${100 - parseFloat(innerWidth1) - parseFloat(innerWidth2)}%`}} className="">
                <div className="text-3xl">{title3}</div>
                <div className="">{text3}</div>
            </div>
        </div>
    );
};

const BLOCK_TYPES = [
    { element: IMAGE_TEXT, expectedParameters: 7 },
    { element: TEXT_IMAGE, expectedParameters: 7 },
    { element: SINGLE_IMAGE, expectedParameters: 4 },
    { element: DOUBLE_IMAGE, expectedParameters: 9 },
    { element: TRIPLE_IMAGE, expectedParameters: 13 },
    { element: TRIPLE_TEXT, expectedParameters: 10 }
];

export default async function Page({ params }: { params: { id: string } }) {
    const TFG = await getPage(parseFloat(params.id));
    updateViews(parseFloat(params.id), TFG.views);
    const content = [
        {
            type: 0,
            content: [
                "320",
                "10",
                "20",
                "cover",
                "center",
                "https://picsum.photos/seed/800/600/300",
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
                Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
            ],
        },
        {
            type: 1,
            content: [
                "500",
                "10",
                "50",
                "cover",
                "center",
                "https://picsum.photos/seed/124/600/300",
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
                Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
            ],
        },
        {
            type: 2,
            content: [
                "500",
                "cover",
                "top",
                "https://picsum.photos/seed/148/1500/800",
            ],
        },
        {
            type: 3,
            content: [
                "100",
                "50",
                "50",
                "cover",
                "center",
                "https://picsum.photos/seed/48/1500/800",
                "cover",
                "center",
                "https://picsum.photos/seed/248/1500/800",
            ],
        },
        
        {
            type: 5,
            content: [
                "400",
                "10",
                "33",
                "Title1",
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
                Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
                "33",
                "Title2",
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
                Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
                "Title3",
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
                Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
            ],
        },
        {
            type: 4,
            content: [
                "400",
                "5",
                "50",
                "cover",
                "center",
                "https://picsum.photos/seed/2480/1500/800",
                "33",
                "cover",
                "center",
                "https://picsum.photos/seed/2458/1500/800",
                "cover",
                "center",
                "https://picsum.photos/seed/2748/1500/800",
            ],
        },
    ];
    return (
        <div className=" mt-[-100px]">
            <div className="aspect-wide relative z-0">
                <Image
                    src={TFG.banner}
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
                </div>
            </div>
            <div className="max-w-screen-2xl mx-auto">
                {content.map((c) => {
                    const BlockTypeComponent = BLOCK_TYPES[c.type].element;
                    if(BLOCK_TYPES[c.type].expectedParameters != c.content.length)
                        return <></>
                    return (
                        <section className="p-6 pt-16">
                            <BlockTypeComponent key={c.type} content={c.content} />
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
