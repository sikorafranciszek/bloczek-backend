<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
        // Sprawdź czy użytkownik jest adminem
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'Access denied');
        }

        $users = User::select('id', 'name', 'email', 'role', 'created_at', 'email_verified_at')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('admin/users', [
            'users' => $users,
            'user' => Auth::user()
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        // Sprawdź czy użytkownik jest adminem
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'Access denied');
        }

        // Nie pozwól adminowi zmienić swojej własnej roli
        if ($user->id === Auth::id()) {
            return back()->withErrors(['role' => 'Nie możesz zmienić swojej własnej roli']);
        }

        $validated = $request->validate([
            'role' => 'required|in:admin,user,unchecked'
        ]);

        $user->update(['role' => $validated['role']]);

        return back()->with('success', 'Rola użytkownika została zaktualizowana');
    }

    public function destroy(User $user)
    {
        // Sprawdź czy użytkownik jest adminem
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'Access denied');
        }

        // Nie pozwól adminowi usunąć samego siebie
        if ($user->id === Auth::id()) {
            return back()->withErrors(['delete' => 'Nie możesz usunąć swojego własnego konta']);
        }

        $userName = $user->name;
        $user->delete();

        return back()->with('success', "Użytkownik {$userName} został usunięty");
    }
}
