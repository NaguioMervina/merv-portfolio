import { Link, usePage } from "@inertiajs/react";
import {
    LayoutGrid,
    FolderOpen,
    Wrench,
    GraduationCap,
    LogOut,
    Mail,
    Settings,
    FileUp,
} from "lucide-react";
import AppLogo from "./app-logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

const mainNavItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutGrid },
    { title: "Projects", url: "/admin/projects", icon: FolderOpen },
    { title: "Skills", url: "/admin/skills", icon: Wrench },
    { title: "Experience", url: "/admin/experiences", icon: GraduationCap },
    { title: "Contacts", url: "/admin/contacts", icon: Mail },
    { title: "Resume", url: "/admin/resume/upload", icon: FileUp },
    { title: "Portfolio", url: "/admin/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { url } = usePage();
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild isActive={url === item.url || url.startsWith(item.url + "/")}>
                                        <Link href={item.url}>
                                            <item.icon className="mr-2 h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/" target="_blank">
                                <span>View Portfolio ↗</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={route('logout')} method="post" as="button">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
