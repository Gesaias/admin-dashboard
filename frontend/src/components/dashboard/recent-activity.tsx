"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
    action: string;
    description: string;
    time: string;
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
    return (
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Atividades Recentes
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                            <div className="relative mt-1">
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                {index !== activities.length - 1 && (
                                    <div className="absolute top-2.5 left-[4.5px] w-px h-12 bg-slate-100 dark:bg-slate-800"></div>
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {activity.action}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {activity.description}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
