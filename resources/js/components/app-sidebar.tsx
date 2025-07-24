import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Settings, BarChart3 } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const mainNavItems: NavItem[] = [
        {
            title: 'Panel Produktów',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        // Dodaj link do zarządzania produktami tylko dla adminów
        ...(user?.role === 'admin' ? [
            {
                title: 'Zarządzaj Produktami',
                href: '/products/manage',
                icon: Settings,
            },
            {
                title: 'Analityka',
                href: '/analytics',
                icon: BarChart3,
            }
        ] : []),
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Strona Serwera',
            href: 'https://bloczekmc.pl',
            icon: Folder,
        },
        {
            title: 'Discord',
            href: 'https://dc.bloczekmc.pl',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
