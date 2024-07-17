"use client";
import { useEffect } from "react";
import { useCookieConsent } from "../contexts/CookieConsentContext";
import toast from "react-hot-toast";
import { Button } from "@headlessui/react";
import { BasicButton, InfoButton, PrimaryButton } from "../lib/headlessUIStyle";
import clsx from "clsx";

export default function CookieConsent() {
    const { consent, handleConsent, isMounted } = useCookieConsent();
    

    useEffect(() => {
        if (!isMounted || consent) {
            return;
        }

        toast(
            (t) => (
                <div className="flex flex-col">
                    Usamos cookies para mejorar la experiencia de usuario. Al continuar, aceptas estas cookies
                    <div className="flex justify-end">
                        <Button
                            className={clsx(BasicButton, PrimaryButton, "rounded-lg")}
                            onClick={() => {
                                handleConsent();
                                toast.dismiss(t.id);
                            }}>
                            Aceptar
                        </Button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                position: "bottom-left",
            }
        );
    }, [consent, isMounted]);

    return null;
}
