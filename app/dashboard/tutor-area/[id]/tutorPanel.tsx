"use client";

import TFG_Details from "@/app/components/TFG/TFG_Details";
import { TFGStatus, TFGStatusText } from "@/app/lib/enums";
import { HeadlessBasic } from "@/app/lib/headlessUIStyle";
import { Category, FullUser, iDetailsTFG, iPublishCheck, ReviewMessageType, SimplifiedUser, Titulation } from "@/app/types/interfaces";
import { Button, Input, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Avatar } from "@nextui-org/avatar";
import { Button as NextUIButon } from "@nextui-org/button";
import TextareaAutosize from "react-textarea-autosize";

import { IconArchiveFilled, IconBookUpload, IconCheck, IconEye, IconEyeX, IconSend2, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import { Spinner } from "@nextui-org/spinner";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/modal";
import Chatbox from "@/app/components/dashboardComponents/Chatbox";
import { useToast } from "@/app/contexts/ToasterContext";

interface ReadonlyExtraInfo {
    readonly status: TFGStatus;
    readonly reviewMessages: ReviewMessageType[];
    readonly category: Category;
    readonly titulation: Titulation;
}

interface TutorPanelProps {
    readonly extraInfo: ReadonlyExtraInfo;
    readonly TFG: iDetailsTFG;
    readonly userId: number;
}

export default function TutorPanel({ TFG, extraInfo, userId }: TutorPanelProps) {
    const [showPreview, setShowPreview] = useState(false);
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState(extraInfo.status);
    const { toast } = useToast();

    const publish = () => {
        if (status !== TFGStatus.SENT_FOR_REVIEW || isUpdating) return;
        setIsUpdating(true);
        const CompleteTFGData: iPublishCheck = {
            id: TFG.id,
            title: TFG.title,
            description: TFG.description,
            categoryId: extraInfo.category.id,
            titulationId: extraInfo.titulation.id,
            departmentId: TFG.department ? TFG.department.id : null,
            banner: TFG.banner,
            thumbnail: TFG.thumbnail,
            contentBlocks: TFG.contentBlocks,
            pages: TFG.pages,
            tags: TFG.tags,
            documentLink: TFG.documentLink,
        };

        fetch("/api/dashboard/tfg/publish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(CompleteTFGData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    onClose();
                    toast.success("TFG publicado");
                    setStatus(TFGStatus.PUBLISHED);
                } else {
                    toast.error("La publicación ha fallado");
                }
            }).finally(() => setIsUpdating(false));
    };

    const revert = () => {
        if (status !== TFGStatus.PUBLISHED || isUpdating) return;
        setIsUpdating(true);
        fetch("/api/dashboard/tfg/revert-to-review", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tfgId: TFG.id }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    onClose();
                    toast.success("TFG puesto en revisión");
                    setStatus(TFGStatus.SENT_FOR_REVIEW);
                } else {
                    toast.error("La reversión ha fallado");
                }
            }).finally(() => setIsUpdating(false));
    };

    return (
        <>
            <Modal isOpen={isOpen} placement="top-center" size="4xl" onOpenChange={onOpenChange}>
                <ModalContent className="bg-transparent">
                    {(onClose) => (
                        <>
                            <ModalBody className=" bg-black/95 border-1 border-white/20 rounded-large overflow-hidden py-10 px-10">
                                {status === TFGStatus.PUBLISHED ? (
                                    <>
                                        <div className="text-center">
                                            <div className="flex justify-center pb-5">
                                                <IconArchiveFilled className="" size={70}></IconArchiveFilled>
                                            </div>
                                            Al hacer clic en &quot;<span className="text-warning-400">Revertir</span>,&quot; se ocultará el proyecto de la parte
                                            pública y el alumno <span className="text-teal-500">podrá modificarlo</span>
                                        </div>
                                        <div className="text-center pt-5">¿Estás seguro de que quieres continuar?</div>
                                        <div className="flex justify-center">
                                            <NextUIButon onClick={revert} className=" px-10 w-24 rounded-full bg-yellow-500 text-black">
                                                {isUpdating ? <Spinner size="sm" color="white" /> : "Revertir"}
                                            </NextUIButon>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center">
                                            <div className="flex justify-center pb-5">
                                                <IconBookUpload className="" size={70}></IconBookUpload>
                                            </div>
                                            Al hacer clic en &quot;<span className="text-teal-500">Publicar</span>&quot;, el trabajo será visible públicamente y
                                            el alumno <span className="text-warning-400">no podrá modificarlo</span>. Solo un tutor, manager o
                                            administrador podrá marcarlo nuevamente como &quot;Borrador&quot; para permitir modificaciones.
                                        </div>
                                        <div className="text-center pt-5">¿Estás seguro de que quieres continuar?</div>
                                        <div className="flex justify-center">
                                            <NextUIButon
                                                onClick={publish}
                                                className=" px-10 w-24 rounded-full bg-gradient-to-r from-teal-600 to-teal-500">
                                                {isUpdating ? <Spinner size="sm" color="white" /> : "Publicar"}
                                            </NextUIButon>
                                        </div>
                                    </>
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="p-3 bg-gray-900 rounded-l-xl flex flex-col  border-1 border-white/5 w-full md:w-[50%] lg:w-[450px]">
                <div className="mb-4">
                    <div className="flex flex-col text-center pb-1">
                        <span className="text-tiny text-nova-gray">STATUS</span>
                        <span className={clsx("text-lg font-semibold", TFGStatusText[status].color)}>{TFGStatusText[status].text}</span>
                    </div>
                    {status === TFGStatus.PUBLISHED && (
                        <NextUIButon onClick={onOpen} className="w-full rounded-full bg-yellow-500 text-black">
                            Revertir a Revisión
                        </NextUIButon>
                    )}
                    {status === TFGStatus.SENT_FOR_REVIEW && (
                        <NextUIButon onClick={onOpen} className="w-full rounded-full bg-gradient-to-r from-teal-600 to-teal-500">
                            Publicar
                        </NextUIButon>
                    )}
                </div>
                <TabGroup className="flex-grow flex flex-col">
                    <TabList className="flex gap-3">
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
                    "flex-1 absolute h-full md:h-auto md:relative bg-nova-darker-2 border-1 border-l-0 border-white/10 w-full left-0 top-0 transition-transform rounded-large md:rounded-r-xl md:rounded-l-none md:translate-x-0 shadow-dark overflow-hidden",
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
