import ProjectGrid from "@/app/components/ProjectGrid";
import { getAllPublishedProjectsCount } from "@/app/lib/fetchData";
import { Suspense } from "react";

export default async function Populars() {
    const projectCount = await getAllPublishedProjectsCount();
    return (
        <Suspense>
            <ProjectGrid showOrderControls={false} name={"Mejor valorados"} totalElementsCount={projectCount} apiRoute="tfg/most" defOrder="desc" defSortBy="score" />
        </Suspense>
    );
}
