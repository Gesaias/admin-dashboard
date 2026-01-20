import { JSX, ReactNode } from "react";
import { Button, buttonVariants } from "./ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface Action extends VariantProps<typeof buttonVariants> {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    className?: string;
}

export interface DashboardPageHeaderProps {
    title: string;
    description: string;
    actions?: Action[];
}

export default function DashboardPageHeader({
    title,
    description,
    actions
}: DashboardPageHeaderProps): JSX.Element {
    return (
        <div className="w-full flex flex-col justify-between items-start lg:flex-row gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-gray-500">{description}</p>
            </div>
            {actions && (
                <div className="flex flex-wrap gap-2">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || "default"}
                            size={action.size || "sm"}
                            className={cn("cursor-pointer", action.className)}
                            onClick={action.onClick}
                        >
                            {action.icon}
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}