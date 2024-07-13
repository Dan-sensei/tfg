"use client";
import Autocomplete from "@/app/components/Autocomplete";
import SimpleBarAbs from "@/app/components/SimpleBarAbs";
import { useDashboard } from "@/app/contexts/DashboardContext";
import DashboardProjectCard from "@/app/dashboardComponents/DashboardProjectCard";
import { Role } from "@/app/lib/enums";
import { FullCollege, iDashboardProject } from "@/app/types/interfaces";
import { Spinner } from "@nextui-org/spinner";
import { IconEye, IconTrashX, IconTrashXFilled } from "@tabler/icons-react";


import { useEffect, useState } from "react";
import  { Toaster } from "react-hot-toast";

export default function ProjectList() {
    const [projects, setProjects] = useState<iDashboardProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { collegeId } = useDashboard();

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/dashboard/tfg/get-all?collegeId=${collegeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setProjects(data.response.map((d: iDashboardProject) => ({ ...d, createdAt: new Date(d.createdAt) })));
            })
            .catch((e) => console.error(e))
            .finally(() => setIsLoading(false));
    }, [collegeId]);

    return (
        <>
            <div className="w-full flex flex-col">
                <div className="text-2xl uppercase pb-3">
                    <h1>Lista de proyectos</h1>
                </div>
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <Spinner color="white" size="lg" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="h-full flex items-center justify-center">No hay proyectos registrados</div>
                ) : (
                    <div className="relative flex-1 bg-white/5 rounded-lg">
                        <SimpleBarAbs className="py-3 pl-3 pr-1">
                            <ul className="grid grid-cols-1 lg:grid-cols-2 pr-3 gap-3">
                                {projects.map((project) => (
                                    <li key={project.id} className="border-1 rounded-lg border-white/5 bg-white/5">
                                        <DashboardProjectCard
                                            extraOptions={[
                                                {
                                                    icon: <IconEye size={20} />,
                                                    href: `/page/${project.id}`,
                                                    tooltip: "Ver",
                                                    bgColor: "bg-teal-500",
                                                },
                                            ]}
                                            project={project}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </SimpleBarAbs>
                    </div>
                )}
            </div>
            <Toaster
                toastOptions={{
                    className: "border-white/10 border-1 ",
                    style: {
                        borderRadius: "10px",
                        background: "#1a1a1a",
                        color: "#fff",
                    },
                }}
            />
        </>
    );
}
