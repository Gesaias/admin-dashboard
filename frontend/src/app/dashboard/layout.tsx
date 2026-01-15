'use client';
import { Button } from "@/components/ui/button";
import { BarChart3, Home, LogOut, Package, Users } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      // ignore
    } finally {
      setMounted(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Dashboard</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <Home className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Dashboard</span>
            </div>
          </Link>

          <Link href="/dashboard/products">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <Package className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Produtos</span>
            </div>
          </Link>

          <Link href="/dashboard/users">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Usuários</span>
            </div>
          </Link>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {mounted && user.name ? user.name.charAt(0) : 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                {mounted && user.name ? user.name : 'Admin'}
              </p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 py-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Bem-vindo ao Dashboard
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>
        {/* Main Content */}
        <main className="overflow-auto h-full">
          {/* Page Content */}
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
