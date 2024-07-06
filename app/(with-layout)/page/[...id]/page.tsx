import { increaseTFGViews } from "@/app/lib/actions/tfg";
import { redirect } from "next/navigation";
import { iFullTFG } from "@/app/types/interfaces";
import prisma from "@/app/lib/db";
import TFG_Details from "@/app/components/TFG/TFG_Details";
import { BLOCKTYPE, TFG_BLockElement } from "@/app/components/TFG_BlockDefinitions/BlockDefs";

const getTFGData = async (id: number) => {
    const tfgRaw = await prisma.tfg.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            thumbnail: true,
            banner: true,
            title: true,
            description: true,
            authors: {
                select: {
                    name: true,
                    socials: true,
                    personalPage: true,
                    image: true,
                    role: true,
                },
            },
            tutors: {
                select: {
                    user: {
                        select: {
                            name: true,
                            personalPage: true,
                            image: true,
                            role: true,
                        },
                    },
                },
            },
            department: {
                select: {
                    name: true,
                    link: true,
                },
            },
            contentBlocks: true,
            pages: true,
            documentLink: true,
            tags: true,
            views: true,
            score: true,
            createdAt: true,
            college: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });

    if (!tfgRaw) return null;

    const tfg: iFullTFG = {
        id: tfgRaw.id,
        thumbnail: tfgRaw.thumbnail,
        banner: tfgRaw.banner,
        title: tfgRaw.title,
        description: tfgRaw.description,
        author: tfgRaw.authors,
        tutors: tfgRaw.tutors.map((userRelation) => ({
            name: userRelation.user.name,
            personalPage: userRelation.user.personalPage,
            image: userRelation.user.image,
        })),
        department: tfgRaw.department,
        contentBlocks: tfgRaw.contentBlocks,
        pages: tfgRaw.pages,
        documentLink: tfgRaw.documentLink,
        tags: tfgRaw.tags,
        views: tfgRaw.views,
        score: tfgRaw.score,
        createdAt: tfgRaw.createdAt,
        college: {
            name: tfgRaw.college.name,
            image: tfgRaw.college.image,
        },
    };
    return tfg;
};

const content: TFG_BLockElement[] = [
    {
        type: BLOCKTYPE.SINGLE_TEXT,
        params: [
            ``,
            `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
            Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur`,
        ],
    },
    {
        type: BLOCKTYPE.MEDIA_TEXT,
        params: [
            "320",
            "md:mx-auto",
            "image",
            "https://picsum.photos/seed/800/600/300",
            "false",
            "false",
            "md:items-start",
            `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
            Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur assumenda laudantium neque labore nulla nisi consequatur debitis! Ut quaerat laborum temporibus ducimus magnam, excepturi architecto. Labore officia repellat laborum.
            Odio voluptatibus saepe minus tempore neque veniam libero aspernatur suscipit? Ad placeat maiores laboriosam debitis, illo accusamus iure architecto quasi mollitia quam eligendi assumenda eaque commodi minima repudiandae quia. Aut!`,
        ],
    },
    {
        type: BLOCKTYPE.TEXT_MEDIA,
        params: [
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
        type: BLOCKTYPE.SINGLE_MEDIA,
        params: ["500", "cover", "top", "https://picsum.photos/seed/148/1500/800"],
    },
    {
        type: BLOCKTYPE.DOUBLE_MEDIA,
        params: ["100", "cover", "center", "https://picsum.photos/seed/48/1500/800", "cover", "center", "https://picsum.photos/seed/248/1500/800"],
    },

    {
        type: BLOCKTYPE.TRIPLE_TEXT,
        params: [
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
        type: BLOCKTYPE.TRIPLE_MEDIA,
        params: [
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

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id[0]);
    if (isNaN(id)) {
        redirect("/");
    }

    const TFG = await getTFGData(id);
    if (!TFG) {
        redirect("/");
    }

    TFG.contentBlocks = JSON.stringify(content);
    await increaseTFGViews(parseFloat(params.id));

    return (
        <div className="pt-[73px] @container">
            <TFG_Details TFG={TFG} />
        </div>
    );
}
