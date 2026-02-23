import React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader, SidebarMenu,
    SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton,
    SidebarMenuSubItem, SidebarSeparator
} from "@/components/ui/sidebar";
import {
    BookText,
    ChartLine,
    ChevronUp, Code,
    Euro,
    Home, HomeIcon, LayoutDashboardIcon, Paperclip,
    PiggyBank,
    Plus,
    Projector,
    ScrollText,
    Search,
    Settings, ShoppingBasket, SquareChartGanttIcon,
    User2,
    Users
} from "lucide-react";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Image from "next/image";

type NavItem = {
    title: string
    url: string
    icon: React.ReactNode
    subItems?: { title: string; url: string; icon: React.ReactNode }[]
}

const items: NavItem[] = [
    {
        title: "Home",
        url: "/",
        icon: <HomeIcon/>,
    },
    {
        title: "Analysen",
        url: "/analysis",
        icon: <ChartLine/>,
    },
    {
        title: "Projekte",
        url: "/projects",
        icon: <SquareChartGanttIcon/>,
        subItems: [
            { title: "Neues Projekt", url: "/projects/new", icon: <Plus/> },
        ],
    },
]

function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/"}>
                                <Image src={"/invoice-image.png"} alt={"logo"} width={20} height={20} />
                                <span>Leibnitz-Connect Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator/>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Allgemein</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    {item.subItems && (
                                        <SidebarMenuSub>
                                            {item.subItems.map(sub => (
                                                <SidebarMenuSubItem key={sub.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={sub.url}>
                                                            {sub.icon}
                                                            {sub.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        <SidebarSeparator/>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/#">
                                        <Projector />
                                         Support
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <Link href="http://localhost:3000/documentation">
                                                <BookText />
                                                Documentation
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>

                                </SidebarMenuSub>
                            </SidebarMenuItem>
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>


            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2/> Tobias Plank <ChevronUp className="ml-auto"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Account</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem variant={"destructive"}>Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;