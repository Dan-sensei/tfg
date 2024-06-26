import CarouselRow from "../../components/home-components/CarouselRow";
import HomeCarousel from "../../components/home-components/HomeCarousel";
import prisma from "@/app/lib/db";
import { DBProperty, TFGRowData, PopularFields } from "@/app/types/interfaces";
import { tfgFields, tfgTopFields } from "@/app/types/prismaFieldDefs";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

async function foryou() {
    const recents = await prisma.tfg.findMany({
        select: tfgFields,
        orderBy: {
            createdAt: "desc",
        },
        take: 20,
    });
    return recents;
}

async function getRecents() {
    const recents = await prisma.tfg.findMany({
        select: tfgFields,
        orderBy: {
            createdAt: "desc",
        },
        take: 20,
    });
    return recents;
}

async function getTopWorks() {
    const TopWorks = await prisma.tfg.findMany({
        select: tfgTopFields,
        orderBy: [{ views: "desc" }, { score: "desc" }, { createdAt: "desc" }],
        take: 5,
    });
    return TopWorks;
}

async function findMostPopular(): Promise<PopularFields> {
    async function getPopular(
        type: DBProperty,
        groupByField: "titulationId" | "categoryId"
    ) {
        return (
            await prisma.tfg.groupBy({
                by: [groupByField],
                _sum: {
                    views: true,
                },
                orderBy: {
                    _sum: {
                        views: "desc",
                    },
                },
                take: 3,
            })
        ).map((item) => ({
            type: type,
            id: item[groupByField],
            views: item._sum.views ?? 0,
        }));
    }

    const [mostPopularGradeMasters, mostPopularCategories] = await Promise.all([
        getPopular(DBProperty.Titulation, "titulationId"),
        getPopular(DBProperty.Category, "categoryId"),
    ]);

    const gradeIds = mostPopularGradeMasters
        .sort((a, b) => b.views - a.views || a.id - b.id)
        .map((p) => p.id);
    const categoriesIds = mostPopularCategories
        .sort((a, b) => b.views - a.views || a.id - b.id)
        .map((p) => p.id);
    const popularGroups = [
        ...mostPopularGradeMasters,
        ...mostPopularCategories,
    ];
    popularGroups.sort((a, b) => b.views - a.views || a.id - b.id);
    return { grade: gradeIds, category: categoriesIds, order: popularGroups };
}

function sortCombinedArray(
    order: { type: number; id: number; views: number }[],
    categoriesArray: TFGRowData[],
    gradesArray: TFGRowData[]
): TFGRowData[] {
    const sortedArray: TFGRowData[] = [];
    for (const item of order) {
        if (item.type === DBProperty.Category) {
            const element = categoriesArray.find((c) => c.id == item.id);
            if (element) sortedArray.push(element);
        } else if (item.type === DBProperty.Titulation) {
            const element = gradesArray.find((c) => c.id == item.id);
            if (element) sortedArray.push(element);
        }
    }
    return sortedArray;
}

const getRowsData = async () => {
    const popularFields = await findMostPopular();
    function getQuery(ids: number[]) {
        return {
            where: {
                id: {
                    in: ids,
                },
            },
            select: {
                id: true,
                name: true,
                tfgs: {
                    select: {
                        title: true,
                        id: true,
                        thumbnail: true,
                        description: true,
                        views: true,
                        score: true,
                        pages: true,
                        createdAt: true,
                    },
                    take: 20,
                    orderBy: {
                        views: "desc" as const,
                    },
                },
            },
        };
    }
    const categoriesWithTopTFGs = await prisma.category.findMany(
        getQuery(popularFields.category)
    );
    const categoriesArray: TFGRowData[] = categoriesWithTopTFGs.map(
        (category) => ({
            id: category.id,
            name: "Trabajos de " + category.name,
            type: "categoria",
            tfgs: category.tfgs,
        })
    );
    const gradesWithTopTFGs = await prisma.titulation.findMany(
        getQuery(popularFields.grade)
    );
    const gradesArray: TFGRowData[] = gradesWithTopTFGs.map((grade) => ({
        id: grade.id,
        name: "Trabajos de " + grade.name,
        type: "titulation",
        tfgs: grade.tfgs,
    }));

    return sortCombinedArray(popularFields.order, categoriesArray, gradesArray);
};

const dataFetchers = [
    //{ key: 'Para ti', promise: foryou() },
    { key: "Trabajos recientes", promise: getRecents() },
];

async function getData() {
    const result: TFGRowData[] = [];
    for (const dataFetcher of dataFetchers) {
        const data = await dataFetcher.promise;
        result.push({
            id: -1,
            name: dataFetcher.key,
            type: "",
            tfgs: data,
        });
    }
    const RowData = await getRowsData();

    return result.concat(RowData);
}

export default async function Home() {
    const topWorks = await getTopWorks();

    const RowData = await getData();

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
                            {rowData.type && (
                                <Link
                                    className=" xs:pl-3 text-sm lg:text-medium transition-colors inline-flex items-center text-gray-400 hover:text-nova-link group"
                                    href={`/${rowData.type}/${rowData.id}`}
                                >
                                    Ver más{" "}
                                    <IconChevronRight
                                        className="inline text-blue-500 stroke-3 duration-400 group-hover:translate-x-1"
                                        size={20}
                                    />{" "}
                                </Link>
                            )}
                        </div>
                        <CarouselRow tfgArray={rowData.tfgs} />
                    </div>
                ))}
            </div>
        </div>
    );
}
