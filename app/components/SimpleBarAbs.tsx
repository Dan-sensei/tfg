"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

type Props = {
    className?: string;
    children: React.ReactNode;
};

export default function SimpleBarAbs({ className, children }: Props) {
    return (
        <div className={clsx(className, "absolute top-0 bottom-0 left-0 right-0")}>
            <SimpleBar autoHide={false} className={clsx("h-full")}>
                {children}
            </SimpleBar>
        </div>
    );
}
