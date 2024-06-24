import Image from "next/image";
import { increaseTFGViews } from "@/app/lib/actions/tfg";
import { redirect } from "next/navigation";
import { iFullTFG } from "@/app/types/interfaces";
import { IconChevronRight, IconCloudDownload, IconDownload, IconEye } from "@tabler/icons-react";
import prisma from "@/app/lib/db";
import { tfgFullFields } from "@/app/types/prismaFieldDefs";
import { montserrat } from "@/app/lib/fonts";
import Info from "../../../components/TFG/BasicInfo";
import { Role } from "@/app/lib/enums";
import { BLOCKTYPE, TFG_BLockElement } from "@/app/components/TFG/InfoBlocks";
import TFG_Details from "@/app/components/TFG/TFG_Details";

const getTFGData = async (id: number) => {
    const tfgRaw = await prisma.tfg.findUnique({
        where: {
            id: id,
        },
        select: tfgFullFields,
    });

    if (!tfgRaw) return null;

    const tfg: iFullTFG = {
        id: tfgRaw.id,
        thumbnail: tfgRaw.thumbnail,
        banner: tfgRaw.banner,
        title: tfgRaw.title,
        description: tfgRaw.description,
        author: tfgRaw.users
            .filter((userRelation) => userRelation.user.role === Role.STUDENT)
            .map((userRelation) => ({
                id: 0,
                name: userRelation.user.name,
                contactDetails: userRelation.user.contactDetails,
                image: userRelation.user.image,
            })),
        tutor: tfgRaw.users
            .filter((userRelation) => userRelation.user.role === Role.TUTOR)
            .map((userRelation) => ({
                id: 0,
                name: userRelation.user.name,
                contactDetails: userRelation.user.contactDetails,
                image: userRelation.user.image,
            })),
        department: tfgRaw.department
            ? {
                  id: tfgRaw.department.id,
                  name: tfgRaw.department.name,
                  link: tfgRaw.department.link ?? undefined,
              }
            : undefined,
        content: tfgRaw.content,
        pages: tfgRaw.pages,
        documentLink: tfgRaw.documentLink,
        tags: tfgRaw.tags,
        views: tfgRaw.views,
        score: tfgRaw.score,
        createdAt: tfgRaw.createdAt,
        college: {
            id: 0,
            name: tfgRaw.college.name,
            image: tfgRaw.college.image,
        },
    };
    return tfg;
};

const content: TFG_BLockElement[] = [
    {
        type: BLOCKTYPE.SINGLE_TEXT,
        content: [
            ``,
            `Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, omnis aspernatur officia quaerat incidunt corporis voluptatem repellendus error quibusdam molestiae sed, beatae quod dolore nostrum. Enim magnam beatae nostrum repellendus.
            Voluptates obcaecati voluptas et dolorum voluptate cum, odit, nam, pariatur`,
        ],
    },
    {
        type: BLOCKTYPE.MEDIA_TEXT,
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
        type: BLOCKTYPE.TEXT_MEDIA,
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
        type: BLOCKTYPE.SINGLE_MEDIA,
        content: ["500", "cover", "top", "https://picsum.photos/seed/148/1500/800"],
    },
    {
        type: BLOCKTYPE.DOUBLE_MEDIA,
        content: ["100", "cover", "center", "https://picsum.photos/seed/48/1500/800", "cover", "center", "https://picsum.photos/seed/248/1500/800"],
    },

    {
        type: BLOCKTYPE.TRIPLE_TEXT,
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
        type: BLOCKTYPE.TRIPLE_MEDIA,
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

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id[0]);
    if (isNaN(id)) {
        redirect("/");
    }

    const TFG = await getTFGData(id);
    if (!TFG) {
        redirect("/");
    }


    TFG.content = JSON.stringify(content);
    await increaseTFGViews(parseFloat(params.id));

    return (
        <div className="pt-[73px]">
            <TFG_Details TFG={TFG} />
        </div>
    );
}
