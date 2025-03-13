"use client";

import * as React from "react";
import {
    Receipt,
    GalleryVerticalEnd,
    Settings2,
    Shapes,
    Scroll,
    ChartSpline,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
    },
    team: {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
    },

    navMain: [
        {
            title: "Manage",
            url: "#",
            icon: Shapes,
            isActive: true,
            items: [
                {
                    title: "Product",
                    url: "/admin/products",
                },
                {
                    title: "Category",
                    url: "/admin/categories",
                },
                {
                    title: "Customer",
                    url: "/admin/customers",
                },
            ],
        },
        {
            title: "Reports",
            url: "#",
            icon: ChartSpline,
            isActive: true,
            items: [
                {
                    title: "Sales",
                    url: "/admin/reports",
                },
                // {
                //     title: "User",
                //     url: "/admin/reports?tab=users",
                // },
                // {
                //     title: "Product",
                //     url: "/admin/reports?tab=products",
                // },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/admin">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        FurnitStyle
                                    </span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
