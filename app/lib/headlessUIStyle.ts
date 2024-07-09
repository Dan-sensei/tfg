export const HeadlessBasic = [
    "block w-full border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
];

export const HeadlessInvalid =
    "data-[invalid]:outline-2 data-[invalid]:outline data-[invalid]:-outline-offset-2 data-[invalid]:outline-nova-error/75";

export const HeadlessComplete = [...HeadlessBasic, HeadlessInvalid];
