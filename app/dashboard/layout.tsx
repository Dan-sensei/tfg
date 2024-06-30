import type { Metadata } from "next";
import DashboardNavigation from "../dashboardComponents/dashboardNavigation";

export const metadata: Metadata = {
    title: "Nova - Dashboard",
};


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {


    
    return (
        <main className="flex flex-col xl:flex-row p-0 xl:p-3 self-strech w-full h-full min-h-lvh bg-nova-darker xl:pl-60">
            
                <DashboardNavigation className="block xl:hidden left-0" />
            
            <div className="flex-1 flex items-stretch pl-3 p-3 xl:pt-0 xl:pl-3 xl:p-0">{children}</div>
        </main>
    );
}
