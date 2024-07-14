"use client";

import {useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import TextareaAutosize from "react-textarea-autosize";
import { IconCheck, IconSend2, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { produce } from "immer";
import { Button } from "@headlessui/react";
import { Spinner } from "@nextui-org/spinner";
import "simplebar-react/dist/simplebar.min.css";
import { useDebouncedCallback } from "use-debounce";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { ReviewMessageType } from "@/app/types/interfaces";
import { CHATBOX_REFRESH_INTERVAL } from "@/app/types/defaultData";
import { isNullOrEmpty, toFirstLetterUppercase } from "@/app/utils/util";
import ReviewMessageBox from "./ReviewMessageBox";
import { HeadlessBasic } from "@/app/lib/headlessUIStyle";

type EditMessage = {
    id: number;
    currentValue: string;
    newValue: string;
};
type Props = {
    userId: number;
    tfgId: number;
    defReviewMessages: ReviewMessageType[];
};

type MessagesByDay = {
    date: string;
    messages: ReviewMessageType[];
}

const getIdsFromMessages = (messages: ReviewMessageType[]): number[] => {
    return messages.map((message) => message.id).sort((a, b) => a - b);
};

const areMessageIdArraysEqual = (arr1: ReviewMessageType[], arr2: ReviewMessageType[]): boolean => {
    const ids1 = getIdsFromMessages(arr1);
    const ids2 = getIdsFromMessages(arr2);

    if (ids1.length !== ids2.length) {
        return false;
    }
    console.log("checking if arrays are equal");
    console.log(ids1, ids2)
    for (let i = 0; i < ids1.length; i++) {
        if (ids1[i] !== ids2[i]) {
            console.log("not equal")
            return false;
        }
    }

    console.log("equal")
    return true;
};

export default function Chatbox({ userId, tfgId, defReviewMessages }: Props) {
    const [message, setMessage] = useState<string>("");
    const [reviewMessages, setReviewMessages] = useState<ReviewMessageType[]>(defReviewMessages);
    const [isSending, setIsSending] = useState(false);
    const [showEdit, setShowEdit] = useState<EditMessage | null>(null);
    const simplebar = useRef<any>(null);
    const abortController = useRef<AbortController | null>(null);

    useEffect(() => {
        const checkNewMessages = () => {
            fetch(`/api/dashboard/review-message?tfgId=${tfgId}`, {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.success) {
                        const newMessages: ReviewMessageType[] = json.response;
                        if (!areMessageIdArraysEqual(reviewMessages, newMessages)) {
                            setReviewMessages(newMessages.map((message) => ({ ...message, createdAt: new Date(message.createdAt) })));
                        }
                    } else {
                        console.error(json.response);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        };

        const intervalId = setInterval(checkNewMessages, CHATBOX_REFRESH_INTERVAL);
        return () => {
            clearInterval(intervalId);
        };
    }, [tfgId, reviewMessages]);

    useEffect(() => {
        let skip = false;
        abortController.current = new AbortController();
        checkUnreadMessages();

        return () => {
            skip = true;
            abortController.current?.abort();
        };
    }, [tfgId]);

    const sendMessage = () => {
        if (isNullOrEmpty(message) || isSending) return;
        setIsSending(true);
        fetch(`/api/dashboard/review-message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tfgId: tfgId,
                message,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.success) {
                    setReviewMessages(
                        produce((draft) => {
                            draft.push({ ...json.response, createdAt: new Date(json.response.createdAt) });
                        })
                    );
                    setMessage("");
                } else {
                    console.error(json.response);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsSending(false));
    };

    const checkUnreadMessages = useDebouncedCallback(() => {
        console.log("checking unread messages");
        const unreadMessages = reviewMessages.filter((message) => message.readBy.includes(userId) === false).map((message) => message.id);
        if (unreadMessages.length > 0) {
            fetch(`/api/dashboard/read-message`, {
                signal: abortController.current?.signal,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messageIds: unreadMessages, tfgId: tfgId }),
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.success) {
                        setReviewMessages(
                            produce((draft) => {
                                unreadMessages.forEach((messageId) => {
                                    const message = draft.find((message) => message.id === messageId);
                                    if (message) {
                                        message.readBy.push(userId);
                                    }
                                });
                            })
                        );
                    } else {
                        console.error(json.response);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, 500);

    useEffect(() => {
        console.log("scrolling to bottom");
        if (simplebar.current) {
            const scrollElement = simplebar.current.contentWrapperEl;
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
        checkUnreadMessages();
    }, [reviewMessages]);

    const editMessage = () => {
        if (!showEdit) return;
        setIsSending(true);
        fetch(`/api/dashboard/review-message`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messageId: showEdit.id,
                message: showEdit.newValue,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.success) {
                    setReviewMessages(
                        produce((draft) => {
                            const target = draft.find((message) => message.id === showEdit.id);
                            if (target) {
                                target.message = showEdit.newValue;
                                target.edited = true;
                            }
                        })
                    );
                    setShowEdit(null);
                } else {
                    console.error(json.response);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsSending(false));
    };

    const deleteMessage = (id: number) => {
        fetch(`/api/dashboard/review-message`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messageId: id,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.success) {
                    setReviewMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
                } else {
                    console.error(json.response);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                showEdit
                    ? setShowEdit(
                          produce((draft) => {
                              if (draft) draft.newValue = draft.newValue + "\n";
                          })
                      )
                    : setMessage((prevMessage) => prevMessage + "\n");
            } else {
                event.preventDefault();
                showEdit ? editMessage() : sendMessage();
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        if (isSending) return;
        showEdit
            ? setShowEdit(
                  produce((draft) => {
                      if (draft) draft.newValue = event.target.value;
                  })
              )
            : setMessage(event.target.value);
    };

    const loadEditInterface = (messageId: number, currentMessageValue: string) => {
        setShowEdit({
            id: messageId,
            currentValue: currentMessageValue,
            newValue: currentMessageValue,
        });
    };

    const groupByDay = (messages: ReviewMessageType[]): MessagesByDay[] => {
        const grouped: Record<string, ReviewMessageType[]> = messages.reduce((acc, message) => {
            const localDate = format(parseISO(message.createdAt.toISOString()), 'MMM d', { locale: es });
            const formattedDate = toFirstLetterUppercase(localDate);
            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(message);
            return acc;
        }, {} as Record<string, ReviewMessageType[]>);
    
        return Object.keys(grouped).map(date => ({
            date,
            messages: grouped[date]
        }));
    };

    const groupedMessages = groupByDay(reviewMessages);
    
    return (
        <>
            <div className="flex-1 rounded-xl bg-dark-grid relative">
                <div className=" absolute top-0 bottom-0 left-0 right-0">
                    {reviewMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center w-full text-center text-gray-400">Todavía no hay mensajes</div>
                    ) : (
                        <SimpleBar ref={simplebar} autoHide={false} className="h-full pr-4">
                            <div className="py-3 pl-3 flex flex-col gap-1">
                                {groupedMessages.map((group) => (
                                    <React.Fragment key={group.date}>
                                        <div className="text-gray-400 w-full text-center">
                                            <div className="text-sm inline-block text-white mt-2 mb-1 py-1 border-1 border-white/20 bg-black/50 rounded-full px-5">{group.date}</div>
                                        </div>
                                        {group.messages.map((message, index) => (
                                            <ReviewMessageBox
                                                loadEditInterface={loadEditInterface}
                                                showAvatarAndName={index === 0 || group.messages[index - 1].user?.id!== message.user?.id}
                                                key={message.id}
                                                messageData={message}
                                                own={message.user?.id === userId}
                                                deleteMessage={deleteMessage}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </SimpleBar>
                    )}
                </div>
            </div>
            {showEdit && (
                <div className="bg-gray-900  pb-1 pl-1 pr-1 pt-3 w-full  left-0 flex">
                    <div className="flex-1">
                        <div className="text-tiny text-blue-200">Editar mensaje</div>
                        <div className="text-sm line-clamp-2 leading-5">{showEdit.currentValue}</div>
                    </div>
                    <Button
                        onClick={() => setShowEdit(null)}
                        className="px-2 text-nova-gray hover:text-white transition-colors flex items-center justify-center">
                        <IconX size={19} />{" "}
                    </Button>
                </div>
            )}
            <div className="flex items-center relative pt-2 ">
                <TextareaAutosize
                    rows={1}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    spellCheck
                    value={showEdit ? showEdit.newValue : message}
                    maxRows={10}
                    placeholder="Escribe un mensaje..."
                    className={clsx(HeadlessBasic, "rounded-lg pr-16 resize-none", isSending && "opacity-50")}
                />

                <Button
                    onClick={() => (showEdit ? editMessage() : sendMessage())}
                    className={clsx(
                        "absolute right-0 pr-3 pl-2  transition-opacity h-9 bottom-0 inline-flex items-center gap-2 rounded-md  text-sm/6 font-semibold",
                        isSending ? "opacity-100" : "opacity-50 hover:opacity-100"
                    )}>
                    {isSending ? <Spinner size="sm" color="white" /> : showEdit ? <IconCheck size={20} /> : <IconSend2 size={20} />}
                </Button>
            </div>
        </>
    );
}
