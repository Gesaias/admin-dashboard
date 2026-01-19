"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { menuItems } from "./app-sidebar";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function AppHeader() {
    const pathname = usePathname();
    const breadcrumbs = (() => {
        const segments = pathname.split("/").filter(Boolean);
        const allCrumbs = segments.reduce(
            (acc, segment) => {
                const prevUrl = acc.length > 0 ? acc[acc.length - 1].url : "";
                const currentUrl = `${prevUrl}/${segment}`;
                const item = menuItems.find((m) => m.url === currentUrl);
                acc.push({
                    title: item
                        ? item.title
                        : segment.charAt(0).toUpperCase() +
                          segment.slice(1).replace(/-/g, " "),
                    url: currentUrl,
                });
                return acc;
            },
            [] as { title: string; url: string }[],
        );

        if (allCrumbs.length > 1 && allCrumbs[0].url === "/dashboard") {
            allCrumbs.shift();
        }

        return allCrumbs;
    })();

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center sticky top-0 z-10 py-2">
            <div className="flex-1 flex items-center gap-2">
                <SidebarTrigger />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />

                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.length > 2 && (
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbEllipsis />
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        )}
                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const isNearLast = index === breadcrumbs.length - 2;

                            if (
                                breadcrumbs.length > 2 &&
                                !isLast &&
                                !isNearLast
                            )
                                return null;

                            return (
                                <React.Fragment key={crumb.url}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="font-bold">
                                                {crumb.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={crumb.url}>
                                                {crumb.title}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mr-2">
                <span className="hidden sm:inline-block">
                    {new Date().toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    })}
                </span>
            </div>
        </header>
    );
}
