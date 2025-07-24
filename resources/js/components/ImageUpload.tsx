import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    label?: string;
    placeholder?: string;
}

export default function ImageUpload({ 
    value, 
    onChange, 
    onRemove, 
    label = "Zdjęcie produktu",
    placeholder = "Wybierz zdjęcie lub wklej URL"
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState(value || '');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/images/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                    setError('Brak uprawnień do uploadowania obrazów');
                    return;
                }
                if (response.status === 419) {
                    setError('Sesja wygasła. Odśwież stronę i spróbuj ponownie.');
                    return;
                }
                if (response.status === 413) {
                    setError('Plik jest za duży');
                    return;
                }
                setError(`Błąd serwera: ${response.status}`);
                return;
            }

            const result = await response.json();

            if (result.success) {
                onChange(result.url);
                setUrlInput(result.url);
                setError(null);
            } else {
                setError(result.message || 'Błąd podczas uploadowania');
            }
        } catch (err) {
            setError('Błąd połączenia podczas uploadowania');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Walidacja pliku
            if (!file.type.startsWith('image/')) {
                setError('Wybierz plik obrazu');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB
                setError('Plik jest za duży (max 2MB)');
                return;
            }
            handleFileUpload(file);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setUrlInput(url);
        onChange(url);
        setError(null);
    };

    const handleRemove = () => {
        setUrlInput('');
        onChange('');
        if (onRemove) onRemove();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                setError('Wybierz plik obrazu');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB
                setError('Plik jest za duży (max 2MB)');
                return;
            }
            handleFileUpload(file);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            
            {/* URL Input */}
            <div className="relative">
                <input
                    type="url"
                    value={urlInput}
                    onChange={handleUrlChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={placeholder}
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 
                                 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Drag & Drop Upload Area */}
            <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                          ${dragOver 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Przeciągnij plik tutaj lub{' '}
                        <button
                            type="button"
                            onClick={triggerFileSelect}
                            className="text-blue-600 hover:text-blue-500 underline"
                            disabled={uploading}
                        >
                            wybierz plik
                        </button>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF, WebP (max 2MB)
                    </p>
                    {uploading && (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mt-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">Uploading...</span>
                        </div>
                    )}
                </div>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Preview */}
            {value && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Podgląd:
                    </p>
                    <div className="relative inline-block">
                        <img
                            src={value}
                            alt="Preview produktu"
                            className="h-32 w-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
                            onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.classList.remove('hidden');
                            }}
                        />
                        <div className="hidden h-32 w-32 border border-gray-300 dark:border-gray-600 rounded-lg 
                                      flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            <div className="text-center">
                                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Nie można załadować obrazu
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 
                                     text-white rounded-full p-1 shadow-sm transition-colors"
                            title="Usuń obraz"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
