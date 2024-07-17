import RowCarousel from "../../components/home-components/RowCarousel";
import HomeCarousel from "../../components/home-components/HomeCarousel";
import prisma from "@/app/lib/db";
import { DBProperty, TFGRowData, PopularFields, iTFG } from "@/app/types/interfaces";
import { tfgFields, tfgTopFields } from "@/app/types/prismaFieldDefs";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { TFGStatus } from "@/app/lib/enums";
import { s_cache } from "@/app/lib/cache";
import {
    DAY,
    HALF_DAY,
    ROW_RECOMMENDED_MAX_VIEWS,
    ROW_RECOMMENDED_RANDOM_MULT,
    ROW_RECOMMENDED_SCORE_MULT,
    ROW_RECOMMENDED_VIEWS_MULT,
    ROW_SIZE,
    TAG_RECOMMENDED_POINTS,
} from "@/app/types/defaultData";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

async function getRecents() {
    const recents = await prisma.tfg.findMany({
        select: tfgFields,
        where: {
            status: TFGStatus.PUBLISHED,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: ROW_SIZE,
    });
    return recents;
}

function getInterestedTags() {
    const get = cookies().get("interested-tags");
    if (!get) {
        return [];
    }

    const currentTags = get.value.split(",").map((tag) => {
        const [name] = tag.split(":");
        return name;
    });
    
    return currentTags;
}

async function getTopWorks() {
    const TopWorks = await prisma.tfg.findMany({
        select: tfgTopFields,
        where: {
            status: TFGStatus.PUBLISHED,
        },
        orderBy: [{ views: "desc" }, { score: "desc" }, { createdAt: "desc" }],
        take: 5,
    });
    return TopWorks;
}

async function getGroupedTFGsWithScoreBy(by: "categoryId" | "titulationId") {
    const column = Prisma.sql([by]);
    const tableName = by === "categoryId" ? "category" : "titulation";
    const tags = getInterestedTags();
    const formattedTags = tags && tags.length > 0 ? Prisma.sql`${Prisma.join(tags.map(tag => Prisma.sql`${tag}`))}` : Prisma.sql``;
    const query = Prisma.sql`
        WITH TFG_Scores AS (
            SELECT 
                t.id,
                t.title,
                t.thumbnail,
                t.description,
                t.views,
                t.score,
                t.pages,
                t."createdAt",
                t."${column}" AS groupId,
                (t.score * ${ROW_RECOMMENDED_SCORE_MULT} + 
                LEAST(t.views, ${ROW_RECOMMENDED_MAX_VIEWS}) * ${ROW_RECOMMENDED_VIEWS_MULT} + 
                random() * ${ROW_RECOMMENDED_RANDOM_MULT} +
                CASE 
                    WHEN t.tags && ARRAY[${formattedTags}]::text[]
                    THEN ${TAG_RECOMMENDED_POINTS}
                    ELSE 0 
                END
            ) AS recommendedScore
            FROM tfg t
            WHERE t.status = ${TFGStatus.PUBLISHED}
        ),
        Ranked_TFGs AS (
            SELECT 
                ts.*,
                ROW_NUMBER() OVER (PARTITION BY ts.groupId ORDER BY ts.recommendedScore DESC) AS rn
            FROM TFG_Scores ts
        ),
        Filtered_TFGs AS (
            SELECT 
                rt.*
            FROM Ranked_TFGs rt
            WHERE rt.rn <= ${ROW_SIZE}
        ),
        CategoryScores AS (
            SELECT 
                ft.groupId AS id,
                SUM(ft.recommendedScore) AS totalRecommendedScore
            FROM Filtered_TFGs ft
            GROUP BY ft.groupId
        )
        SELECT 
            cs.id AS id,
            cat.name,
            cs.totalRecommendedScore,
            json_agg(
                json_build_object(
                    'id', ft.id,
                    'title', ft.title,
                    'thumbnail', ft.thumbnail,
                    'description', ft.description,
                    'views', ft.views,
                    'score', ft.score,
                    'pages', ft.pages,
                    'createdAt', ft."createdAt",
                    'recommendedScore', ft.recommendedScore
                )
            ) AS tfgs
        FROM CategoryScores cs
        JOIN ${Prisma.sql([tableName])} cat ON cs.id = cat.id
        JOIN Filtered_TFGs ft ON cs.id = ft.groupId
        GROUP BY cs.id, cat.name, cs.totalRecommendedScore
        ORDER BY cs.totalRecommendedScore DESC;
    `;

    const data = (await prisma.$queryRaw(query)) as RowDataQuery[];
    return data.map((data) => ({ ...data, link: tableName + "/" + data.id })) as RowDataWithLink[];
}

async function getHomeRows() {
    const result: TFGRowData[] = [];
    result.push({
        name: "Trabajos recientes",
        link: "",
        tfgs: await getRecents(),
    });
    const categoryData = await getGroupedTFGsWithScoreBy("categoryId");
    const titulationData = await getGroupedTFGsWithScoreBy("titulationId");

    const combinedData = [...categoryData, ...titulationData];
    combinedData.sort((a, b) => b.totalRecommendedScore - a.totalRecommendedScore);

    return result.concat(combinedData.map((element) => ({ name: "Trabajos de " + element.name, link: element.link, tfgs: element.tfgs })));
}

const getCachedTopWorks = s_cache(
    async () => {
        return await getTopWorks();
    },
    ["home-top-works"],
    {
        revalidate: DAY,
    }
);

const getCachedHomeRows = s_cache(
    async () => {
        return await getHomeRows();
    },
    ["home-data"],
    {
        revalidate: HALF_DAY,
    }
);
interface RowDataQuery {
    id: number;
    totalRecommendedScore: number;
    name: string;
    tfgs: iTFG[];
}

interface RowDataWithLink extends RowDataQuery {
    link: string;
}

export default async function Home() {
    const topWorks = await getCachedTopWorks();
    const RowData = await getHomeRows();
    return (
        <div className="overflow-hidden pt-[66px] lg:pt-[87px] ">
            <HomeCarousel topTfgs={topWorks} />

            <div className="pb-[180px] px-4 lg:px-12 pt-7">
                {RowData.map((rowData, index) => (
                    <div key={index} className="pb-10">
                        <div className="font-bold pl-1 flex items-end mb-3 flex-wrap">
                            <div className="flex text-medium w-full xs:w-auto lg:text-xl">
                                <div className="self-stretch pt-1 pb-1 mr-2 inline-block">
                                    <div className="w-1 h-full bg-blue-500 "></div>
                                </div>
                                {rowData.name}
                            </div>
                            {rowData.link && (
                                <Link
                                    className=" xs:pl-3 text-sm lg:text-medium transition-colors inline-flex items-center text-gray-400 hover:text-nova-link group"
                                    href={`/${rowData.link}`}>
                                    Ver más{" "}
                                    <IconChevronRight className="inline text-blue-500 stroke-3 duration-400 group-hover:translate-x-1" size={20} />{" "}
                                </Link>
                            )}
                        </div>
                        <RowCarousel tfgArray={rowData.tfgs} />
                    </div>
                ))}
            </div>
        </div>
    );
}
