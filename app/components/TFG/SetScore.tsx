"use client";

import { castScore } from "@/app/lib/actions/tfg";
import { Spinner } from "@nextui-org/spinner";
import { IconStarHalfFilled, IconStar, IconStarFilled } from "@tabler/icons-react";
import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    myScore: number;
    tfgId: number;
};

export default function SetScore({ myScore, tfgId }: Props) {
    const [rating, setRating] = useState(myScore);
    const [hover, setHover] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleMouseEnter = (value: number) => {
        setHover(value);
    };

    const handleMouseLeave = () => {
        setHover(0);
    };
    const handleClick = async (value: number) => {
        setIsUpdating(true);
        try {
            const result = await castScore(tfgId, value);
            if (result.success) {
                toast.success(result.response);
                setRating(value);
            } else {
                toast.error(result.response);
            }
        } catch (e: any) {
            toast.error("Se ha producido un error al votar");
        }
        setIsUpdating(false);
    };
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 10; i++) {
            if (i <= (hover || rating)) {
                stars.push(
                    <div
                        className="p-2 cursor-pointer"
                        key={i}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(i)}>
                        <IconStarFilled className=" text-yellow-500" />
                    </div>
                );
            } else {
                stars.push(
                    <div
                        className="p-2 cursor-pointer"
                        key={i}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(i)}>
                        <IconStar className=" text-yellow-500" />
                    </div>
                );
            }
        }
        return stars;
    };

    return (
        <div className="text-center justify-center flex flex-col items-center">
            <h2 className="text-gray-2200">¿Qué te ha parecido?</h2>
            <div className={clsx("flex", !rating && "opacity-50")}>{renderStars()}</div>
            <div className="h-5 pt-3">{isUpdating && <Spinner size="sm" color="white" />}</div>
        </div>
    );
}
