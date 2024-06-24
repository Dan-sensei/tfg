"use client";
import { Button } from "@nextui-org/button";
import { IconX } from "@tabler/icons-react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useEffect, useRef } from "react";
interface CropperComponentProps {
    imageSrc: string;
    onCrop: (image: string, blob?: Blob) => void;
    onClose: () => void;
    type: string;
}

export default function CropperComponent({ imageSrc, onCrop, onClose, type }: CropperComponentProps) {
    const imageElement = useRef<HTMLImageElement>(null);
    const container = useRef<HTMLImageElement>(null);
    const cropper = useRef<Cropper>();

    useEffect(() => {
        const getContainerData = () => [container.current?.offsetWidth, container.current?.offsetHeight];

        const recalculateCanvasSize = () => {
            const [w, h] = getContainerData();
            if (w && h) {
                const newWidth = w * 0.9;
                const newHeight = newWidth / 3;
                const left = (w - newWidth) / 2;
                const top = (h - newHeight) / 2;
                cropper.current?.setCropBoxData({ left: left, height: newHeight, top: top, width: newWidth });
            }
        };

        if (imageElement.current) {
            cropper.current = new Cropper(imageElement.current, {
                dragMode: "move",
                background: false,
                aspectRatio: 3 / 1,
                autoCropArea: 0.8,
                viewMode: 1,
                rotatable: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
            });
            imageElement.current.addEventListener("ready", function () {
                const [containerWidth, containerHeight] = getContainerData();
                const canvasData = cropper.current?.getCanvasData();
                if (containerWidth && containerHeight && canvasData) {
                    const { naturalWidth, naturalHeight } = canvasData;
                    let newWidth: number, newHeight: number, top: number, left: number;

                    if (containerWidth / containerHeight > naturalWidth / naturalHeight) {
                        newHeight = (containerWidth * naturalHeight) / naturalWidth;
                        newWidth = containerWidth;
                        top = (containerHeight - newHeight) / 2;
                        left = 0;
                    } else {
                        newWidth = (containerHeight * naturalWidth) / naturalHeight;
                        newHeight = containerHeight;
                        top = 0;
                        left = (containerWidth - newWidth) / 2;
                    }

                    cropper.current?.setCanvasData({ width: newWidth, height: newHeight, top, left });

                    recalculateCanvasSize();
                }
            });
        }

        window.addEventListener("resize", recalculateCanvasSize);

        return () => {
            cropper.current?.destroy();
            window.removeEventListener("resize", recalculateCanvasSize);
        };
    }, [imageSrc]);

    const handleCrop = () => {
        if (cropper.current) {
            const croppedCanvas = cropper.current.getCroppedCanvas({ maxWidth: 2400 });
            croppedCanvas.toBlob((blob) => {
                if (blob) {
                    onCrop(croppedCanvas.toDataURL(), blob);
                } else {
                    onCrop(croppedCanvas.toDataURL());
                }
            }, type);
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
                    onClose();
                    handleCrop();
                }}>
                Recortar
            </Button>
        </>
    );
}
