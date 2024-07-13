import CategoriesForm from "@/app/components/dashboardComponents/categoriesForm";
import CollegeName from "@/app/components/dashboardComponents/collegeName";
import DepartmentsForm from "@/app/components/dashboardComponents/departmentsForm";
import LocationsForm from "@/app/components/dashboardComponents/locationsForm.tsx";
import TitulationsForm from "@/app/components/dashboardComponents/titulationsForm";
import { checkAuthorization, REQUIRED_ROLES } from "@/app/lib/auth";
import { Role } from "@/app/lib/enums";
import { Divider } from "@nextui-org/divider";
import { IconCategoryFilled, IconMapPinFilled, IconMicroscope, IconSchool } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function ManagerArea() {
    const { session } = await checkAuthorization(REQUIRED_ROLES.MINIMUM_MANAGER);
    if (!session) return redirect("/dashboard");

    return (
        <main className="w-full">
            <CollegeName />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 ">
                <section className="rounded-lg border-1 relative  shadow-light-dark border-white/5 overflow-hidden bg-gradient-to-r from-blue-950 to-blue-900 p-5 flex gap-2  items-stretch">
                    <div className=" bg-white/5 rounded-full pointer-events-none size-[450px]  items-center absolute top-0 left-0 -translate-x-[65%] -translate-y-[65%]"></div>
                    <IconSchool className="size-10  xl:size-16 absolute right-0 xl:left-0 top-0 mr-4 ml-4 mt-4 opacity-35" />
                    <div className="pl-5 xl:pl-20 pt-2 w-full pr-5">
                        <div className=" uppercase leading-5 text-left text-2xl">Titulaciones</div>
                        <TitulationsForm className="pt-5" />
                    </div>
                </section>
                <section className="rounded-lg border-1 relative  shadow-light-dark border-white/5 overflow-hidden bg-gradient-to-r from-teal-900 to-teal-950 p-5 flex gap-2  items-stretch">
                    <div className=" bg-white/5 rounded-full pointer-events-none size-[450px]  items-center absolute top-0 left-0 -translate-x-[65%] -translate-y-[65%]"></div>
                    <IconMicroscope className="size-10  xl:size-16 absolute right-0 xl:left-0 top-0 mr-4 ml-4 mt-4 opacity-35" />
                    <div className="pl-5 xl:pl-20 pt-2 w-full pr-5">
                        <div className=" uppercase leading-5 text-left text-2xl">Departamentos</div>
                        <DepartmentsForm className="pt-5" />
                    </div>
                </section>
                <section className="rounded-lg border-1 relative  shadow-light-dark border-white/5 overflow-hidden bg-gradient-to-r from-yellow-800 to-yellow-900 p-5 flex gap-2  items-stretch">
                    <div className=" bg-white/5 rounded-full pointer-events-none size-[450px]  items-center absolute top-0 left-0 -translate-x-[65%] -translate-y-[65%]"></div>
                    <IconMapPinFilled className="size-10  xl:size-16 absolute right-0 xl:left-0 top-0 mr-4 ml-4 mt-4 opacity-35" />
                    <div className="pl-5 xl:pl-20 pt-2 w-full pr-5">
                        <div className=" uppercase leading-5 text-left text-2xl">Localizaciones</div>
                        <LocationsForm className="pt-5" />
                    </div>
                </section>
            </div>
            <Divider className="my-3" />
            <h2 className="text-xl uppercase pb-1">Categorias</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2">
                {session.user.role === Role.ADMIN && (
                    <section className="rounded-lg border-1 relative  shadow-light-dark border-white/5 overflow-hidden bg-gradient-to-r from-indigo-900 to-indigo-950 p-5 flex gap-2  items-stretch">
                        <div className=" bg-white/5 rounded-full pointer-events-none size-[450px]  items-center absolute top-0 left-0 -translate-x-[65%] -translate-y-[65%]"></div>
                        <IconCategoryFilled className="size-10  xl:size-16 absolute right-0 xl:left-0 top-0 mr-4 ml-4 mt-4 opacity-35" />
                        <div className="pl-5 xl:pl-20 pt-2 w-full pr-5">
                            <div className=" uppercase leading-5 text-left text-2xl">Categorías</div>
                            <CategoriesForm className="pt-5" />
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
