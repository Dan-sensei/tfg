import { IconCloudUpload, IconResize, IconTrashXFilled, IconX } from "@tabler/icons-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MessageError, ProjectFormData } from "../types/interfaces";
import clsx from "clsx";
import { blobToBase64, getFileType, isNullOrEmpty, roundTwoDecimals } from "../utils/util";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { DEF_BANNER } from "../types/defaultData";
import { deleteImageFromIndexedDB, loadImagesFromIndexedDB, saveImageToIndexedDB } from "../lib/indexedDBHelper";
import CropperComponent from "./Cropper";

type Props = {
    className?: string;
    label: string;
    id: string;
    updateForm: (data: Partial<ProjectFormData>, saveToLocalStorage: boolean) => void;
    setFile: Dispatch<SetStateAction<File | null>>;
    aspectRatio: string;
};

export default function ImageDrop({ className, label, id, updateForm, setFile, aspectRatio }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [displayImage, setDisplayImage] = useState<string | null>(null);
    const [uncroppedImage, setUncroppedImage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [fileType, setFileType] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const requestImages = async () => {
            const keys = [id, `u${id}`];
            try {
                const [banner, ubanner] = await loadImagesFromIndexedDB(keys);
                let original: string | null = null;
                if (banner) {
                    original = await blobToBase64(banner);
                    updateForm({ banner: original }, false);
                    setDisplayImage(original);
                    setFile(new File([banner], "banner.png", { type: banner.type }));
                }

                if (ubanner) {
                    const ubannerBase64 = await blobToBase64(ubanner);
                    setUncroppedImage(ubannerBase64);
                } else {
                    setUncroppedImage(original);
                }
            } catch (e) {
                console.error(e);
            }
            setIsMounted(true);
        };
        requestImages();
    }, []);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };
    const handleDragEnter = () => {
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFile = (file: File) => {
        const fileTypeRegex = /image\/(jpeg|jpg|png)/;
        const maxSize = 5 * 1024 * 1024;
        if (!fileTypeRegex.test(file.type)) {
            setErrorMessage(`Sólo se permiten archivos JPEG, JPG y PNG`);
            return;
        }
        if (file.size > maxSize) {
            setErrorMessage(`Tu imagen supera los 5MB (${roundTwoDecimals(file.size / 1024 / 1024)}MB)`);
            return;
        }
        setErrorMessage("");
        setFileType(file.type);
        blobToBase64(file).then((base64) => {
            updateForm({ banner: base64 }, false);
            setDisplayImage(base64);
            setUncroppedImage(base64);
        });
        setFile(file);
        saveImageToIndexedDB(id, file);
        saveImageToIndexedDB("u" + id, file);
    };

    const removeImage = () => {
        setDisplayImage(null);
        setUncroppedImage(null);
        updateForm({ banner: DEF_BANNER }, false);
        setFile(null);
        deleteImageFromIndexedDB(id);
        localStorage.removeItem(id + "-cropper-data");
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleFile(event.target.files[0]);
        }
    };

    const onCrop = (image: string, blob?: Blob) => {
        if (!isNullOrEmpty(image)) {
            updateForm({ banner: image }, false);
            setDisplayImage(image);
            if (blob) saveImageToIndexedDB(id, blob);
        }
    };

    return (
        <>
            <div className={clsx(className, "relative")}>
                <div className="text-sm">{label}</div>

                <div className="relative">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={handleClick}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        className={clsx(
                            "hover:cursor-pointer rounded-lg border-2 border-dashed transition-colors border-blue-500/50 relative flex items-center justify-center mt-2 overflow-hidden",
                            isDragging ? "border-blue-500 bg-blue-950" : "border-blue-500/50 bg-nova-darker",
                            !isNullOrEmpty(errorMessage) ? "border-red-500" : "",
                            aspectRatio
                        )}>
                        <div className="pointer-events-none pb-3">
                            <IconCloudUpload size={65} className="stroke-1 mx-auto" />
                            <div className="font-semibold text-blue-500 text-sm text-center">Selecciona o arrastra una imagen</div>
                            <div className="text-gray-400 text-tiny text-center">Máximo 5MB, tamaño recomendado 2400x800</div>
                            <div className="text-gray-400 text-[10px] text-center">JPEG, JPG Y PNG</div>
                        </div>
                        {displayImage && (
                            <img
                                alt="Banner"
                                src={displayImage}
                                className={clsx(
                                    "pointer-events-none object-cover w-full h-full absolute rounded-lg transition-opacity",
                                    isDragging ? "opacity-55" : ""
                                )}
                            />
                        )}
                    </div>
                    {displayImage && (
                        <div className="absolute top-0 right-0 p-2 flex flex-col gap-1 ">
                            <Button
                                onClick={removeImage}
                                className="bg-red-600 min-w-0 w-7 h-7 p-1 flex items-center justify-center rounded-lg shadow-sm-light-dark">
                                <IconTrashXFilled size={17} />
                            </Button>
                            <Button onClick={onOpen} className="min-w-0 w-7 h-7 p-1 flex items-center justify-center rounded-lg shadow-sm-light-dark">
                                <IconResize size={17} />
                            </Button>
                        </div>
                    )}
                </div>
                <div className="p-1 text-sm text-red-500">{errorMessage}</div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            </div>
            <Modal isOpen={isOpen} size="4xl" closeButton={<></>} isDismissable={false} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="  border-2 bg-dark-grid rounded-large overflow-hidden p-0">
                                <div className=" h-[500px] relative flex justify-center">
                                    {uncroppedImage && (
                                        <CropperComponent id={id} type={fileType} imageSrc={uncroppedImage} onCrop={onCrop} onClose={onClose} />
                                    )}
                                </div>
                                <Button
                                    isIconOnly
                                    aria-label="Close"
                                    className="rounded-full absolute top-3 right-3 z-50"
                                    variant="light"
                                    onClick={onClose}>
                                    <IconX size={20} />
                                </Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
