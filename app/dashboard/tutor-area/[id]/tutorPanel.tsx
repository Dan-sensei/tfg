"use client";

import TFG_Details from "@/app/components/TFG/TFG_Details";
import { TFGStatus } from "@/app/lib/enums";
import { HeadlessBasic } from "@/app/lib/headlessUIStyle";
import { Category, FullUser, iFullTFG, ReviewMessageType, SimplifiedUser, Titulation } from "@/app/types/interfaces";
import { Button, Input, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Avatar } from "@nextui-org/avatar";
import { Button as NextUIButon } from "@nextui-org/button";
import TextareaAutosize from "react-textarea-autosize";

import { IconCheck, IconEye, IconEyeX, IconSend2, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import ReviewMessageBox from "@/app/components/ReviewMessageBox";
import { produce } from "immer";
import { isNullOrEmpty } from "@/app/utils/util";
import { Spinner } from "@nextui-org/spinner";
import Chatbox from "@/app/components/Chatbox";

interface ReadonlyExtraInfo {
    readonly status: TFGStatus;
    readonly reviewMessages: ReviewMessageType[];
    readonly category: Category;
    readonly titulation: Titulation;
}

interface TutorPanelProps {
    readonly extraInfo: ReadonlyExtraInfo;
    readonly TFG: iFullTFG;
    readonly userId: number;
}

export default function TutorPanel({ TFG, extraInfo, userId }: TutorPanelProps) {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <>
            <div className="p-3 bg-gray-900 rounded-l-xl flex flex-col  border-1 border-white/5 w-full md:w-[50%] lg:w-[450px]">
                <div className="flex gap-3 mb-4">
                    <NextUIButon className="w-full rounded-full bg-gradient-to-r from-teal-600 to-teal-500">Publicar</NextUIButon>
                </div>
                <TabGroup className="flex-grow flex flex-col">
                    <TabList className="flex gap-4">
                        <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                            Información
                        </Tab>
                        <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                            Mensajes
                        </Tab>
                    </TabList>
                    <TabPanels className="mt-3 flex-1 relative">
                        <TabPanel className=" absolute top-0 bottom-0 left-0 right-0">
                            <SimpleBar autoHide={false} className="h-full pr-4">
                                <ul className="flex flex-col gap-2 rounded-xl  bg-white/5 p-3">
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Título:</span>
                                        <span className="font-sm">{TFG.title}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Descripción:</span>
                                        <span className="font-sm">{TFG.description}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Autor/es:</span>
                                        <span className="font-sm flex flex-col gap-2 pt-2">
                                            {TFG.author.map((author, index) => {
                                                const avatarProp = author.image ? { src: author.image } : { name: author.name?.slice(0, 2) ?? "-" };

                                                return (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Avatar color="primary" size="sm" {...avatarProp} />
                                                        <span>{author.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Tutor/es:</span>
                                        <span className="font-sm flex flex-col gap-2 pt-2">
                                            {TFG.tutors.map((tutor, index) => {
                                                const avatarProp = tutor.image ? { src: tutor.image } : { name: tutor.name?.slice(0, 2) ?? "-" };

                                                return (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Avatar color="primary" size="sm" {...avatarProp} />
                                                        <span>{tutor.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Enlace a la memoria:</span>
                                        <span className="font-sm">{TFG.documentLink}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Páginas de la memoria:</span>
                                        <span className="font-sm">{TFG.pages}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Categoria:</span>
                                        <span className="font-sm">{extraInfo.category.name}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Titulacion:</span>
                                        <span className="font-sm">{extraInfo.titulation.name}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Departamento:</span>
                                        <span className="font-sm">{TFG.department ? TFG.department.name : "(Ninguno)"}</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-tiny text-nova-gray">Creado:</span>
                                        <span className="font-sm">{TFG.createdAt.toLocaleDateString()}</span>
                                    </li>
                                </ul>
                            </SimpleBar>
                        </TabPanel>
                        <TabPanel className="h-full flex flex-col">
                            <Chatbox userId={userId} tfgId={TFG.id} defReviewMessages={extraInfo.reviewMessages} />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
            <div
                className={clsx(
                    "flex-1 absolute h-full md:h-auto md:relative bg-nova-darker-2 border-1  min-h-[600px] border-l-0 border-white/10 w-full left-0 top-0 transition-transform rounded-large md:rounded-r-xl md:rounded-l-none md:translate-x-0 shadow-dark overflow-hidden",
                    showPreview ? "translate-x-0 " : "translate-x-[105%]",
                    "z-20"
                )}>
                <div className="absolute top-0 bottom-0 left-0 right-0 w-full bg-grid">
                    <SimpleBar autoHide={false} className="h-full pr-4">
                        <TFG_Details TFG={TFG} />
                    </SimpleBar>
                </div>
            </div>
            <NextUIButon
                onClick={() => setShowPreview((preview) => !preview)}
                className={clsx(
                    "fixed  md:hidden top-60 shadow-light-dark -right-3 flex gap-3 rounded-l-full px-7 py-3 z-50",
                    showPreview ? "bg-red-500" : "bg-blue-500 "
                )}>
                {showPreview ? (
                    <>
                        <IconEyeX /> Ocultar preview
                    </>
                ) : (
                    <>
                        <IconEye /> Ver preview
                    </>
                )}
            </NextUIButon>
        </>
    );
}
