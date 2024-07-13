"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function CollegeName (){
    const { collegeName } = useDashboard();
    return <h1 className="text-2xl uppercase pb-3">{collegeName}</h1>
}