"use client";
import { IconArrowsDiagonal } from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";

type Props = {
    src: string;
    alt: string;
    imagePosition: string;
    maxHeight: number;
};
export default function ImageViewer({ src, alt, imagePosition, maxHeight }: Props) {
    const img = useRef<HTMLImageElement | null>(null);
    const viewer = useRef<Viewer | null>(null);
    useEffect(() => {
        if (img.current) {
            viewer.current = new Viewer(img.current, {
                navbar: false,
                toolbar: {
                    zoomIn: 1,
                    zoomOut: 1,
                    oneToOne: 1,
                    reset: 1,
                    play: 0,
                    prev: 0,
                    next: 0,
                    rotateLeft: 1,
                    rotateRight: 1,
                    flipHorizontal: 1,
                    flipVertical: 1,
                },
            });
        }
        return () => {
            if (viewer.current) viewer.current.destroy();
        };
    }, []);
    return (
        <div className="flex">
            <div className={clsx("transition-transform relative hover:scale-[102%] ", imagePosition)}>
                <div className="absolute top-0 right-0 pointer-events-none bg-black/50 rounded-bl-full pl-4 pb-4 pt-1 pr-1">
                    <IconArrowsDiagonal size={24} />
                </div>
                <img
                    ref={img}
                    style={{ maxHeight: `${maxHeight}px` }}
                    className={` hover:cursor-pointer rounded-lg shadow-light-dark`}
                    alt={alt}
                    src={src}
                />
            </div>
        </div>
    );
}
