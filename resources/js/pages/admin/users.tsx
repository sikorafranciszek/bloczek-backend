import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    Shield, 
    User, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Trash2,
    Users as UsersIcon
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Zarządzanie użytkownikami',
        href: '/admin/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'unchecked';
    created_at: string;
    email_verified_at: string | null;
}

interface UsersPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const getRoleBadgeVariant = (role: string) => {
    switch (role) {
        case 'admin':
            return 'destructive';
        case 'user':
            return 'default';
        case 'unchecked':
            return 'secondary';
        default:
            return 'outline';
    }
};

const getRoleIcon = (role: string) => {
    switch (role) {
        case 'admin':
            return Shield;
        case 'user':
            return User;
        case 'unchecked':
            return Clock;
        default:
            return User;
    }
};

const getRoleLabel = (role: string) => {
    switch (role) {
        case 'admin':
            return 'Administrator';
        case 'user':
            return 'Użytkownik';
        case 'unchecked':
            return 'Niezweryfikowany';
        default:
            return role;
    }
};

export default function Users({ users }: UsersPageProps) {
    const { auth, flash, errors } = usePage<SharedData & { 
        flash: { success?: string; error?: string }, 
        errors: Record<string, string> 
    }>().props;
    const [loadingUsers, setLoadingUsers] = useState<Set<number>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);
    const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Obsługa flash messages
    useEffect(() => {
        if (flash?.success) {
            setFlashMessage({ type: 'success', message: flash.success });
            setTimeout(() => setFlashMessage(null), 5000);
        }
        if (flash?.error) {
            setFlashMessage({ type: 'error', message: flash.error });
            setTimeout(() => setFlashMessage(null), 5000);
        }
    }, [flash]);

    const handleRoleChange = async (userId: number, newRole: string) => {
        setLoadingUsers(prev => new Set(prev).add(userId));

        try {
            router.put(`/admin/users/${userId}/role`, { role: newRole }, {
                preserveScroll: true,
                onFinish: () => {
                    setLoadingUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(userId);
                        return newSet;
                    });
                }
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            setLoadingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const handleDeleteUser = async (userId: number) => {
        setLoadingUsers(prev => new Set(prev).add(userId));
        setDeleteDialogOpen(null);

        try {
            router.delete(`/admin/users/${userId}`, {
                preserveScroll: true,
                onFinish: () => {
                    setLoadingUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(userId);
                        return newSet;
                    });
                }
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            setLoadingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Zarządzanie użytkownikami" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Flash Messages */}
                    {flashMessage && (
                        <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-sm ${
                            flashMessage.type === 'success' 
                                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' 
                                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                        }`}>
                            {flashMessage.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 flex-shrink-0" />
                            )}
                            <span className="font-medium">{flashMessage.message}</span>
                            <button 
                                onClick={() => setFlashMessage(null)}
                                className="ml-auto text-current hover:opacity-70 text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                Zarządzanie użytkownikami
                            </h1>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                Zarządzaj rolami i kontami użytkowników systemu
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-sm px-3 py-1">
                                <UsersIcon className="w-4 h-4 mr-2" />
                                Łącznie: {users.total} użytkowników
                            </Badge>
                        </div>
                    </div>

                    {/* Users Table */}
                    <Card className="shadow-sm border-0 ring-1 ring-gray-200 dark:ring-gray-800">
                        <div className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                Użytkownik
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                Rola
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                Status weryfikacji
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                Data rejestracji
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                Akcje
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                        {users.data.map((user) => {
                                            const RoleIcon = getRoleIcon(user.role);
                                            const isCurrentUser = user.id === auth.user.id;
                                            const isLoading = loadingUsers.has(user.id);

                                            return (
                                                <tr 
                                                    key={user.id} 
                                                    className={`transition-colors duration-200 ${
                                                        isCurrentUser 
                                                            ? 'bg-blue-50 dark:bg-blue-900/20' 
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                    }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {user.name}
                                                                    </span>
                                                                    {isCurrentUser && (
                                                                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                                                            To Ty
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {isCurrentUser ? (
                                                            <Badge 
                                                                variant={getRoleBadgeVariant(user.role)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1"
                                                            >
                                                                <RoleIcon className="w-3.5 h-3.5" />
                                                                {getRoleLabel(user.role)}
                                                            </Badge>
                                                        ) : (
                                                            <Select
                                                                value={user.role}
                                                                onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                                                                disabled={isLoading}
                                                            >
                                                                <SelectTrigger className="w-44 h-9">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="admin">
                                                                        <div className="flex items-center gap-2">
                                                                            <Shield className="w-4 h-4" />
                                                                            <span>Administrator</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="user">
                                                                        <div className="flex items-center gap-2">
                                                                            <User className="w-4 h-4" />
                                                                            <span>Użytkownik</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="unchecked">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="w-4 h-4" />
                                                                            <span>Niezweryfikowany</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.email_verified_at ? (
                                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 inline-flex items-center gap-1.5 px-3 py-1">
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                                Zweryfikowany
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-3 py-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Niezweryfikowany
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {formatDate(user.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {!isCurrentUser && (
                                                            <Dialog open={deleteDialogOpen === user.id} onOpenChange={(open) => !open && setDeleteDialogOpen(null)}>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-300 dark:border-gray-600"
                                                                        disabled={isLoading}
                                                                        onClick={() => setDeleteDialogOpen(user.id)}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-md">
                                                                    <DialogHeader className="space-y-3">
                                                                        <DialogTitle className="text-lg font-semibold">
                                                                            Usunięcie użytkownika
                                                                        </DialogTitle>
                                                                        <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                                                                            Czy na pewno chcesz usunąć użytkownika <strong className="text-gray-900 dark:text-gray-100">{user.name}</strong> ({user.email})?
                                                                            <br /><br />
                                                                            <span className="text-red-600 dark:text-red-400 font-medium">
                                                                                Ta akcja jest nieodwracalna i usunie wszystkie dane użytkownika.
                                                                            </span>
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                                                                        <Button 
                                                                            variant="outline" 
                                                                            onClick={() => setDeleteDialogOpen(null)}
                                                                            className="flex-1 sm:flex-none"
                                                                        >
                                                                            Anuluj
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => handleDeleteUser(user.id)}
                                                                            className="flex-1 sm:flex-none"
                                                                        >
                                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                                            Usuń użytkownika
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-center">
                            <div className="flex items-center gap-1">
                                {users.links.map((link, index) => {
                                    if (!link.url) {
                                        return (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                className="min-w-[40px] h-9"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link key={index} href={link.url}>
                                            <Button
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                className="min-w-[40px] h-9"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
