'use client';
import useEmblaCarousel from 'embla-carousel-react'
import Card from "./Card";
import { iTFG } from "../types/interfaces";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";


import { useCallback, useEffect, useRef, useState } from "react";

interface CarouselRowProps {
    tfgArray: iTFG[];
}

const breakpoints = [
    { width: 1536, slidesToScroll: 6 },
    { width: 1280, slidesToScroll: 5 },
    { width: 768, slidesToScroll: 4 },
    { width: 640, slidesToScroll: 3 },
    { width: 0, slidesToScroll: 2 }
];
const getActiveSlidesToScroll = () => {
    const width = window.innerWidth;
    const activeBreakpoint = breakpoints.find(breakpoint => width >= breakpoint.width);
    return activeBreakpoint ? activeBreakpoint.slidesToScroll : 2;
};

const getCardClassName = (index: number, currentIndex: number, slidesToScroll: number, totalSlides: number) => {
    if(index === 0) return 'origin-left';

    const isBeyondTotalSlides = (currentIndex + 1) * slidesToScroll > totalSlides;
    const isFirstOfLastSet = index === totalSlides - slidesToScroll;
    const isFirstOfCurrentSet = index === currentIndex * slidesToScroll;
    const isLastOfCurrentSet = index === currentIndex * slidesToScroll + slidesToScroll - 1;
    const isLastSlide = index === totalSlides - 1;
    const isLessThanTotal = index < slidesToScroll - 1;

    if (isBeyondTotalSlides && isFirstOfLastSet) return 'origin-left';
    if (!isBeyondTotalSlides && isFirstOfCurrentSet) return 'origin-left';
    if (!isLessThanTotal && (isLastOfCurrentSet || isLastSlide)) return 'origin-right';

    return '';
};

export default function CarouselRow({tfgArray}: CarouselRowProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: false, 
        slidesToScroll: 2,
        breakpoints: {
            '(min-width: 640px)': { slidesToScroll: 3 },
            '(min-width: 768px)': { slidesToScroll: 4 },
            '(min-width: 1280px)': { slidesToScroll: 5 },
            '(min-width: 1536px)': { slidesToScroll: 6 }
        }
    })
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
        
            window.addEventListener('resize', onResize);
        
            emblaApi.on('select', onSelect);
            return () =>{
                emblaApi.off('select', onSelect);
                window.removeEventListener('resize', onResize);
            } 
        }
        return () => {};
    }, [emblaApi]);
    
    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev()
    }, [emblaApi])
    
    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext()
    }, [emblaApi])

    const showPrev = currentIndex > 0;
    const showNext = currentIndex >= 0 && currentIndex*slidesToScroll + slidesToScroll < totalSlides.current - 1;
    return (
        <div className="embla hover:z-10 mt-5">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container mx-14">
                {
                    tfgArray.map((tfg, index) => (
                        <div key={index} className="embla__slide flex-2c sm:flex-3c md:flex-4c xl:flex-5c 2xl:flex-6c px-2">
                            <Card
                                className={getCardClassName(index, currentIndex, slidesToScroll, totalSlides.current)}
                                key={tfg.id} 
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
                    ))
                }
                </div>
            </div>
            
            <div className='bg-gradient-to-r from-dark absolute left-0 w-14 h-full flex items-center justify-center'>
                <button className={(showPrev ? 'visible' : 'hidden') + " embla__prev"} onClick={scrollPrev}>
                    <IconChevronLeft size={30}  className='transition-all duration-300 hover:scale-150' />
                </button>  
            </div>
            <div className='bg-gradient-to-l from-dark absolute right-0 w-14 h-full flex items-center justify-center'>
                <button className={(showNext ? 'visible' : 'hidden') + " embla__next"} onClick={scrollNext}>
                    <IconChevronRight size={30} className='transition-all duration-300 hover:scale-150' />
                </button>
            </div>
        </div>
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