import { iFullTFG } from "@/app/types/interfaces";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { IconChevronRight, IconDownload, IconEye } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export default function TFG_BasicInfo({ TFG }: { TFG: iFullTFG }) {
    return (
        <>
            <section className="text-3xl lg:text-5xl text-center md:text-left font-semibold uppercase">
                {TFG.title}
            </section>
            <section className="inline-block mx-auto">
                {TFG.author.length > 0 && (
                    <div className="flex pt-7 ">
                        <div className="font-bold text-xs lg:text-sm text-nova-gray pt-[6px]">
                            AUTOR/ES
                        </div>
                        <div className="pl-7 font-semibold uppercase text-lg lg:text-xl">
                            {TFG.author.map((author, index) => (
                                <React.Fragment key={index}>
                                    {index != 0 && <Divider className="my-1" />}
                                    <div>{author.name}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
                {TFG.tutor.length > 0 && (
                    <div className="flex pt-4">
                        <div className="font-bold text-xs lg:text-sm text-nova-gray pt-[6px]">
                            TUTOR/ES
                        </div>
                        <div className="pl-7 font-semibold uppercase text-lg lg:text-xl md:max-w-96">
                            {TFG.tutor.map((tutor, index) =>
                                tutor.contactDetails ? (
                                    <Link
                                        key={index}
                                        href={tutor.contactDetails || "#"}
                                        target="_blank"
                                        className="transition-colors hover:text-nova-link group w-full block"
                                    >
                                        {`${tutor.name}`}
                                        <IconChevronRight
                                            className="inline-block ml-1 mb-1 text-blue-500 stroke-3 duration-400 group-hover:translate-x-1"
                                            size={23}
                                        />
                                    </Link>
                                ) : (
                                    <div
                                        key={index}
                                        className="w-full"
                                    >
                                        {tutor.name}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </section>
            <section className="font-semibold pt-5">
                <div className="text-nova-gray flex items-end">
                    {TFG.college.name}
                    {TFG.college.image && (
                        <img
                            className="ml-2 mb-1"
                            src={TFG.college.image}
                            alt="Universidad de Alicante"
                        ></img>
                    )}
                </div>
                {TFG.department && (
                    <div className="flex items-center uppercase font-semibold md:max-w-96">
                        <Link
                            href={TFG.department.link || "#"}
                            target="_blank"
                            className="transition-colors hover:text-nova-link group"
                        >
                            {TFG.department.name}
                            <IconChevronRight
                                className="inline-block ml-1 mb-1 text-blue-500 stroke-3 duration-400 group-hover:translate-x-1"
                                size={23}
                            />
                        </Link>
                    </div>
                )}
            </section>

            <section className="pt-3 md:pt-7 flex flex-wrap gap-2 justify-center md:justify-start">
                <Button
                    radius="sm"
                    className="bg-nova-button text-nova-light font-semibold"
                >
                    <IconEye size={20} /> <span className="hidden md:inline">Ver memoria</span>
                </Button>
                <Button
                    radius="sm"
                    className="bg-nova-button text-nova-light font-semibold"
                >
                    <IconDownload size={20} /> <span className="hidden md:inline">Descargar memoria</span>
                </Button>
            </section>
            <section className="pt-5 flex flex-wrap gap-2 md:max-w-96">
                {TFG.tags.map((tag, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`text-xs inline-block transition-colors bg-black/60 hover:bg-slate-400/50 px-4 py-2 lg:px-2 lg:py-1 rounded-full`}
                    >
                        <span className="inline-block pr-[2px] text-blue-500">
                            #
                        </span>
                        <span className="font-medium">{tag}</span>
                    </button>
                ))}
            </section>
        </>
    );
}
