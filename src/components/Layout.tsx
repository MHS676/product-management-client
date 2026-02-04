import { Link, useLocation } from 'react-router-dom';
import { FileText, FolderOpen, Layout as LayoutIcon, Search, CheckSquare } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: LayoutIcon },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/field-templates', label: 'Field Templates', icon: Layout as any },
    { path: '/extractions', label: 'Extractions', icon: Search },
    { path: '/reviews', label: 'Reviews', icon: CheckSquare },
  ];

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>Legal Review</h1>
        </div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}
