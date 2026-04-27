'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              Carrossel<span className="text-indigo-600">Pro</span>
              <span className="text-xs ml-1 text-purple-500 font-medium">AI</span>
            </span>
          </button>

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Olá, <span className="font-medium text-gray-700">{user?.name}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
