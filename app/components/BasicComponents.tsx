import clsx from "clsx";

export const Required = () => {
    return <span className="text-red-500 inline-block pl-[2px]">*</span>;
};

interface CharacterCounterProps {
    currentLength: number;
    max: number;
    compact?: boolean;
    className?: string;
}
export const CharacterCounter = ({ className, currentLength, max, compact = false }: CharacterCounterProps) => {
    return (
        <span className={clsx(className, "ml-auto text-tiny text-default-500", currentLength > max ? "text-nova-error" : "")}>
            ({currentLength}/{max}{!compact && <> carácteres</>})
        </span>
    );
};
