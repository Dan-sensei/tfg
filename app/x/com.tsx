"use client";

import { useState } from "react";

type Props = {
    id: number;
};

export default function ChildComponent({ id }: Props) {
    const [val, setVal] = useState(id);
    
    return <>id:{val}</>;
}
