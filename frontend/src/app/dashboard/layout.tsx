import AppHeader from "@/components/app-header";
import AppMain from "@/components/app-main";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-full w-full">
                <AppHeader />
                <AppMain>{children}</AppMain>
            </SidebarInset>
        </SidebarProvider>
    );
}
