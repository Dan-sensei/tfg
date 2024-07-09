import { ReviewMessageType } from "@/app/types/interfaces";
import clsx from "clsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import { Avatar } from "@nextui-org/avatar";

type Props = {
    className?: string;
    messageData: ReviewMessageType;
    own: boolean;
    deleteMessage: (id: number) => void;
    loadEditInterface: (id: number, currentValue: string) => void;
    showAvatarAndName: boolean;
};

export default function ReviewMessageBox({ messageData, own, className, deleteMessage, showAvatarAndName, loadEditInterface }: Props) {
    const { message, user, createdAt, edited } = messageData;
    const hours = createdAt.getHours().toString().padStart(2, "0");
    const minutes = createdAt.getMinutes().toString().padStart(2, "0");
    const avatarProp = user?.image ? { src: user.image } : { name: user?.name?.slice(0, 2) ?? "-" };
    return (
        <div className={clsx(className, "w-full flex gap-1", showAvatarAndName && "mt-1")}>
            <div className="w-8">{!own && showAvatarAndName && <Avatar {...avatarProp} size="sm" />}</div>
            <div className={clsx("flex-1 flex ", own && "justify-end")}>
                <div
                    className={clsx(
                        "max-w-full inline-block lg:max-w-[85%] xl:max-w-[70%] h-full whitespace-pre-wrap items-center justify-center text-left text-sm relative  border-1 border-white/10 rounded-xl px-3 pt-2 pb-1",
                        own ? "bg-blue-600" : "bg-white/10"
                    )}>
                    {own && (
                        <Menu>
                            <MenuButton className="font-semibold text-nova-gray hover:text-white focus:outline-none   absolute top-2 right-1">
                                <IconDotsVertical className="size-4 fill-white/60" />
                            </MenuButton>

                            <MenuItems
                                transition
                                anchor="bottom end"
                                className="w-40 origin-top-right rounded-xl border border-white/5 bg-black/70 backdrop-blur-sm p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0">
                                <MenuItem>
                                    <button onClick={() => loadEditInterface(messageData.id, message)} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <IconPencil className="size-4 fill-white/30" />
                                        Editar
                                    </button>
                                </MenuItem>

                                <div className="my-1 h-px bg-white/5" />

                                <MenuItem>
                                    <button
                                        onClick={() => deleteMessage(messageData.id)}
                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <IconTrash className="size-4 fill-white/30" />
                                        Borrar
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    )}
                    <div className="pr-7 min-h-5">
                        {!own && showAvatarAndName && (
                            <div className="text-tiny font-semibold">
                                {user ? user.name : <span className="text-nova-gray">(Usuario borrado)</span>}
                            </div>
                        )}
                        {message}
                    </div>
                    <div className="text-right text-tiny text-nova-gray"><span>{edited && "editado" }</span> {`${hours}:${minutes}`}</div>
                </div>
            </div>
        </div>
    );
}
