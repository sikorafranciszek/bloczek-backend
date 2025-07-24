import AppLayout from '@/layouts/app-layout';
import { User, Product, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, ImageIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Zarządzaj Produktami',
        href: '/products/manage',
    },
];

type Props = {
    user: User;
    products: Product[];
};

export default function ManageProducts({ user, products }: Props) {
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const handleDelete = async (productId: number) => {
        if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) {
            return;
        }

        setDeleteLoading(productId);
        
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                router.reload();
            } else {
                alert('Błąd podczas usuwania produktu');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Błąd podczas usuwania produktu');
        } finally {
            setDeleteLoading(null);
        }
    };

    const categoryNames = {
        ranks: 'Rangi',
        keys: 'Klucze',
        bundles: 'Zestawy'
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Zarządzaj Produktami" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Zarządzaj Produktami</h1>
                    <Link
                        href="/products/create"
                        className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                        <Plus size={16} />
                        Dodaj Nowy Produkt
                    </Link>
                </div>

                <div className="grid gap-6">
                    {Object.entries(categoryNames).map(([category, categoryName]) => {
                        const categoryProducts = products.filter(p => p.category === category);
                        
                        return (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{categoryName} ({categoryProducts.length})</h2>
                    
                    {categoryProducts.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">Brak produktów w tej kategorii</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-600">
                                        <th className="text-left p-2 text-gray-900 dark:text-gray-100">Obraz</th>
                                        <th className="text-left p-2 text-gray-900 dark:text-gray-100">Nazwa</th>
                                        <th className="text-left p-2 text-gray-900 dark:text-gray-100">Cena</th>
                                        <th className="text-left p-2 text-gray-900 dark:text-gray-100">Cena oryginalna</th>
                                        <th className="text-left p-2 text-gray-900 dark:text-gray-100">Zniżka</th>
                                        <th className="text-left p-2 text-gray-900 dark:text-gray-100">Status</th>
                                        <th className="text-left p-2 text-gray-900 dark:text-gray-100">Akcje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryProducts.map(product => (
                                        <tr key={product.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="p-2">
                                                {product.image_url ? (
                                                    <div className="relative">
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                                if (fallback) fallback.classList.remove('hidden');
                                                            }}
                                                        />
                                                        <div className="hidden w-12 h-12 border border-gray-200 dark:border-gray-600 rounded-lg 
                                                                      flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                            <ImageIcon className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 border border-gray-200 dark:border-gray-600 rounded-lg 
                                                                  flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                        <ImageIcon className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-2">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                                                    {product.short_desc && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                            {product.short_desc}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2 font-medium text-gray-900 dark:text-gray-100">{product.price}zł</td>
                                            <td className="p-2 text-gray-900 dark:text-gray-100">
                                                {product.original_price ? `${product.original_price}zł` : '-'}
                                            </td>
                                            <td className="p-2 text-gray-900 dark:text-gray-100">
                                                {product.discount ? `${product.discount}%` : '-'}
                                            </td>
                                                        <td className="p-2">
                                                            <div className="flex gap-1">
                                                                {product.featured && (
                                                                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 px-2 py-1 rounded">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                                {product.popular && (
                                                                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
                                                                        Popular
                                                                    </span>
                                                                )}
                                                                {product.best_offer && (
                                                                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded">
                                                                        Best Offer
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={`/products/${product.id}/edit`}
                                                                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                                                                >
                                                                    <Pencil size={14} />
                                                                    Edytuj
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(product.id)}
                                                                    disabled={deleteLoading === product.id}
                                                                    className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm disabled:opacity-50"
                                                                >
                                                                    <Trash2 size={14} />
                                                                    {deleteLoading === product.id ? 'Usuwanie...' : 'Usuń'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
