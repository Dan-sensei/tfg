'use client';
import useEmblaCarousel from 'embla-carousel-react'
import { iHomeTFG } from "@/app/types/interfaces";
import { Button } from "@nextui-org/button";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";
import { useCallback, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay'
import { sanitizeString } from '../utils/util';
import Link from 'next/link';

interface CarouselProps {
    topTfgs: iHomeTFG[];
}

export default function HomeCarousel({topTfgs}: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true}, [Autoplay({delay: 8000})]);

    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev()
    }, [emblaApi])
    
    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext()
    }, [emblaApi])
    
    return (
        <div className="embla -mx-4 md:-mx-14 -mt-[64px]">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                {
                    topTfgs.map((item: any) => (
                        <div key={item.id} className="min-h-[300px] aspect-video xl:aspect-wide flex-1c w-full flex justify-start items-end relative lg:mt-[-100px]">
                            <img src={item?.banner} alt="" className="w-full h-full object-cover pointer-events-none select-none brightness-75" />
                            <div className="h-[70px] w-full absolute left-0 z-10 bottom-0 bg-gradient-to-t from-dark pointer-events-none"></div>
                            <div className="absolute w-full lg:w-[70%] mx-auto px-16 py-10 sm:py-16 md:mb-5 drop-shadow-lg">
                                <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold line-clamp-3">
                                    {item?.title}
                                </h1>
                                <span className="text-white text-base md:text-lg mt-2 md:mt-4 line-clamp-2 md:line-clamp-2">
                                    {item?.description}
                                </span>
                                <div className="flex mt-3">
                                    <Button draggable="false" href={`/page/${item.id}/${sanitizeString(item.title)}`} as={Link} color="secondary">Ver</Button>
                                </div>
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>
            
            <div className='absolute left-0 w-12 min-h-[500px] h-[40vh] lg:h-[50vh] flex items-center justify-center mt-[-100px]'>
                <button className="embla__prev" onClick={scrollPrev}>
                    <IconChevronLeft size={30}  className='transition-all duration-300 hover:scale-150' />
                </button>  
            </div>
            <div className='absolute right-0 w-12 min-h-[500px] h-[40vh] lg:h-[50vh] flex items-center justify-center mt-[-100px]'>
                <button className="embla__next" onClick={scrollNext}>
                    <IconChevronRight size={30} className='transition-all duration-300 hover:scale-150' />
                </button>
            </div>
        </div>
        
    );
}