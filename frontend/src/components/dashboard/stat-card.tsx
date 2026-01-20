"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    change: string;
}

export function StatCard({ title, value, icon: Icon, color, change }: StatCardProps) {
    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-white dark:bg-slate-900 shadow-sm group">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {title}
                        </p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                            {value}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                                {change}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                                vs mês passado
                            </span>
                        </div>
                    </div>
                    <div className={`${color} p-4 rounded-2xl shadow-lg shadow-${color.replace('bg-', '')}/20 transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
