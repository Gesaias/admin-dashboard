"use client";
import { LoadingDashboardScreen } from "@/components/loading-dashboard-screen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { BarChart3, ChevronRight, Home, LogOut, Package, Settings, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Produtos", href: "/dashboard/products", icon: Package },
    { label: "Usuários", href: "/dashboard/users", icon: Users },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({
            redirect: true,
            callbackUrl: "/auth/login",
        });
    };

    if (status === "loading") {
        return <LoadingDashboardScreen />;
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen flex h-screen bg-slate-50/50 overflow-hidden font-sans">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
                    {/* Logo/Header */}
                    <div className="h-16 flex items-center px-6 mb-4">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">
                                Quantum<span className="text-primary text-2xl">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Tooltip key={item.href} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Link href={item.href}>
                                            <motion.div
                                                whileHover={{ x: 4 }}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                                                    isActive
                                                        ? "bg-primary/5 text-primary shadow-sm"
                                                        : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "group-hover:text-slate-900"}`} />
                                                    <span className={`font-medium text-sm ${isActive ? "text-slate-900 font-semibold" : ""}`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-pill"
                                                        className="w-1.5 h-1.5 rounded-full bg-primary"
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        Clique para ir para {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>

                    {/* Footer / User Section */}
                    <div className="p-4 mt-auto border-t border-slate-100">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group text-left outline-none">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:scale-105 transition-transform">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                            {session?.user?.name ? session?.user?.name.charAt(0).toUpperCase() : "A"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {session?.user?.name || "Admin"}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {session?.user?.email || "admin@example.com"}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="right" className="w-56 mb-2">
                                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Settings className="w-4 h-4" />
                                    <span>Configurações</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={handleLogout}
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sair da conta</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Header */}
                    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
                        <div className="flex-1">
                            <motion.h1 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-bold text-slate-900"
                            >
                                {NAV_ITEMS.find(item => item.href === pathname)?.label || "Dashboard"}
                            </motion.h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                            <span className="hidden sm:inline-block">
                                {new Date().toLocaleDateString("pt-BR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                })}
                            </span>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto bg-slate-50/50">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-8 max-w-7xl mx-auto w-full"
                        >
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}
