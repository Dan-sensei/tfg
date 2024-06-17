import { Suspense } from "react";
import FullSearch from "./FullSearch";
import { Category, PopularTag, Titulation } from "@/app/types/interfaces";
import { getAllCategories, getAllTitulations, getTopTags } from "@/app/lib/fetchData";

export default async function Search() {
    const [categories, titulations, popular_tags] = await Promise.all([
        getAllCategories(),
        getAllTitulations(),
        getTopTags(10),
    ]);
    return (
        <Suspense>
            <FullSearch categories={categories} titulations={titulations} popular_tags={popular_tags} />
        </Suspense>
    );
}
