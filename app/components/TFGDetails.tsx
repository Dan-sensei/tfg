import { iFullTFG, iTFG } from "@/app/types/interfaces";
import Image from "next/image";
import prisma from "@/app/lib/db";

const IMAGE_TEXT = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    const text = content[4];
    return (
        <div
            className={`min-h-[30px] gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}
        >
            <div style={{ height: `${height}px` }} className={`relative`}>
                <Image
                    src={imageLink}
                    className={`object-${imageDisplay} object-${imagePosition}`}
                    alt=""
                    fill
                />
            </div>
            <div>{text}</div>
        </div>
    );
};
const TEXT_IMAGE = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    const text = content[4];
    return (
        <div className="min-h-[30px] gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2">
            <div className="">{text}</div>
            <div style={{ height: `${height}px` }} className="relative">
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
const SINGLE_IMAGE = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    return (
        <div
            style={{ height: `${height}px` }}
            className="relative min-h-[30px]"
        >
            <Image
                src={imageLink}
                className={`object-${imageDisplay} object-${imagePosition}`}
                alt=""
                fill
            />
        </div>
    );
};

const DOUBLE_IMAGE = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    const image2Display = content[4];
    const image2Position = content[5];
    const image2Link = content[6];
    return (
        <div className="min-h-[30px] gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2">
            <div style={{ height: `${height}px` }} className="relative">
                <Image
                    src={imageLink}
                    className={`object-${imageDisplay} object-${imagePosition}`}
                    alt=""
                    fill
                />
            </div>
            <div style={{ height: `${height}px` }} className="relative">
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

const TRIPLE_IMAGE = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    const image2Display = content[4];
    const image2Position = content[5];
    const image2Link = content[6];
    const image3Display = content[7];
    const image3Position = content[8];
    const image3Link = content[9];
    return (
        <div className="min-h-[30px] grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8">
            <div style={{ height: `${height}px` }} className="relative">
                <Image
                    src={imageLink}
                    className={`object-${imageDisplay} object-${imagePosition}`}
                    alt=""
                    fill
                />
            </div>
            <div style={{ height: `${height}px` }} className="relative">
                <Image
                    src={image2Link}
                    className={`object-${image2Display} object-${image2Position}`}
                    alt=""
                    fill
                />
            </div>
            <div
                style={{
                    height: `${height}px`,
                }}
                className="relative"
            >
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
const SINGLE_TEXT = ({ content }: { content: string[] }) => {
    const title1 = content[0];
    const text1 = content[1];
    return (
        <div className="flex gap-3 xl:gap-8 min-h-[30px] text-justify">
            <div className="">
                <div className="text-3xl">{title1}</div>
                <div className="">{text1}</div>
            </div>
        </div>
    );
};

const DOUBLE_TEXT = ({ content }: { content: string[] }) => {
    const title1 = content[0];
    const text1 = content[1];
    const title2 = content[2];
    const text2 = content[3];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8 min-h-[30px] text-justify">
            <div className="">
                <div className="text-3xl">{title1}</div>
                <div className="">{text1}</div>
            </div>
            <div className="">
                <div className="text-3xl">{title2}</div>
                <div className="">{text2}</div>
            </div>
        </div>
    );
};

const TRIPLE_TEXT = ({ content }: { content: string[] }) => {
    const title1 = content[0];
    const text1 = content[1];
    const title2 = content[2];
    const text2 = content[3];
    const title3 = content[4];
    const text3 = content[5];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xl:gap-8 min-h-[30px] text-justify">
            <div className="">
                <div className="text-3xl">{title1}</div>
                <div className="">{text1}</div>
            </div>
            <div className="">
                <div className="text-3xl">{title2}</div>
                <div className="">{text2}</div>
            </div>
            <div className="">
                <div className="text-3xl">{title3}</div>
                <div className="">{text3}</div>
            </div>
        </div>
    );
};

type ComponentFunction = {
    element: (props: { content: string[] }) => JSX.Element;
    expectedParameters: number;
};
interface DetailsTypes {
    [key: string]: ComponentFunction;
}

export default function TFGDetails() {
    const DetailsTypes: DetailsTypes = {
        "image-text": { element: IMAGE_TEXT, expectedParameters: 5 },
        "text-image": { element: TEXT_IMAGE, expectedParameters: 5 },
        "single-image": { element: SINGLE_IMAGE, expectedParameters: 4 },
        "double-image": { element: DOUBLE_IMAGE, expectedParameters: 7 },
        "triple-image": { element: TRIPLE_IMAGE, expectedParameters: 10 },
        "triple-text": { element: TRIPLE_TEXT, expectedParameters: 6 },
        "double-text": { element: DOUBLE_TEXT, expectedParameters: 4 },
        "single-text": { element: SINGLE_TEXT, expectedParameters: 2 },
    };
    const content = [
        {
            type: "single-text",
            content: [
                ``,
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur`,
            ],
        },
        {
            type: "image-text",
            content: [
                "320",
                "cover",
                "center",
                "https://picsum.photos/seed/800/600/300",
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
                Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
            ],
        },
        {
            type: "text-image",
            content: [
                "500",
                "cover",
                "center",
                "https://picsum.photos/seed/124/600/300",
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
                Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
            ],
        },
        {
            type: "single-image",
            content: [
                "500",
                "cover",
                "top",
                "https://picsum.photos/seed/148/1500/800",
            ],
        },
        {
            type: "double-image",
            content: [
                "100",
                "cover",
                "center",
                "https://picsum.photos/seed/48/1500/800",
                "cover",
                "center",
                "https://picsum.photos/seed/248/1500/800",
            ],
        },

        {
            type: "triple-text",
            content: [
                "Title1",
                `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
                Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
                Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
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
            type: "triple-image",
            content: [
                "400",
                "cover",
                "center",
                "https://picsum.photos/seed/2480/1500/800",
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
        <div className="max-w-screen-2xl mx-auto xl:pt-10">
            {content.map((c, i) => {
                const BlockTypeComponent = DetailsTypes[c.type];
                
                if (!BlockTypeComponent || BlockTypeComponent.expectedParameters != c.content.length)
                    return <></>;

                const Element = BlockTypeComponent.element;
                return (
                    <section key={i} className="p-6 pt-10">
                        <Element key={c.type} content={c.content} />
                    </section>
                );
            })}
        </div>
    );
}
