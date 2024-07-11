import Autocomplete from "@/app/components/Autocomplete";
import CategoriesForm from "@/app/dashboardComponents/categoriesForm";
import DefenseForm from "@/app/dashboardComponents/defenseForm";
import DepartmentsForm from "@/app/dashboardComponents/departmentsForm";
import TitulationsForm from "@/app/dashboardComponents/titulationsForm";
import { authOptions } from "@/app/lib/authOptions";
import { Role } from "@/app/lib/enums";
import { getAllCategoriesWithProjectCount, getAllDepartments, getAllDepartmentsWithProjectCount, getAllTitulations, getAllTitulationsWithProjectCount } from "@/app/lib/fetchData";
import { Category, CategoryWithTFGCount, TitulationWithTFGCount } from "@/app/types/interfaces";
import { IconCategoryFilled, IconMapPinFilled, IconMicroscope, IconSchool } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ManagerArea() {
    const session = await getServerSession(authOptions);
    if (!session || ![Role.MANAGER, Role.ADMIN].includes(session.user.role)) return redirect("/dashboard");
    let categories: CategoryWithTFGCount[], departments, titulations: TitulationWithTFGCount[];

    try {
        [categories, departments, titulations] = await Promise.all([
            getAllCategoriesWithProjectCount(),
            getAllDepartmentsWithProjectCount(session.user.collegeId),
            getAllTitulationsWithProjectCount(session.user.collegeId),
        ]);
    } catch (error) {
        console.error("Error fetching data:", error);
        return <div>Error fetching data</div>;
    }

    return (
        <main className="w-full">
            <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">
                <section className="rounded-lg col-span-2 xl:col-span-3 3xl:col-span-2 border-1 relative border-white/5 overflow-hidden bg-gradient-to-r from-indigo-900 to-indigo-950 p-5 flex gap-2  items-stretch">
                    <div className=" bg-white/5 rounded-full pointer-events-none size-[450px]  items-center absolute top-0 left-0 -translate-x-[65%] -translate-y-[65%]"></div>
                    <IconCategoryFilled className="size-10  xl:size-16 absolute right-0 xl:left-0 top-0 mr-4 ml-4 mt-4 opacity-35" />
                    <div className="pl-5 xl:pl-20 pt-2 w-full pr-5">
                        <div className=" uppercase leading-5 text-left text-2xl">Categorías</div>
                        <CategoriesForm className="pt-5" categories={categories} />
                    </div>
                </section>
                <section className="rounded-lg col-span-2 xl:col-span-3 3xl:col-span-2 border-1 relative border-white/5 overflow-hidden bg-gradient-to-r from-blue-900 to-blue-950 p-5 flex gap-2  items-stretch">
                    <div className=" bg-white/5 rounded-full pointer-events-none size-[450px]  items-center absolute top-0 left-0 -translate-x-[65%] -translate-y-[65%]"></div>
                    <IconSchool className="size-10  xl:size-16 absolute right-0 xl:left-0 top-0 mr-4 ml-4 mt-4 opacity-35" />
                    <div className="pl-5 xl:pl-20 pt-2 w-full pr-5">
                        <div className=" uppercase leading-5 text-left text-2xl">Titulaciones</div>
                        <TitulationsForm className="pt-5" titulations={titulations} />
                    </div>
                </section>
                <section className="rounded-lg col-span-2 xl:col-span-6 3xl:col-span-2 border-1 relative border-white/5 overflow-hidden bg-gradient-to-r from-teal-900 to-teal-950 p-5 flex gap-2  items-stretch">
                    <div className=" bg-white/5 rounded-full pointer-events-none size-[450px]  items-center absolute top-0 left-0 -translate-x-[65%] -translate-y-[65%]"></div>
                    <IconMicroscope className="size-10  xl:size-16 absolute right-0 xl:left-0 top-0 mr-4 ml-4 mt-4 opacity-35" />
                    <div className="pl-5 xl:pl-20 pt-2 w-full pr-5">
                        <div className=" uppercase leading-5 text-left text-2xl">Departamentos</div>
                        <DepartmentsForm className="pt-5" departments={departments} />
                    </div>
                </section>
            </div>
        </main>
    );
}
