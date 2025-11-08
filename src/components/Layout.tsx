import { ReactNode } from 'react';
import {
  Store,
  Package,
  Truck,
  CreditCard,
  ArrowLeftRight,
  FileText,
  Activity,
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
}

const menuItems = [
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'stores', label: 'Stores', icon: Store },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'credits', label: 'Credits', icon: CreditCard },
  { id: 'returns', label: 'Returns', icon: ArrowLeftRight },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'service', label: 'Service Status', icon: Activity },
  { id: 'admin', label: 'Admin', icon: Settings },
];

export default function Layout({ children, currentPage, onNavigate, onLogout, userName }: LayoutProps) {
  return (
    <div className="min-h-screen bg-red-900 flex">
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold">Demo</h1>
        </div>

        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-200 hover:bg-blue-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-blue-800">
          <div className="text-sm text-gray-300 mb-2">Logged in as:</div>
          <div className="text-white font-semibold mb-3">{userName}</div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="min-h-full bg-white m-8 rounded-lg shadow-xl">
          {children}
        </div>
      </main>
    </div>
  );
}
