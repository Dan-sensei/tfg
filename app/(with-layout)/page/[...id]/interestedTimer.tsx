"use client";

import { useCookieConsent } from "@/app/contexts/CookieConsentContext";
import { setInterestedCookie } from "@/app/lib/actions/interestedCookie";
import { INTERESTED_TIMEOUT } from "@/app/types/defaultData";
import { useEffect } from "react";

export default function InterestedTimer({ tags }: { tags: string[] }) {
    const { consent, isMounted } = useCookieConsent();

    useEffect(() => {
        if (!isMounted || !consent) {
            return;
        }

        let interestedTimeout = setTimeout(() => {
            setInterestedCookie(tags);
        }, INTERESTED_TIMEOUT);

        return () => {
            clearTimeout(interestedTimeout);
        };
    }, [consent, isMounted, tags]);

    return null;
}
