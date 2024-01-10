import CarouselRow from "./components/CarouselRow";
import HomeCarousel from "./components/HomeCarousel";
import prisma from "@/app/utils/db";
import {
    DBProperty,
    TFGRowData,
    PopularFields,
} from "@/app/types/interfaces";
import { tfgFields, tfgTopFields } from "@/app/types/prismaFieldDefs";

async function foryou() {
    const recents = await prisma.tFG.findMany({
        select: tfgFields,
        orderBy: {
            createdAt: "desc",
        },
        take: 20,
    });
    return recents;
}

async function getRecents() {
    const recents = await prisma.tFG.findMany({
        select: tfgFields,
        orderBy: {
            createdAt: "desc",
        },
        take: 20,
    });
    return recents;
}

async function getTopWorks() {
    const TopWorks = await prisma.tFG.findMany({
        select: tfgTopFields,
        orderBy: [{ views: "desc" }, { score: "desc" }, { createdAt: "desc" }],
        take: 5,
    });
    return TopWorks;
}

async function findMostPopular(): Promise<PopularFields> {
    async function getPopular(
        type: DBProperty,
        groupByField: "gradeId" | "categoryId"
    ) {
        return (
            await prisma.tFG.groupBy({
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
        getPopular(DBProperty.GradeMaster, "gradeId"),
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
			const element = categoriesArray.find(c => c.id == item.id);
			if(element) sortedArray.push(element)
        } else if (item.type === DBProperty.GradeMaster) {
            const element = gradesArray.find(c => c.id == item.id);
			if(element) sortedArray.push(element)
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
            tfgs: category.tfgs,
        })
    );
    const gradesWithTopTFGs = await prisma.gradeMaster.findMany(
        getQuery(popularFields.grade)
    );
    const gradesArray: TFGRowData[] = gradesWithTopTFGs.map((grade) => ({
        id: grade.id,
        name: "Trabajos de " + grade.name,
        tfgs: grade.tfgs,
    }));

    return sortCombinedArray(popularFields.order, categoriesArray, gradesArray)
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
        <div className="mt-[-100px] pt-[100px] overflow-hidden ">
            <HomeCarousel topTfgs={topWorks} />
            <div className="pb-[180px]">
                {RowData.map((rowData, index) => (
                    <div key={index} className="pb-10">
                        <div className="px-14">
                            <h1 className="text-xl font-bold px-2 pt-5">
                                {rowData.name}
                            </h1>
                        </div>
                        <CarouselRow tfgArray={rowData.tfgs} />
                    </div>
                ))}
            </div>
        </div>
    );
}
