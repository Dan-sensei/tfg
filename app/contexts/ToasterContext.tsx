"use client";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface ToastContextProps {
    toast: typeof toast;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToasterdProvider({ children }: { children: React.ReactNode }) {
    return (
        <ToastContext.Provider value={{ toast }}>
            <Toaster
                toastOptions={{
                    duration: 7000,
                    className: "border-white/10 border-1 ",
                    style: {
                        borderRadius: "10px",
                        background: "#1a1a1a",
                        color: "#fff",
                    },
                }}
            />
            {children}
        </ToastContext.Provider>
    );
}

export const useToast = (): ToastContextProps => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useDashboard must be used within a LocalStorageProvider");
    }
    return context;
};
