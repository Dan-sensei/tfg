import { authOptions } from "@/app/lib/authOptions";
import { Role, TFGStatus } from "@/app/lib/enums";
import {
    IconBox,
    IconCactus,
    IconCircleDashedCheck,
    IconEye,
    IconMailbox,
    IconMessageFilled,
    IconStarFilled,
    IconWriting,
} from "@tabler/icons-react";
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
import SimpleBar from "simplebar-react";
import SimpleBarAbs from "@/app/components/SimpleBarAbs";
import DashboardProjectCard from "@/app/components/DashboardProjectCard";
import ReviewMessageBox from "@/app/components/ReviewMessageBox";
import clsx from "clsx";
import { Avatar } from "@nextui-org/avatar";

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
        orderBy: {
            createdAt: "desc",
        },
    });

    const projectsWithNewMessages = await prisma.tfg.findMany({
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
                select: {
                    message: true,
                    createdAt: true,
                    edited: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
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

    const publishedProjects = projects.filter((project) => project.status === TFGStatus.PUBLISHED);

    const pendingProjects = projects.filter((project) => project.status === TFGStatus.SENT_FOR_REVIEW);
    let totalUnreadMessages = 0;

    projectsWithNewMessages.forEach((tfg) => {
        totalUnreadMessages += tfg.reviewMessages.length;
    });

    return (
        <main className="w-full">
            <TabGroup className={"h-full flex flex-col"}>
                <TabList className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <Tab className="data-[selected]:opacity-100 opacity-50 transition-opacity data-[selected]:border-none rounded-lg bg-gradient-to-r from-indigo-900 to-purple-500 p-5 flex gap-2 items-center">
                        <div className="flex-1 flex items-center">
                            <h2 className="text-5xl font-semibold text-center w-16">{pendingProjects.length}</h2>
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
                            <h2 className="text-5xl font-semibold text-center w-16">{publishedProjects.length}</h2>
                            <div className="pl-3 leading-5 text-left">PROYECTOS SUPERVISADOS</div>
                        </div>
                        <div>
                            <IconBox size={60} />
                        </div>
                    </Tab>
                </TabList>
                <TabPanels className="mt-3 flex-1 flex w-full relative rounded-xl bg-white/5">
                    <SimpleBarAbs>
                        <TabPanel className="p-3">
                            {pendingProjects.length === 0 ? (
                                <div className="flex flex-col h-full flex-1 items-center justify-center gap-3 pt-10">
                                    <IconCircleDashedCheck className="stroke-1 text-green-500" size={60} />
                                    <p className="text-xl">No tienes proyectos pendientes de revisión</p>
                                </div>
                            ) : (
                                <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 pr-[6px]">
                                    {pendingProjects.map((project) => (
                                        <li key={project.id} className="relative rounded-md text-sm/6 transition border-1 border-white/5 bg-white/5">
                                            <DashboardProjectCard project={project} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </TabPanel>
                        <TabPanel className="p-3">
                            {totalUnreadMessages === 0 ? (
                                <div className="flex flex-col h-full flex-1 items-center justify-center gap-3 pt-10">
                                    <IconMailbox className="stroke-1 " size={60} />
                                    <p className="text-xl">No tienes ningún mensaje sin leer</p>
                                </div>
                            ) : (
                                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {projectsWithNewMessages.map((project) => {
                                        const lastMessages = project.reviewMessages.slice(-3);
                                        return (
                                            <li
                                                key={project.id}
                                                className="relative rounded-md text-sm/6 transition border-1 border-white/5 bg-white/5">
                                                <div className="p-3">
                                                    <section className="flex gap-2">
                                                        <div className="h-20 text-center">
                                                            <img src={project.thumbnail} className="h-full inline rounded-lg" alt={project.title} />
                                                        </div>
                                                        <div className="leading-4 flex-1">
                                                            <h2>{project.title}</h2>
                                                            <span className="text-tiny text-nova-gray">{project.description}</span>
                                                        </div>
                                                        <Tooltip closeDelay={200} content="Revisar proyecto">
                                                            <Button
                                                                isIconOnly
                                                                as={Link}
                                                                className="rounded-full min-w-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500"
                                                                href={`/dashboard/tutor-area/${project.id}`}>
                                                                <IconWriting size={20} />
                                                            </Button>
                                                        </Tooltip>
                                                    </section>
                                                    <div className="mt-2 bg-dark-grid rounded-md p-2 ">
                                                        <div className="flex flex-col gap-1 mask-top-10 max-h-[200px] justify-end overflow-hidden">
                                                            {lastMessages.map((message, index) => {
                                                                const own = message.user?.id === userId;
                                                                const showAvatarAndName = message.user?.id !== lastMessages[index + 1]?.user?.id;
                                                                const hours = message.createdAt.getHours().toString().padStart(2, "0");
                                                                const minutes = message.createdAt.getMinutes().toString().padStart(2, "0");
                                                                const avatarProp = message.user?.image
                                                                    ? { src: message.user.image }
                                                                    : { name: message.user?.name?.slice(0, 2) ?? "-" };
                                                                return (
                                                                    <div className={clsx("w-full flex gap-1", showAvatarAndName && "mt-1")}>
                                                                        <div className="w-8 flex flex-col justify-end">
                                                                            {!own && showAvatarAndName && <Avatar {...avatarProp} size="sm" />}
                                                                        </div>
                                                                        <div className={clsx("flex-1 flex ", own && "justify-end")}>
                                                                            <div
                                                                                className={clsx(
                                                                                    "max-w-full inline-block lg:max-w-[85%] xl:max-w-[70%] h-full whitespace-pre-wrap items-center justify-center text-left text-sm relative  border-1 border-white/10 rounded-xl px-3 pt-2 pb-1",
                                                                                    own ? "bg-blue-600" : "bg-white/10"
                                                                                )}>
                                                                                <div className="pr-7 min-h-5">
                                                                                    {!own && showAvatarAndName && (
                                                                                        <div className="text-tiny font-semibold">
                                                                                            {message.user ? (
                                                                                                message.user.name
                                                                                            ) : (
                                                                                                <span className="text-nova-gray">
                                                                                                    (Usuario borrado)
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                    {message.message}
                                                                                </div>
                                                                                <div className="text-right text-tiny text-nova-gray">
                                                                                    <span className="inline-block pr-1">
                                                                                        {message.edited && "editado"}
                                                                                    </span>{" "}
                                                                                    {`${hours}:${minutes}`}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </TabPanel>
                        <TabPanel className="p-3 ">
                            {publishedProjects.length === 0 ? (
                                <div className="flex flex-col h-full flex-1 items-center justify-center gap-3 pt-10">
                                    <IconCactus className="stroke-1" size={60} />
                                    <p className="text-xl">No tienes proyectos supervisados</p>
                                </div>
                            ) : (
                                <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 pr-[6px]">
                                    {publishedProjects.map((project) => (
                                        <li key={project.id} className="relative rounded-md text-sm/6 transition border-1 border-white/5 bg-white/5">
                                            <DashboardProjectCard project={project} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </TabPanel>
                    </SimpleBarAbs>
                </TabPanels>
            </TabGroup>
        </main>
    );
}
