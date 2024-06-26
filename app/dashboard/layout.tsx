import type { Metadata } from "next";
import DashboardNavigation from "../dashboardComponents/dashboardNavigation";

export const metadata: Metadata = {
    title: "Nova - Dashboard",
};


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {


    
    return (
        <main className="xl:flex p-0 xl:p-3 xl:self-strech w-full h-full min-h-lvh bg-nova-darker">
            <DashboardNavigation className="block xl:hidden" />
            
            <div className="xl:flex-1 p-3 xl:pt-0">{children}</div>
        </main>
    );
}
