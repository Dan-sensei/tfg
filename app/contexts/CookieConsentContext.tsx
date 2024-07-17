"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface CookieConsentContextProps {
    consent: boolean;
    handleConsent: () => void;
    isMounted: boolean;
}
const CookieConsentContext = createContext<CookieConsentContextProps | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
    const [consent, setConsent] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const consentGiven = localStorage.getItem("cookieConsent");
        if (consentGiven) {
            setConsent(true);
        }
        setIsMounted(true);
    }, []);

    const handleConsent = () => {
        localStorage.setItem("cookieConsent", "true");
        setConsent(true);
    };

    return <CookieConsentContext.Provider value={{ isMounted, consent, handleConsent }}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentContextProps {
    const context = useContext(CookieConsentContext);
    if (!context) {
        throw new Error("useCookieConsent must be used within a CookieConsentProvider");
    }
    return context;
}
