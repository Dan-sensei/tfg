export const HeadlessBasic = [
    "block w-full border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
];

export const HeadlessInvalid =
    "data-[invalid]:outline-2 data-[invalid]:outline data-[invalid]:-outline-offset-2 data-[invalid]:outline-nova-error/75";

export const HeadlessComplete = [...HeadlessBasic, HeadlessInvalid];

export const BasicButton = "inline-flex items-center transition-colors gap-2 py-1.5 px-5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[focus]:outline-none";
export const PrimaryButton = "bg-white/15 data-[hover]:bg-white/25";
export const InfoButton = "bg-blue-500 data-[hover]:bg-blue-400";
export const SuccessButton = "bg-emerald-500/50 data-[hover]:bg-emerald-500/70";
export const DangerButton = "bg-nova-red data-[hover]:bg-nova-light-red";