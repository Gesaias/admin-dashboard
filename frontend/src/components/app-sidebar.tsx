"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    BarChart3,
    ChevronUp,
    Home,
    LogOut,
    Package,
    Settings,
    User2,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "./ui/badge";

export const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Produtos",
        url: "/dashboard/products",
        icon: Package,
    },
    {
        title: "Usuários",
        url: "/dashboard/users",
        icon: Users,
    },
];

export function AppSidebar() {
    const { open: isOpen } = useSidebar();
    const { data: session } = useSession();
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({
            redirect: true,
            callbackUrl: "/auth/login",
        });
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <Link href={"/dashboard"} className="flex gap-3 items-center">
                    <div className="hover:cursor-pointer w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    {isOpen && (
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            Quantum
                            <span className="text-primary text-2xl">.</span>
                        </span>
                    )}
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menus</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive =
                                    pathname === item.url ||
                                    (item.url !== "/dashboard" &&
                                        pathname?.startsWith(item.url + "/")) ||
                                    (item.url === "/dashboard" &&
                                        pathname === "/dashboard");
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                                    isActive
                                                        ? "bg-primary/5 text-primary shadow-sm"
                                                        : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                                                }`}
                                            >
                                                <item.icon
                                                    className={`w-5 h-5 transition-colors ${
                                                        isActive
                                                            ? "text-primary"
                                                            : "group-hover:text-slate-900"
                                                    }`}
                                                />
                                                <span
                                                    className={`font-medium text-sm ${
                                                        isActive
                                                            ? "text-slate-900 font-semibold"
                                                            : ""
                                                    }`}
                                                >
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <Separator
                        orientation="horizontal"
                        className="mr-2 data-[orientation=horizontal]:w-4"
                    />
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group h-fit">
                                    <div className="flex items-center gap-2 w-full">
                                        <User2 />
                                        {
                                            isOpen && (
                                                <span className="font-medium text-sm truncate">
                                                    {session?.user?.name}
                                                </span>
                                            )
                                        }
                                    </div>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side={isOpen ? "top" : "right"}
                                align={isOpen ? "center" : "end"}
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuLabel>
                                    Minha Conta
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                        <Settings className="w-4 h-4" />
                                        <span>Configurações</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sair da conta</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
