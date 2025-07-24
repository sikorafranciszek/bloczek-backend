import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export type UserRole = 'admin' | 'user' | 'unchecked';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: UserRole;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Product {
    id: number;
    name: string;
    price: number;
    original_price?: number;
    image_url?: string;
    duration?: string;
    short_desc?: string;
    description?: string;
    features?: string[];
    contents?: string[];
    color?: string;
    category: string;
    discount?: number;
    featured: boolean;
    popular: boolean;
    best_offer: boolean;
}