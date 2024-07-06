"use client";
import { Button } from "@nextui-org/button";
import ChildComponent from "./com";
import { useState } from "react";

export default function X() {
    const [parentValue, setParentValue] = useState(3)
    const update = () => {
        setParentValue(Math.random())
    }

    return (
        <div className="">
            <div className="w-full">
                <ChildComponent id={parentValue} />
            </div>
            <Button>aaa</Button>
        </div>
    );
}
