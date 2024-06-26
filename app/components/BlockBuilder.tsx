"use client";

import { Button } from "@nextui-org/button";
import { IconAlignJustified, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { TFG_BLockElement } from "../lib/BlockTypes";
import clsx from "clsx";

interface BlockInfo extends TFG_BLockElement {
    id: number;
}

type Props = {
    className?: string;
};

export default function BlockBuilder({ className }: Props) {
    const [blocks, setBlocks] = useState<BlockInfo[]>([]);

    return (
        <div className={clsx(className)}>
            {blocks.map((block) => {
                return <div>{block.type}</div>;
            })}

            <div className="h-52 border-2 rounded-lg bg-nova-darker border-blue-500 border-dashed w-full">
                <IconAlignJustified size={20} />

            </div>
        </div>
    );
}
