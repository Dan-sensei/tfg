import CarouselRow from './components/CarouselRow';
import HomeCarousel from './components/HomeCarousel'
import prisma from "@/app/utils/db";
import { iTFG, iHomeTFG, MostPoular, DBProperty, TFGQueryParamsWhere, TFGRowData } from "@/app/types/interfaces";
import { tfgFields, tfgTopFields } from "@/app/types/prismaFieldDefs";
import { Prisma } from '@prisma/client';

async function getRecents() {
	const recents = await prisma.tFG.findMany({
		select: tfgFields,
		orderBy: {
			createdAt: 'desc'
		},
		take: 20
	});
	return recents
}

async function getTopWorks(){
	const TopWorks = await prisma.tFG.findMany({
		select: tfgTopFields,
		orderBy: [
			{ views: 'desc' },
			{ score: 'desc' },
			{ createdAt: 'desc' }
		],
		take: 5
	});
	return TopWorks
}

const dataFetchers = [
    { key: 'Recientes', promise: getRecents() },
];


async function findMostPopular(): Promise<MostPoular[]> {
    const mostPopularGradeMasters = await prisma.tFG.groupBy({
        by: ['gradeId'],
		_sum: {
			views: true,
		},
		orderBy: {
			_sum: {
				views: 'desc',
			},
		},
        take: 5,
    });

	const mostPopularCategories = await prisma.tFG.groupBy({
		by: ['categoryId'],
		_sum: {
			views: true,
		},
		orderBy: {
			_sum: {
				views: 'desc',
			},
		},
		take: 5,
	});

	const popularGroups: MostPoular[] = [];
	const gradeMasterIds: number[] = [];
	mostPopularGradeMasters.forEach((gradeMaster) => {
		gradeMasterIds.push(gradeMaster.gradeId);
		popularGroups.push({
			type: DBProperty.GradeMaster,
			id: gradeMaster.gradeId,
			views: gradeMaster._sum.views ?? 0,
		});
	});
	const categoriesIds: number[] = [];
	mostPopularCategories.forEach((category) => {
		categoriesIds.push(category.categoryId);
		popularGroups.push({
			type: DBProperty.Category,
			id: category.categoryId,
			views: category._sum.views ?? 0,
		});
	});

	popularGroups.sort((a, b) => {
		if (b.views !== a.views) {
			return b.views - a.views;
		}
		return a.id - b.id;
	});
    return popularGroups;
}
/*
type FetchDataResult = Record<string, iTFG[]>;

export const getData = async () => {
    const promises = dataFetchers.map(fetcher => fetcher.promise);
    const results = await Promise.allSettled(promises);

	const fetchedData: FetchDataResult = {};
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            const key = dataFetchers[index].key;
            fetchedData[key] = result.value;
        }
    });


    return { fetchedData  };
};
*/
const getRowData = async () => {
	const popularGroups = await findMostPopular();

	const queryParams = {
		where: {
			id: -1
		},
		select: {
			name: true
		}
	};
	const RowData : TFGRowData[] = [];
	for(const group of popularGroups) {
		let GroupName = 'Trabajos de ';
		let tfgQueryParams = {
			where:{} as TFGQueryParamsWhere,
			orderBy: {
				views: 'desc' as const
			},
			take: 20
		};
		if(group.type === DBProperty.GradeMaster){
			queryParams.where.id = group.id;
			const gradeMaster = await prisma.gradeMaster.findUnique(queryParams);
			GroupName += gradeMaster?.name ?? '';
			tfgQueryParams.where.gradeId = group.id;
		}
		else if(group.type === DBProperty.Category){
			queryParams.where.id = group.id;
			const Category = await prisma.category.findUnique(queryParams);
			GroupName += Category?.name ?? '';
			tfgQueryParams.where.categoryId = group.id;
		}


		const tfgs = await prisma.tFG.findMany(tfgQueryParams) as iTFG[];
		RowData.push({name: GroupName, tfgs: tfgs});
	}
	return RowData;
}

export default async function Home() {
	const RowData = await getRowData();
	const topWorks = await getTopWorks();
	
	return (
		<div className='mt-[-100px] pt-[100px] overflow-hidden '>
			<HomeCarousel topTfgs={ topWorks } />
			<div className='pb-[180px]'>
				{
					RowData.map((rowData, index) => (
						<div key={index} className='pb-10'>
							<div className='px-14'>
								<h1 className='text-2xl font-bold px-2 pt-5'>{rowData.name}</h1>
							</div>
							<CarouselRow tfgArray={ rowData.tfgs } />
						</div>
					))
				}
				
			</div>
		</div>
	)
}
