import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem, type Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Settings, ImageIcon } from 'lucide-react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Produktów',
        href: '/dashboard',
    },
];

type Props = {
    user: User;
    products: Product[];
};

export default function Dashboard({ user, products }: Props) {


    if (user.role === 'unchecked') {
        return (
            <div className='flex h-screen items-center justify-center p-4'>
                <div className='flex flex-col items-center justify-center text-center'>
                    <h1 className="text-2xl font-bold">Dostęp Zablokowany</h1>
                    <p className="mt-2 text-gray-600">
                        Twoje konto nie jest zweryfikowane. Skontaktuj się z pomocą techniczną w celu uzyskania pomocy.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel Produktów" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {user.role === 'admin' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Panel Administratora</h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300">Zarządzaj produktami i sklepem</p>
                            </div>
                            <Link
                                href="/products/manage"
                                className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                            >
                                <Settings size={16} />
                                Zarządzaj Produktami
                            </Link>
                        </div>
                    </div>
                )}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-800">
                        <div className="p-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Rangi ({products.filter(p => p.category === 'ranks').length})</h3>
                            <div className="space-y-2">
                                {products.filter(p => p.category === 'ranks').slice(0, 3).map(product => (
                                    <div key={product.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-6 h-6 object-cover rounded border"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className="hidden w-6 h-6 border rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                <ImageIcon className="h-3 w-3 text-gray-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{product.price} zł</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-800">
                        <div className="p-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Klucze ({products.filter(p => p.category === 'keys').length})</h3>
                            <div className="space-y-2">
                                {products.filter(p => p.category === 'keys').slice(0, 3).map(product => (
                                    <div key={product.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-6 h-6 object-cover rounded border"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className="hidden w-6 h-6 border rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                <ImageIcon className="h-3 w-3 text-gray-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{product.price} zł</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-800">
                        <div className="p-4">
                            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Zestawy ({products.filter(p => p.category === 'bundles').length})</h3>
                            <div className="space-y-2">
                                {products.filter(p => p.category === 'bundles').slice(0, 3).map(product => (
                                    <div key={product.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-6 h-6 object-cover rounded border"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className="hidden w-6 h-6 border rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                <ImageIcon className="h-3 w-3 text-gray-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{product.price}zł</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border bg-white dark:bg-gray-800">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Wszystkie Produkty</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {products.map(product => (
                                    <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow bg-white dark:bg-gray-800">
                                        {/* Image Preview */}
                                        {product.image_url && (
                                            <div className="mb-3">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.classList.remove('hidden');
                                                    }}
                                                />
                                                <div className="hidden w-full h-32 border border-gray-200 dark:border-gray-600 rounded-lg 
                                                              flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                    <div className="text-center">
                                                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Nie można załadować obrazu
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</h3>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{product.category}</span>
                                        </div>
                                        
                                        {product.short_desc && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.short_desc}</p>
                                        )}
                                        
                                        {product.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>
                                        )}
                                        
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{product.price} zł</span>
                                                {product.original_price && (
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{product.original_price} zł</span>
                                                )}
                                                {product.discount && (
                                                    <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded">-{product.discount}%</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex gap-1">
                                                {product.featured && <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 px-2 py-1 rounded">Featured</span>}
                                                {product.popular && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">Popular</span>}
                                                {product.best_offer && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded">Best Offer</span>}
                                            </div>
                                        </div>
                                        
                                        {product.duration && (
                                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Czas trwania: {product.duration}</div>
                                        )}
                                        
                                        {product.features && product.features.length > 0 && (
                                            <div className="mt-3">
                                                <h4 className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Funkcje:</h4>
                                                <ul className="text-xs space-y-1">
                                                    {product.features.slice(0, 3).map((feature, index) => (
                                                        <li key={index} className="text-gray-600 dark:text-gray-400">• {feature}</li>
                                                    ))}
                                                    {product.features.length > 3 && (
                                                        <li className="text-gray-500 dark:text-gray-500">... i {product.features.length - 3} więcej</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {product.contents && product.contents.length > 0 && (
                                            <div className="mt-3">
                                                <h4 className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Zawiera:</h4>
                                                <ul className="text-xs space-y-1">
                                                    {product.contents.map((content, index) => (
                                                        <li key={index} className="text-gray-600 dark:text-gray-400">• {content}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
