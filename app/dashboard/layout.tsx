import type { Metadata } from "next";
import DashboardNavigation from "../components/dashboardComponents/dashboardNavigation";
import { DashboardProvider } from "../contexts/DashboardContext";
import { getAllColleges } from "../lib/fetchData";

export const metadata: Metadata = {
    title: "Nova - Dashboard",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const colleges= await getAllColleges();

    return (
        <main className="flex flex-col xl:flex-row p-0 xl:p-3 self-strech w-full h-full min-h-lvh bg-nova-darker xl:pl-60">
            <DashboardProvider colleges={colleges}>
                <DashboardNavigation className="block xl:hidden left-0" />
                <div className="flex-1 flex items-stretch pl-3 p-3 xl:pt-0 xl:pl-3 xl:p-0 min-h-[600px]">{children}</div>
            </DashboardProvider>
        </main>
    );
}
