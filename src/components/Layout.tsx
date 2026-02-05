import { Link, useLocation } from 'react-router-dom';
import { FileText, FolderOpen, Layout as LayoutIcon, Search, CheckSquare, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/field-templates', label: 'Field Templates', icon: LayoutIcon },
    { path: '/extractions', label: 'Extractions', icon: Search },
    { path: '/reviews', label: 'Reviews', icon: CheckSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Legal Review</h1>
          <p className="text-sm text-gray-500 mt-1">Document Analysis</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Icon size={20} className={active ? 'text-blue-700' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">© 2026 Legal Review System</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
