"use client";
import { IconEye, IconStarFilled, IconWriting } from "@tabler/icons-react";
import { iDashboardProject } from "../../types/interfaces";
import { formatViews } from "../../utils/util";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import clsx from "clsx";

type ExtraOption = {
    icon: JSX.Element;
    onClick?: () => void;
    tooltip: string;
    bgColor?: string;
    href?: string;
};

type Props = {
    project: iDashboardProject;
    extraOptions?: ExtraOption[];
};

export default function DashboardProjectCard({ project, extraOptions }: Props) {
    return (
        <article className="p-3 gap-3 flex overflow-hidden  rounded-lg">
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
            <div className="flex flex-col items-start gap-2">
                <Tooltip closeDelay={200} content="Revisar proyecto" placement="right">
                    <Button
                        as={Link}
                        isIconOnly
                        className="rounded-full min-w-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500"
                        href={`/dashboard/tutor-area/${project.id}`}>
                        <IconWriting size={20} />
                    </Button>
                </Tooltip>
                {extraOptions &&
                    extraOptions.map((option, index) => (
                        <Tooltip key={index} closeDelay={200} content={option.tooltip} placement="right">
                            <Button
                                isIconOnly
                                {...(option.href ? { as: Link, href: option.href, target: "_blank" } : {})}
                                className={clsx("rounded-full min-w-0 w-8 h-8", option.bgColor ?? "bg-gradient-to-r from-blue-600 to-blue-500")}
                                onClick={option.onClick}>
                                {option.icon}
                            </Button>
                        </Tooltip>
                    ))}
            </div>
        </article>
    );
}
