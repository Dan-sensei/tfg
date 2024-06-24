import Image from "next/image";

const IMAGE_TEXT = ({ content }: { content: string[] }) => {
    const height = content[0];
    const imageDisplay = content[1];
    const imagePosition = content[2];
    const imageLink = content[3];
    const text = content[4];
    return (
        <div className={`min-h-[30px] gap-3 xl:gap-8 grid grid-cols-1 lg:grid-cols-2`}>
            <div style={{ height: `${height}px` }} className={`relative`}>
                <Image src={imageLink} className={`object-${imageDisplay} object-${imagePosition}`} alt="" fill />
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
                <Image src={imageLink} className={`object-${imageDisplay} object-${imagePosition}`} alt="" fill />
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
        <div style={{ height: `${height}px` }} className="relative min-h-[30px]">
            <Image src={imageLink} className={`object-${imageDisplay} object-${imagePosition}`} alt="" fill />
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
                <Image src={imageLink} className={`object-${imageDisplay} object-${imagePosition}`} alt="" fill />
            </div>
            <div style={{ height: `${height}px` }} className="relative">
                <Image src={image2Link} className={`object-${image2Display} object-${image2Position}`} alt="" fill />
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
                <Image src={imageLink} className={`object-${imageDisplay} object-${imagePosition}`} alt="" fill />
            </div>
            <div style={{ height: `${height}px` }} className="relative">
                <Image src={image2Link} className={`object-${image2Display} object-${image2Position}`} alt="" fill />
            </div>
            <div
                style={{
                    height: `${height}px`,
                }}
                className="relative">
                <Image src={image3Link} className={`object-${image3Display} object-${image3Position}`} alt="" fill />
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

export type TFG_BLockElement = {
    type: number;
    content: string[];
};

export type DetailsProps = {
    blocks: TFG_BLockElement[];
};

export enum BLOCKTYPE  {
    MEDIA_TEXT = 1,
    TEXT_MEDIA,
    SINGLE_MEDIA,
    DOUBLE_MEDIA,
    TRIPLE_MEDIA,
    SINGLE_TEXT,
    DOUBLE_TEXT,
    TRIPLE_TEXT,
}

const DetailsTypes: DetailsTypes = {
    [BLOCKTYPE.MEDIA_TEXT]: { element: IMAGE_TEXT, expectedParameters: 5 },
    [BLOCKTYPE.TEXT_MEDIA]: { element: TEXT_IMAGE, expectedParameters: 5 },
    [BLOCKTYPE.SINGLE_MEDIA]: { element: SINGLE_IMAGE, expectedParameters: 4 },
    [BLOCKTYPE.DOUBLE_MEDIA]: { element: DOUBLE_IMAGE, expectedParameters: 7 },
    [BLOCKTYPE.TRIPLE_MEDIA]: { element: TRIPLE_IMAGE, expectedParameters: 10 },
    [BLOCKTYPE.TRIPLE_TEXT]: { element: TRIPLE_TEXT, expectedParameters: 6 },
    [BLOCKTYPE.DOUBLE_TEXT]: { element: DOUBLE_TEXT, expectedParameters: 4 },
    [BLOCKTYPE.SINGLE_TEXT]: { element: SINGLE_TEXT, expectedParameters: 2 },
};


export default function InfoBlocks({ blocks }: DetailsProps) {
    
    
    return (
        <div className="max-w-screen-2xl mx-auto xl:pt-10">
            {blocks.map((c, i) => {
                const BlockTypeComponent = DetailsTypes[c.type];
                
                if (!BlockTypeComponent || BlockTypeComponent.expectedParameters != c.content.length) return <></>;

                const Element = BlockTypeComponent.element;
                return (
                    <section key={i} className="pt-10">
                        <Element key={c.type} content={c.content} />
                    </section>
                );
            })}
        </div>
    );
}
