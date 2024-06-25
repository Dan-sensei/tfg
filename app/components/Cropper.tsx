"use client";
import { Button } from "@nextui-org/button";
import { IconX } from "@tabler/icons-react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useEffect, useRef, useState } from "react";
import { dimension } from "../types/interfaces";

interface AutoCrop {
    imageSrc: string;
    onCrop: (image: string, blob?: Blob) => void;
    type: string;
    maxDimensions: dimension;
    aspectRatioCropper: number;
}
interface CropperComponentProps {
    imageSrc: string;
    onCrop: (image: string, blob?: Blob) => void;
    onClose: () => void;
    type: string;
    maxDimensions: dimension;
    aspectRatioCropper: number;
    id: string;
}
const getCropperDataFromLocalStorage = (id: string): { canvasData: Cropper.CanvasData; cropboxData: Cropper.CropBoxData } | null => {
    const data = localStorage.getItem(id + "-cropper-data");
    if (!data) {
        return null;
    }

    try {
        const parsedData = JSON.parse(data);
        return {
            canvasData: parsedData.canvasData as Cropper.CanvasData,
            cropboxData: parsedData.cropboxData as Cropper.CropBoxData,
        };
    } catch (e) {
        console.error("Failed to parse cropper data from local storage:", e);
        return null;
    }
};

const calculateCropboxSize = (
    maxDimensions: dimension,
    cropboxSize: dimension,
    aspectRatioCropper: number,
    containerWidth: number,
    containerHeight: number
): Cropper.CropBoxData => {
    let height: number, width: number;
    if (maxDimensions.width > maxDimensions.height) {
        width = cropboxSize.width;
        height = width / aspectRatioCropper;
    } else {
        height = cropboxSize.height;
        width = height * aspectRatioCropper;
    }
    const left = (containerWidth - width) / 2;
    const top = (containerHeight - height) / 2;

    return { width, height, left, top };
};

export function AutoCrop({ imageSrc, onCrop, type, maxDimensions, aspectRatioCropper }: AutoCrop) {
    // Default viewport size
    const [w, h] = [892, 500];
    const imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    imageElement.classList.add("w-full");
    const container = document.createElement("div");
    container.style.width = "892px";
    container.style.height = "500px";
    container.style.position = "fixed";
    container.classList.add("cropper-container", "relative", "w-full", "h-full", "top-0", "-z-50", "invisible", "pointer-events-none");
    container.appendChild(imageElement);
    document.body.append(container);
    const cropboxSize: dimension = {
        width: maxDimensions.width > w ? w : maxDimensions.width,
        height: maxDimensions.height > h ? h : maxDimensions.height,
    };
    const cropper = initializeCropper(imageElement, aspectRatioCropper, maxDimensions, cropboxSize, w, h, null, () => {
        crop(cropper, maxDimensions, onCrop, type);
        cropper.destroy();
        document.body.removeChild(container);
    });
}

const initializeCropper = (
    imageElement: HTMLImageElement,
    aspectRatioCropper: number,
    maxDimensions: dimension,
    cropboxSize: dimension,
    containerWidth: number,
    containerHeight: number,
    cropperData: {
        canvasData: Cropper.CanvasData;
        cropboxData: Cropper.CropBoxData;
    } | null,
    onReady?: () => void
) => {
    const cropper = new Cropper(imageElement, {
        dragMode: "move",
        background: false,
        viewMode: 1,
        rotatable: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        ready: () => {
            if (cropperData) {
                cropper.setCropBoxData(cropperData.cropboxData);
                cropper.setCanvasData(cropperData.canvasData);
            } else {
                cropper.setCropBoxData(calculateCropboxSize(maxDimensions, cropboxSize, aspectRatioCropper, containerWidth, containerHeight));
                const canvasData = cropper.getCanvasData();
                if (canvasData) {
                    const { naturalWidth, naturalHeight } = canvasData;
                    const cropBox = calculateCropboxSize(maxDimensions, cropboxSize, aspectRatioCropper, containerWidth, containerHeight);
                    let newWidth: number, newHeight: number, top: number, left: number;
                    if (cropBox.width / cropBox.height > naturalWidth / naturalHeight) {
                        console.log("width", cropBox.width);
                        newHeight = (cropBox.width * naturalHeight) / naturalWidth;
                        newWidth = cropBox.width;
                    } else {
                        console.log("height", cropBox.height);
                        newWidth = (cropBox.height * naturalWidth) / naturalHeight;
                        newHeight = cropBox.height;
                    }

                    top = (containerHeight - newHeight) / 2;
                    left = (containerWidth - newWidth) / 2;
                    cropper.setCanvasData({ width: newWidth, height: newHeight, left, top });
                }
            }
            onReady?.();
        },
    });

    return cropper;
};

const crop = (cropper: Cropper, maxDimensions: dimension, onCrop: (image: string, blob?: Blob) => void, type: string, callback?: () => void) => {
    const output = cropper.getData(true);
    const croppedCanvas = cropper.getCroppedCanvas({
        width: output.width > maxDimensions.width ? maxDimensions.width : output.width,
        height: output.height > maxDimensions.height ? maxDimensions.height : output.height,
        maxWidth: 4096,
        maxHeight: 4096,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
    });
    croppedCanvas.toBlob(
        (blob) => {
            if (blob) {
                onCrop(croppedCanvas.toDataURL(), blob);
            } else {
                onCrop(croppedCanvas.toDataURL());
            }
        },
        type,
        1
    );
    callback?.();
};

export default function CropperComponent({ imageSrc, onCrop, onClose, type, maxDimensions, aspectRatioCropper, id }: CropperComponentProps) {
    const imageElement = useRef<HTMLImageElement>(null);
    const container = useRef<HTMLImageElement>(null);
    const cropper = useRef<Cropper>();

    useEffect(() => {
        if (!container.current || !imageElement.current) return;

        const [w, h] = [container.current.offsetWidth, container.current.offsetHeight];

        const cropboxSize: dimension = {
            width: maxDimensions.width > w ? w * 0.9 : maxDimensions.width,
            height: maxDimensions.height > h ? h * 0.9 : maxDimensions.height,
        };

        const recalculateCropboxSize = () => {
            cropper.current?.setCropBoxData(calculateCropboxSize(maxDimensions, cropboxSize, aspectRatioCropper, w, h));
        };

        const savedCropperData = getCropperDataFromLocalStorage(id);
        cropper.current = initializeCropper(imageElement.current, aspectRatioCropper, maxDimensions, cropboxSize, w, h, savedCropperData);
        window.addEventListener("resize", recalculateCropboxSize);
        return () => {
            cropper.current?.destroy();
            window.removeEventListener("resize", recalculateCropboxSize);
        };
    }, [imageSrc]);

    const handleCrop = () => {
        if (cropper.current) {
            crop(cropper.current, maxDimensions, onCrop, type, () => {
                const canvasData = cropper.current?.getCanvasData();
                const cropboxData = cropper.current?.getCropBoxData();
                if (canvasData && cropboxData) {
                    localStorage.setItem(id + "-cropper-data", JSON.stringify({ canvasData: canvasData, cropboxData: cropboxData }));
                }
            });
        }
    };

    return (
        <>
            <div ref={container} className="cropper-container relative flex justify-center aspect-wide w-full h-full">
                <img ref={imageElement} src={imageSrc} alt="Source" className="w-full" />
            </div>
            <Button
                className="absolute bottom-5 z-10 mx-auto"
                onClick={() => {
                    handleCrop();
                    onClose();
                }}>
                Recortar
            </Button>
        </>
    );
}
