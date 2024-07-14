import { redirect, RedirectType } from "next/navigation";
import * as v from "valibot";
import { IdSchema } from "@/app/lib/schemas";
import ProjectGrid from "@/app/components/ProjectGrid";
import { getProjectsInTitulationWithProjectCount } from "@/app/lib/fetchData";
import { Suspense } from "react";

export default async function Titulation({ params }: { params: { id: string } }) {
    const validateIdResult = v.safeParse(IdSchema, params.id[0]);
    if (!validateIdResult.success) {
        redirect("/titulations", RedirectType.replace);
    }

    const projectsInTitulation = await getProjectsInTitulationWithProjectCount(validateIdResult.output, true);

    if (!projectsInTitulation) {
        redirect("/titulations", RedirectType.replace);
    }

    return (
        <Suspense>
            <ProjectGrid
                id={validateIdResult.output}
                name={projectsInTitulation.name}
                totalElementsCount={projectsInTitulation.totalProjects}
                apiRoute="titulation"
            />
        </Suspense>
    );
}
