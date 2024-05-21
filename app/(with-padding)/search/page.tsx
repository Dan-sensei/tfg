import { Suspense } from "react";
import FullSearch from "./FullSearch";

export default function Search() {
    return (
        <Suspense>
            <FullSearch />
        </Suspense>
    );
}
