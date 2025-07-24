import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Zarządzaj Produktami',
        href: '/products/manage',
    },
    {
        title: 'Dodaj Produkt',
        href: '/products/create',
    },
];

type Props = {
    user: User;
};

export default function CreateProduct({ user }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        original_price: '',
        image_url: '',
        duration: '',
        short_desc: '',
        description: '',
        features: '',
        contents: '',
        color: '',
        category: 'ranks',
        discount: '',
        featured: false,
        popular: false,
        best_offer: false,
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data for submission
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                discount: formData.discount ? parseInt(formData.discount) : null,
                features: formData.features ? formData.features.split('\n').filter(f => f.trim()) : [],
                contents: formData.contents ? formData.contents.split('\n').filter(c => c.trim()) : [],
            };

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(submitData),
            });

            if (response.ok) {
                router.visit('/products/manage');
            } else {
                const errorData = await response.json();
                alert('Błąd podczas tworzenia produktu: ' + (errorData.message || 'Nieznany błąd'));
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Błąd podczas tworzenia produktu');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dodaj Nowy Produkt" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.visit('/products/manage')}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        <ArrowLeft size={20} />
                        Powrót
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dodaj Nowy Produkt</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-4xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Podstawowe informacje */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Podstawowe informacje</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nazwa *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cena *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cena oryginalna</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.original_price}
                                            onChange={(e) => handleInputChange('original_price', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Kategoria *</label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => handleInputChange('category', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="ranks">Rangi</option>
                                            <option value="keys">Klucze</option>
                                            <option value="bundles">Zestawy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Zniżka (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.discount}
                                            onChange={(e) => handleInputChange('discount', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <ImageUpload
                                            value={formData.image_url}
                                            onChange={(url) => handleInputChange('image_url', url)}
                                            label="Zdjęcie produktu"
                                            placeholder="Wklej URL lub wybierz plik"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Czas trwania</label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => handleInputChange('duration', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="np. 30 dni"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Kolor</label>
                                    <input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => handleInputChange('color', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="np. green, blue, from-green-500 to-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Opisy i funkcje */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Opisy i funkcje</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Krótki opis</label>
                                    <textarea
                                        rows={3}
                                        value={formData.short_desc}
                                        onChange={(e) => handleInputChange('short_desc', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Opis</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Funkcje (jedna na linię)</label>
                                    <textarea
                                        rows={4}
                                        value={formData.features}
                                        onChange={(e) => handleInputChange('features', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="/kit - zestaw dedykowany dla rangi&#10;/wb - przenośny crafting table&#10;/market - wystawienie do 5 przedmiotów"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Zawartość (jedna na linię)</label>
                                    <textarea
                                        rows={4}
                                        value={formData.contents}
                                        onChange={(e) => handleInputChange('contents', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="Ranga VIP 30d&#10;Epickie Klucze x16&#10;Mityczne Klucze x3"
                                    />
                                </div>

                                {/* Checkboxy */}
                                <div className="space-y-3">
                                    <h4 className="text-md font-medium">Status</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.featured}
                                                onChange={(e) => handleInputChange('featured', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">Featured</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.popular}
                                                onChange={(e) => handleInputChange('popular', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">Popular</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.best_offer}
                                                onChange={(e) => handleInputChange('best_offer', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">Best Offer</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="button"
                                onClick={() => router.visit('/products/manage')}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                            >
                                Anuluj
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                            >
                                <Save size={16} />
                                {loading ? 'Tworzenie...' : 'Utwórz Produkt'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
