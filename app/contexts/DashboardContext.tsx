"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { FullCollege } from "../types/interfaces";

interface DashboardContextProps {
    collegeId: number;
    collegeName: string;
    setCollege: (college: FullCollege) => void;
    isInitialized: boolean;
    allColleges: FullCollege[];
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export function DashboardProvider({ children, colleges }: { colleges: FullCollege[]; children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [college, setCollege] = useState<FullCollege>(
        colleges[0] ?? {
            id: "1",
            image: "",
            name: "",
        }
    );

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    return (
        <DashboardContext.Provider value={{ allColleges: colleges, collegeId: college.id, collegeName: college.name, setCollege, isInitialized }}>
            {children}
        </DashboardContext.Provider>
    );
}

export const useDashboard = (): DashboardContextProps => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a LocalStorageProvider");
    }
    return context;
};
