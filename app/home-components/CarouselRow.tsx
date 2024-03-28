"use client";
import useEmblaCarousel from "embla-carousel-react";
import Card from "./Card";
import { iTFG } from "../types/interfaces";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";

import { useCallback, useEffect, useRef, useState } from "react";
import { emblaNoDragLogic } from "../utils/util";

interface CarouselRowProps {
    tfgArray: iTFG[];
}

const breakpoints = [
    { width: 1536, slidesToScroll: 6 },
    { width: 1280, slidesToScroll: 5 },
    { width: 768, slidesToScroll: 4 },
    { width: 640, slidesToScroll: 3 },
    { width: 0, slidesToScroll: 2 },
];
const getActiveSlidesToScroll = () => {
    const width = window.innerWidth;
    const activeBreakpoint = breakpoints.find(
        (breakpoint) => width >= breakpoint.width
    );
    return activeBreakpoint ? activeBreakpoint.slidesToScroll : 2;
};

const getCardOrigin = (
    index: number,
    currentIndex: number,
    slidesToScroll: number,
    totalSlides: number
) => {
    if (index === 0) return "origin-left";
    const isFirstOfLastSet = currentIndex == Math.floor(totalSlides/slidesToScroll) && index === totalSlides - slidesToScroll;
    const isFirstOfCurrentSet = index === currentIndex * slidesToScroll && (currentIndex+1) * slidesToScroll < totalSlides;
    const isLastOfCurrentSet =
        index === currentIndex * slidesToScroll + slidesToScroll - 1;
    const isLastSlide = index === totalSlides - 1;
    const isLessThanTotal = index < slidesToScroll - 1;

    if (isFirstOfCurrentSet || isFirstOfLastSet) return "origin-left";
    if (!isLessThanTotal && (isLastOfCurrentSet || isLastSlide))
        return "origin-right";
    
    return "";
};

const getCardOpacity = (index: number,
    currentIndex: number,
    slidesToScroll: number,
    totalSlides: number) => {
        if (
            index >= currentIndex * slidesToScroll + slidesToScroll ||
            (index < currentIndex * slidesToScroll &&
                index < totalSlides - slidesToScroll)
        )
            return "opacity-40 " + index;
    return ""
}

const getCardClassname = (index: number,
    currentIndex: number,
    slidesToScroll: number,
    totalSlides: number) => {

    return getCardOrigin(index, currentIndex, slidesToScroll, totalSlides) + " " + getCardOpacity(index, currentIndex, slidesToScroll, totalSlides);

}

export default function CarouselRow({ tfgArray }: CarouselRowProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        slidesToScroll: 2,
        breakpoints: {
            "(min-width: 640px)": { slidesToScroll: 3 },
            "(min-width: 768px)": { slidesToScroll: 4 },
            "(min-width: 1280px)": { slidesToScroll: 5 },
            "(min-width: 1536px)": { slidesToScroll: 6 },
        },
        watchDrag: emblaNoDragLogic,
    });
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [slidesToScroll, setSlidesToScroll] = useState(-1);
    const totalSlides = useRef(0);

    useEffect(() => {
        if (emblaApi) {
            totalSlides.current = emblaApi.slideNodes().length;
            setCurrentIndex(0);
            setSlidesToScroll(getActiveSlidesToScroll());
            const onSelect = () => {
                setCurrentIndex(emblaApi.selectedScrollSnap());
            };
            const onResize = () => {
                setCurrentIndex(emblaApi.selectedScrollSnap());
                setSlidesToScroll(getActiveSlidesToScroll());
            };

            window.addEventListener("resize", onResize);

            emblaApi.on("select", onSelect);
            return () => {
                emblaApi.off("select", onSelect);
                window.removeEventListener("resize", onResize);
            };
        }
        return () => {};
    }, [emblaApi]);

    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext();
    }, [emblaApi]);

    const showPrev = currentIndex > 0;
    const showNext =
        currentIndex >= 0 &&
        currentIndex * slidesToScroll + slidesToScroll <
            totalSlides.current;
    return (
        <>
        
        <div className="embla hover:z-10">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {tfgArray.map((tfg, index) => (
                        <div
                            key={index}
                            className="embla__slide flex-2c sm:flex-3c md:flex-4c xl:flex-5c 2xl:flex-6c px-1"
                        >
                            <Card
                                className={`${getCardClassname(
                                    index,
                                    currentIndex,
                                    slidesToScroll,
                                    totalSlides.current
                                )}`}
                                key={index}
                                id={tfg.id}
                                createdAt={tfg.createdAt}
                                thumbnail={tfg.thumbnail}
                                title={tfg.title}
                                description={tfg.description}
                                pages={tfg.pages}
                                views={tfg.views}
                                score={tfg.score}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute left-0 w-6 lg:w-14 -ml-4 lg:-ml-14 h-full scale-y-125 flex items-center justify-center">
                <button
                    className={
                        (showPrev ? "visible" : "hidden") + " embla__prev"
                    }
                    onClick={scrollPrev}
                >
                    <IconChevronLeft
                        size={30}
                        className="transition-all duration-300 hover:scale-125"
                    />
                </button>
            </div>
            <div className="absolute right-0 w-6 lg:w-14  -mr-4 lg:-mr-14 h-full scale-y-125 flex items-center justify-center">
                <button
                    className={
                        (showNext ? "visible" : "hidden") + " embla__next"
                    }
                    onClick={scrollNext}
                >
                    <IconChevronRight
                        size={30}
                        className="transition-all duration-300 hover:scale-125"
                    />
                </button>
            </div>
        </div>
        </>
    );
}

/*
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-5 gap-5">
            {
            tfgs.map((tfg) => (
                <Card key={tfg.id} id={tfg.id} thumbnail={tfg.thumbnail} title={tfg.title} description={tfg.description} pages={tfg.pages} createdAt={tfg.createdAt.toString()} />
            ))
            }
        </div>

        */
