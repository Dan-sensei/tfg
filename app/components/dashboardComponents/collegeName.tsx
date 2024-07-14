"use client";

import { useDashboard } from "../../contexts/DashboardContext";

export default function CollegeName() {
    const { collegeName, isInitialized } = useDashboard();
    return <h1 className="text-2xl uppercase pb-3 min-h-11">{isInitialized && collegeName}</h1>;
}
