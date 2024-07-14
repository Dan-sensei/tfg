import { CharacterCounter } from "@/app/components/BasicComponents";
import { HeadlessComplete } from "@/app/lib/headlessUIStyle";
import { MAX_SOCIAL_LINK_LENGTH } from "@/app/types/defaultData";
import { Checkbox, Field, Input, Label } from "@headlessui/react";
import { IconCheck } from "@tabler/icons-react";
import clsx from "clsx";

type Props = {
    value: string | null;
    setSocials: (value: string | null) => void;
    placeholder: string;
    name: string;
    icon: JSX.Element;
};

export default function SocialInput({ value, setSocials, placeholder, name, icon }: Props) {
    return (
        <Field className={clsx("border-1 border-white/5 rounded-lg px-3 py-4 bg-black/15 flex items-center gap-2")}>
            <Checkbox
                checked={value !== null}
                className={
                    "group hover:cursor-pointer block size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
                }
                onChange={(e) => {
                    setSocials(e ? "" : null);
                }}>
                <IconCheck className="hidden size-4 text-black group-data-[checked]:block" />
            </Checkbox>
            <div className={clsx("flex-1", value === null && "opacity-50 pointer-events-none")}>
                <Label className={"text-tiny pl-1 opacity-80 flex justify-between mb-1"}>
                    {name}
                    {value !== null && <CharacterCounter currentLength={value.length} max={MAX_SOCIAL_LINK_LENGTH} />}
                </Label>
                <div className={"flex items-center gap-2 flex-1 bg-black/15 pl-2 rounded-lg border-1 border-white/5"}>
                    {icon}
                    <Input
                        invalid={value !== null && value === ""}
                        disabled={value === null}
                        value={value ?? ""}
                        onChange={(e) => {
                            setSocials(e.target.value);
                        }}
                        placeholder={placeholder}
                        className={clsx(HeadlessComplete, "rounded-lg flex-1")}
                    />
                </div>
            </div>
        </Field>
    );
}
