import type { Metadata } from "next";
import DashboardNavigation from "../dashboardComponents/dashboardNavigation";

export const metadata: Metadata = {
    title: "Nova - Dashboard",
};


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <main className="lg:flex lg:self-strech p-3 w-full h-full min-h-lvh bg-nova-darker">
            <DashboardNavigation className="block lg:hidden" />
            
            <div className="lg:flex-1 p-3">{children}</div>
        </main>
    );
}
