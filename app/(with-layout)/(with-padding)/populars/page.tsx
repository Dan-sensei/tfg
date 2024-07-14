import { redirect, RedirectType } from "next/navigation";
import * as v from "valibot";
import { IdSchema } from "@/app/lib/schemas";
import prisma from "@/app/lib/db";
import { TFGStatus } from "@/app/lib/enums";
import ProjectGrid from "@/app/components/ProjectGrid";
import { getAllPublishedProjectsCount, getProjectsInTitulationWithProjectCount } from "@/app/lib/fetchData";

export default async function Populars() {

    const projectCount = await getAllPublishedProjectsCount();

    return (
        <ProjectGrid
            id={2}
            name={"Más vistos"}
            totalElementsCount={projectCount}
            apiRoute="popular"
        />
    );
}
