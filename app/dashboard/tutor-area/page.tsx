import { authOptions } from "@/app/lib/authOptions";
import { Role, TFGStatus } from "@/app/lib/enums";
import { IconBox, IconEye, IconMessageFilled, IconStarFilled, IconWriting } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { formatViews } from "@/app/utils/util";
import { Divider } from "@nextui-org/divider";
import React from "react";
import Link from "next/link";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";

export default async function TutorArea() {
    const session = await getServerSession(authOptions);
    if (!session || ![Role.TUTOR, Role.MANAGER, Role.ADMIN].includes(session.user.role as Role)) return redirect("/dashboard");

    const userId = session.user.uid;

    const projects = await prisma.tfg.findMany({
        where: {
            tutors: {
                some: {
                    userId: userId,
                },
            },
        },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            status: true,
            views: true,
            score: true,
            createdAt: true,
            authors: {
                select: {
                    name: true,
                },
            },
        },
    });

    const messages = await prisma.tfg.findMany({
        where: {
            tutors: {
                some: {
                    userId: userId,
                },
            },
            reviewMessages: {
                some: {
                    reads: {
                        none: {
                            userId: userId,
                        },
                    },
                },
            },
        },
        select: {
            id: true,
            title: true,
            description: true,
            authors: {
                select: {
                    name: true,
                    image: true,
                },
            },
            thumbnail: true,
            reviewMessages: {
                where: {
                    reads: {
                        none: {
                            userId: userId,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    const pendingProjects = projects.filter((project) => project.status === TFGStatus.SENT_FOR_REVIEW);
    let totalUnreadMessages = 0;

    messages.forEach((tfg) => {
        totalUnreadMessages += tfg.reviewMessages.length;
    });

    return (
        <main className="w-full">
            <TabGroup>
                <TabList className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <Tab className="data-[selected]:opacity-100 opacity-50 transition-opacity data-[selected]:border-none rounded-lg bg-gradient-to-r from-indigo-900 to-purple-500 p-5 flex gap-2 items-center">
                        <div className="flex-1 flex items-center">
                            <h2 className="text-5xl font-semibold text-center w-16">
                                {projects.filter((project) => project.status === TFGStatus.SENT_FOR_REVIEW).length}
                            </h2>
                            <div className="pl-3 leading-5 text-left">PROYECTOS PENDIENTES DE REVISIÓN</div>
                        </div>
                        <div>
                            <IconWriting size={60} />
                        </div>
                    </Tab>
                    <Tab className="data-[selected]:opacity-100 opacity-50 transition-opacity data-[selected]:border-none rounded-lg bg-gradient-to-r from-teal-700 to-teal-500 p-5 flex gap-2 items-center">
                        <div className="flex-1 flex items-center">
                            <h2 className="text-5xl font-semibold text-center w-16">{totalUnreadMessages}</h2>
                            <div className="pl-3 leading-5 text-left">MENSAJES SIN LEER</div>
                        </div>
                        <div>
                            <IconMessageFilled size={60} />
                        </div>
                    </Tab>
                    <Tab className="data-[selected]:opacity-100 opacity-50 transition-opacity data-[selected]:border-none rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 p-5 flex gap-2 items-center">
                        <div className="flex-1 flex items-center">
                            <h2 className="text-5xl font-semibold text-center w-16">{projects.length}</h2>
                            <div className="pl-3 leading-5 text-left">PROYECTOS SUPERVISADOS</div>
                        </div>
                        <div>
                            <IconBox size={60} />
                        </div>
                    </Tab>
                </TabList>
                <TabPanels className="mt-3">
                    <TabPanel className="rounded-xl bg-white/5 p-3">
                        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            {pendingProjects.map((project) => (
                                <li key={project.id} className="relative rounded-md text-sm/6 transition bg-white/5">
                                    <article className="p-3 gap-3 flex overflow-hidden border-1 border-white/5 rounded-lg">
                                        <img className="h-20 rounded-lg block" src={project.thumbnail} title={project.title} />
                                        <div className="flex-1">
                                            <div className=" text-white">
                                                <span className="font-semibold">
                                                    {project.title}
                                                </span>

                                                <div className="">
                                                    Por:{" "}
                                                    {project.authors.map((author, index) => (
                                                        <span key={index}>
                                                            {author.name}
                                                            {index !== project.authors.length - 1 && ","}{" "}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-sm text-nova-gray">{project.description}</div>
                                            </div>
                                            <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                                <li className="flex items-center gap-1">
                                                    {formatViews(project.views)}
                                                    <IconEye className="text-teal-500" size={17} />
                                                </li>

                                                <li className="flex items-center gap-1">
                                                    {project.score} <IconStarFilled className="text-yellow-500" size={14} />
                                                </li>
                                                <li>{project.createdAt.toLocaleDateString()}</li>
                                            </ul>
                                        </div>
                                        <div className="flex items-start gap-1">
                                            <Tooltip closeDelay={200} content="Revisar proyecto">
                                                <Button
                                                    isIconOnly
                                                    as={Link}
                                                    className="rounded-full min-w-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500"
                                                    href={`/dashboard/tutor-area/${project.id}`}>
                                                    <IconWriting size={20} />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </article>
                                </li>
                            ))}
                        </ul>
                    </TabPanel>
                    <TabPanel className="rounded-xl bg-white/5 p-3">
                        <ul>c</ul>
                    </TabPanel>
                    <TabPanel className="rounded-xl bg-white/5 p-3 ">
                        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            {projects.map((project) => (
                                <li key={project.id} className="relative rounded-md text-sm/6 transition hover:bg-white/5">
                                    <Link href={`/dashboard/tutor-area/${project.id}`} className="p-3 gap-3 flex overflow-hidden">
                                        <img className="h-20 rounded-lg block" src={project.thumbnail} title={project.title} />
                                        <div className="flex-1">
                                            <div className=" text-white">
                                                <span className="font-semibold">{project.title}</span>
                                                <div className="">
                                                    Por:{" "}
                                                    {project.authors.map((author, index) => (
                                                        <span key={index}>
                                                            {author.name}
                                                            {index !== project.authors.length - 1 && ","}{" "}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-sm text-nova-gray">{project.description}</div>
                                            </div>
                                            <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                                <li className="flex items-center gap-1">
                                                    {formatViews(project.views)}
                                                    <IconEye className="text-teal-500" size={17} />
                                                </li>

                                                <li className="flex items-center gap-1">
                                                    {project.score} <IconStarFilled className="text-yellow-500" size={14} />
                                                </li>
                                                <li>{project.createdAt.toLocaleDateString()}</li>
                                            </ul>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </main>
    );
}
