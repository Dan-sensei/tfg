import { redirect, RedirectType } from "next/navigation";
import ProjectGrid from "@/app/components/ProjectGrid";
import * as v from "valibot";
import { IdSchema } from "@/app/lib/schemas";
import prisma from "@/app/lib/db";
import { TFGStatus } from "@/app/lib/enums";

export default async function Categoria({ params }: { params: { id: string } }) {
    const validateIdResult = v.safeParse(IdSchema, params.id[0]);
    if (!validateIdResult.success) {
        redirect("/categorias", RedirectType.replace);
    }

    const categoryWithProjectCount = await prisma.category.findUnique({
        where: { id: validateIdResult.output },
        select: {
            name: true,
            _count: {
                select: {
                    tfgs: {
                        where: { status: TFGStatus.PUBLISHED },
                    },
                },
            },
        },
    });
    

    if (!categoryWithProjectCount) {
        redirect("/categorias", RedirectType.replace);
    }

    return <ProjectGrid id={validateIdResult.output} name={categoryWithProjectCount.name} totalElementsCount={categoryWithProjectCount._count.tfgs} apiRoute="category" />;
}
