"use client";
import useEmblaCarousel from "embla-carousel-react";
import { iHomeTFG } from "@/app/types/interfaces";
import { Button } from "@nextui-org/button";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { sanitizeString } from "../../utils/util";
import Link from "next/link";
import { emblaNoDragLogic } from "../../utils/util";

interface CarouselProps {
    topTfgs: iHomeTFG[];
    className?: string;
}

export default function HomeCarousel({ topTfgs, className }: CarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            watchDrag: emblaNoDragLogic,
        },
        [Autoplay({ delay: 8000 })]
    );

    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        setSelectedIndex(emblaApi?.selectedScrollSnap() || 0);
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index);
        },
        [emblaApi]
    );
    useEffect(() => {
        onSelect();
        emblaApi?.on("reInit", onSelect);
        emblaApi?.on("select", onSelect);
        return () => {
            emblaApi?.off("reInit", onSelect);
            emblaApi?.off("select", onSelect);
        };
    }, [emblaApi]);

    return (
        <>
            <div className={`${className} embla relative`}>
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {topTfgs.map((item: any) => (
                            <div
                                key={item.id}
                                className="min-h-[300px] aspect-video md:aspect-21-9 2xl:aspect-wide lg:px-12 flex-1c max-h-[800px] w-full">
                                <div className="w-full h-full flex justify-start items-end relative lg:rounded-2xl shadow-light-dark">
                                    <img
                                        src={item?.banner}
                                        alt=""
                                        className="w-full lg:rounded-2xl  h-full object-cover pointer-events-none select-none"
                                    />
                                    <div className="h-full lg:rounded-[15px] w-[55%] absolute left-0 z-0 bottom-0 bg-gradient-to-r from-nova-darker/90 pointer-events-none"></div>

                                    <div className="absolute w-full lg:w-[70%] mx-auto px-16 pb-10 sm:pb-16 lg:py-6 xl:pb-16 md:mb-5 z-10">
                                        <h1 className="embla_nodrag text-white text-xl md:text-2xl lg:text-3xl font-bold line-clamp-3 text-shadow-dark">
                                            {item?.title}
                                        </h1>
                                        <span className="embla_nodrag text-white text-base md:text-lg mt-1 line-clamp-2 md:line-clamp-2 text-shadow-dark">
                                            {item?.description}
                                        </span>
                                        <div className="flex mt-3">
                                            <Button
                                                draggable="false"
                                                href={`/page/${item.id}/${sanitizeString(item.title)}`}
                                                as={Link}
                                                className="bg-nova-button embla_nodrag">
                                                Ver
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center px-1">
                    <button className="embla__prev rounded-lg group h-full w-full" onClick={scrollPrev}>
                        <IconChevronLeft size={30} className="transition-all duration-300 group-hover:scale-125 mx-auto" />
                    </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center pl-1">
                    <button className="embla__next rounded-lg group h-full w-full" onClick={scrollNext}>
                        <IconChevronRight size={30} className="transition-all duration-300 group-hover:scale-125 mx-auto" />
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-center gap-1 pt-3">
                {topTfgs.map((_, index) => (
                    <button
                        key={index}
                        title={`Slide ${index + 1}`}
                        className={`rounded-full group w-[18px] h-[18px] p-[4px]`}
                        onClick={() => scrollTo(index)}>
                        <div
                            className={`h-full rounded-full transition-all group-hover:scale-125 ${
                                selectedIndex == index ? "bg-slate-50" : "bg-slate-500 group-hover:bg-slate-200"
                            } `}></div>
                    </button>
                ))}
            </div>
        </>
    );
}
