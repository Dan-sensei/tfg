import { Suspense } from "react";
import FullSearch from "./FullSearch";
import { Category, PopularTag, Titulation } from "@/app/types/interfaces";
import { getAllCategories, getAllTitulations, getTopTags } from "@/app/lib/fetchData";
import { s_cache } from "@/app/lib/cache";
import { DAY } from "@/app/types/defaultData";

const getCachedTopTags = s_cache(async () => {
    const topTags = await getTopTags(10);

    return topTags;
},
["top-tags"],
{
    revalidate: DAY,
})

export default async function Search() {
    const [categories, titulations, popular_tags] = await Promise.all([
        getAllCategories(),
        getAllTitulations(),
        getCachedTopTags(),
    ]);
    return (
        <Suspense>
            <FullSearch categories={categories} titulations={titulations} popular_tags={popular_tags} />
        </Suspense>
    );
}
