"use client";
import { useState, useRef, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";

export default function Test() {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleClose = (event: MouseEvent) => {
        console.log("wah")
        if (
            selectRef.current &&
            !selectRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        document.addEventListener("mousedown", handleClose);
        return () => {
            document.removeEventListener("mousedown", handleClose);
        };
    }, []);

    return (
        <div>
            <div ref={selectRef} onBlur={() => console.log("blur")}>
                <Select
                    isOpen={isOpen}
                    
                    onClick={handleToggle}
                    aria-label="Categorias"
                    className="max-w-xs"
                    selectionMode="multiple"
                    placeholder="Seleccionar"
                    variant="bordered"
                >
                    <SelectItem key={0} value={0}>
                        wah
                    </SelectItem>
                </Select>
            </div>
        </div>
    );
}
