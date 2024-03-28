"use client";
import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@nextui-org/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";

export default function Search() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "F" && event.shiftKey) {
                event.preventDefault();
                onOpen();
            }
        };

        window.onkeydown = handleKeyDown;

        return () => {
            window.onkeydown = null;
        };
    }, []);
    return (
        <>
            <Button
                onPress={onOpen}
                radius="full"
                className="group bg-nova-darker-2/50 "
            >
                <div className="duration-500 w-40 group-hover:w-44 flex">
                    <div className="mr-auto flex items-center">
                        <IconSearch className="text-slate-400 pointer-events-none" />
                        <div className="pl-2">Buscar...</div>
                    </div>
                    <Kbd keys={["shift"]} className="bg-nova-darker-2 ml-auto">
                        F
                    </Kbd>
                </div>
            </Button>
            <Modal
                size="5xl"
                isOpen={isOpen}
                classNames={{ base: "bg-black/70 backdrop-blur-sm" }}
                closeButton={<></>}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-3">
                                <div className="flex grow">
                                    <Input
                                        autoFocus
                                        isClearable
                                        radius="lg"
                                        classNames={{
                                            input: [
                                                "bg-transparent",
                                                "text-black/90 dark:text-white/90",
                                                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                                            ],
                                            innerWrapper: "bg-transparent",
                                            inputWrapper: [
                                                "bg-transparent",
                                                "dark:bg-transparent",
                                                "hover:bg-transparent",
                                                "dark:hover:bg-transparent",
                                                "group-data-[focus=true]:bg-transparent",
                                                "dark:group-data-[focus=true]:bg-transparent",
                                                "group-data-[focus=true]:shadow-[none]",
                                                "dark:group-data-[focus=true]:shadow-[none]",
                                                "!cursor-text",
                                            ],
                                        }}
                                        style={{boxShadow: "none"}}
                                        placeholder="Type to search..."
                                    />
                                </div>
                                <div>
                                    <Kbd className="bg-nova-light-dark ml-auto">
                                        ESC
                                    </Kbd>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                Popular tags:
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
