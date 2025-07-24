<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        // Sprawdzenie autoryzacji
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Brak uprawnień do uploadowania obrazów',
            ], 403);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        try {
            $image = $request->file('image');
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            
            // Upload do Cloudflare R2
            $path = Storage::disk('r2')->putFileAs('products', $image, $filename);
            
            // Zwróć pełny URL (skonstruuj URL ręcznie)
            $baseUrl = config('filesystems.disks.r2.url');
            $url = $baseUrl . '/products/' . $filename;
            
            return response()->json([
                'success' => true,
                'url' => $url,
                'filename' => $filename,
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas uploadowania obrazu: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function delete(Request $request)
    {
        // Sprawdzenie autoryzacji
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Brak uprawnień do usuwania obrazów',
            ], 403);
        }

        $request->validate([
            'filename' => 'required|string',
        ]);

        try {
            $filename = $request->input('filename');
            $path = 'products/' . $filename;
            
            if (Storage::disk('r2')->exists($path)) {
                Storage::disk('r2')->delete($path);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Obraz został usunięty',
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Błąd podczas usuwania obrazu: ' . $e->getMessage(),
            ], 500);
        }
    }
}
