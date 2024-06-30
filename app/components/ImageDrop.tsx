import { IconCloudUpload, IconResize, IconTrashXFilled, IconX } from "@tabler/icons-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { blobToBase64, getFileType, isNullOrEmpty, roundTwoDecimals } from "../utils/util";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@nextui-org/modal";
import { deleteImageFromIndexedDB, loadImagesFromIndexedDB, saveImageToIndexedDB } from "../lib/indexedDBHelper";
import CropperComponent, { AutoCrop } from "./Cropper";
import { dimension } from "../types/interfaces";

type Props = {
    className?: string;
    autocrop: boolean;
    label: string;
    id: string;
    onUpdate?: (newImage: string, file: File | null) => void;
    onRemove?: () => void;
    maxSize: number;
    maxDimensions: dimension;
    aspectRatio?: number;
    isDisabled?: boolean;
};

export default function ImageDrop({ className, label, id, onUpdate, onRemove, aspectRatio, maxSize, maxDimensions, isDisabled = false, autocrop }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [displayImage, setDisplayImage] = useState<string | null>(null);
    const [uncroppedImage, setUncroppedImage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [fileType, setFileType] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        let ignore = false;
        const requestImages = async () => {
            const keys = [id, `u${id}`];
            try {
                const [cropped, uncropped] = await loadImagesFromIndexedDB(keys);
                if (ignore) return;
                let original: string | null = null;
                if (cropped) {
                    original = await blobToBase64(cropped);
                    updateImages(original, cropped);
                }

                if (uncropped) {
                    const ubannerBase64 = await blobToBase64(uncropped);
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
        return () => {
            ignore = true;
        };
    }, []);

    const blobToFile = (blob: Blob, name: string) => {
        const filename = name + getFileType(blob.type);
        return new File([blob], filename, { type: blob.type });
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (isDisabled) return;
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };
    const handleDragEnter = () => {
        if (isDisabled) return;
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        if (isDisabled) return;
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleClick = () => {
        if(isDisabled) return;
        fileInputRef.current?.click();
    };

    const handleFile = (file: File) => {
        const fileTypeRegex = /image\/(jpeg|jpg|png)/;
        if (!file.type || !fileTypeRegex.test(file.type)) {
            setErrorMessage(`Sólo se permiten archivos JPEG, JPG y PNG`);
            return;
        }
        if (file.size > maxSize) {
            setErrorMessage(`Tu imagen supera los ${roundTwoDecimals(maxSize / 1024 / 1024)}MB (${roundTwoDecimals(file.size / 1024 / 1024)}MB)`);
            return;
        }
        setErrorMessage("");
        setFileType(file.type);
        onRemove?.();
        blobToBase64(file).then((base64) => {
            if (autocrop && aspectRatio) {
                AutoCrop({
                    imageSrc: base64,
                    onCrop: updateAndSaveToDB,
                    type: file.type,
                    maxDimensions: maxDimensions,
                    aspectRatioCropper: aspectRatio,
                });
            } else {
                updateAndSaveToDB(base64, file);
            }
            setUncroppedImage(base64);
        });
        localStorage.removeItem(id + "-cropper-data");
        saveImageToIndexedDB("u" + id, file);
    };

    const removeImage = () => {
        setDisplayImage(null);
        setUncroppedImage(null);
        onRemove?.();
        deleteImageFromIndexedDB(id);
        deleteImageFromIndexedDB("u" + id);
        localStorage.removeItem(id + "-cropper-data");
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            handleFile(event.target.files[0]);
        }
    };

    const updateImages = (image: string, blob?: Blob) => {
        if (!isNullOrEmpty(image)) {
            const file = blob ? blobToFile(blob, id) : null;
            onUpdate?.(image, file);
            setDisplayImage(image);
        }
    };

    const updateAndSaveToDB = (image: string, blob?: Blob) => {
        updateImages(image, blob);
        if (blob) saveImageToIndexedDB(id, blob);
    };

    return (
        <>
            <div className={clsx(className, "relative", isDisabled ? "opacity-50" : "")}>
                <div className="text-sm">{label}</div>

                <div className="relative">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={handleClick}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        style={{ aspectRatio: aspectRatio ? aspectRatio : "3/2" }}
                        className={clsx(
                            "rounded-lg border-2 border-dashed transition-colors border-blue-500/50 relative flex items-center justify-center mt-2 overflow-hidden",
                            isDragging ? "border-blue-500 bg-blue-950" : "border-blue-500/50 bg-nova-darker",
                            !isNullOrEmpty(errorMessage) ? "border-red-500" : "",
                            isDisabled ? "" : "hover:cursor-pointer"
                        )}>
                        {(isDragging || !displayImage) && (
                            <div className="pointer-events-none pb-3 text-white">
                                <IconCloudUpload size={65} className="stroke-1 mx-auto" />
                                <div className="font-semibold text-blue-500 text-sm text-center">Selecciona o arrastra una imagen</div>
                                <div className="text-gray-400 text-tiny text-center">
                                    Máximo {roundTwoDecimals(maxSize / 1024 / 1024)}MB, tamaño recomendado{" "}
                                    {`${maxDimensions.width}x${maxDimensions.height}`}
                                </div>
                                <div className="text-gray-400 text-[10px] text-center">JPEG, JPG o PNG</div>
                            </div>
                        )}
                        {displayImage && (
                            <img
                                alt="Banner"
                                src={displayImage}
                                className={clsx(
                                    "pointer-events-none w-full h-full absolute transition-opacity",
                                    isDragging ? "opacity-55" : "",
                                    aspectRatio ? "object-fill" : "object-contain"
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
                                        <CropperComponent
                                            id={id}
                                            aspectRatioCropper={aspectRatio ?? null}
                                            maxDimensions={maxDimensions}
                                            type={fileType}
                                            imageSrc={uncroppedImage}
                                            onCrop={updateAndSaveToDB}
                                            onClose={onClose}
                                        />
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
