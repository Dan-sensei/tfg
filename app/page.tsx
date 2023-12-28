import CarouselRow from './components/CarouselRow';
import HomeCarousel from './components/HomeCarousel'
import prisma from "@/app/utils/db";
import { iTFG, iHomeTFG } from "@/app/types/interfaces";

async function getRecents() {
	const recents = await prisma.tFG.findMany({
		select: {
			id: true,
			thumbnail: true,
			title: true,
			description: true,
			views: true,
			score: true,
			pages: true,
			createdAt: true,
		},
			orderBy: {
			createdAt: 'desc'
		},
		take: 18
	});

	return recents
}

async function getTopWorks(){
	const TopWorks = await prisma.tFG.findMany({
		select: {
		id: true,
		banner: true,
		title: true,
		description: true,
		views: true,
		score: true
	},
		orderBy: {
		views: 'desc'
	},
		take: 5
	});
	return TopWorks
}

export default async function Home() {
	const recentsDB = await getRecents();
	const topDB = await getTopWorks();

	const recents: iTFG[] = recentsDB.map((item: any) => {
		return {
			title: item.title,
			id: item.id,
			thumbnail: item.thumbnail,
			description: item.description,
			views: item.views,
			score: item.score,
			pages: item.pages,
			createdAt: item.createdAt,
		};
	});
	const top: iHomeTFG[] = topDB.map((item: any) => {
		return {
			id: item.id,
			title: item.title,
			banner: item.banner,
			description: item.description,
			views: item.views,
			score: item.score,
			createdAt: item.createdAt,
		};
	});
	return (
		<>
			<HomeCarousel topTfgs={ top } />
			<div className='overflow-hidden pb-[180px]'>
				<div className='px-14'>
					<h1 className='text-2xl font-bold px-2 pt-5'>Recientes</h1>
				</div>
				<CarouselRow tfgArray={ recents } />
			</div>
		</>
	)
}
