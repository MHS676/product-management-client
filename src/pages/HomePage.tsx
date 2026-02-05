import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../api';
import { FileText, FolderOpen, Layout, Search, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: () => healthApi.check(),
  });

  const features = [
    {
      icon: FolderOpen,
      title: 'Projects',
      description: 'Organize and manage legal document review projects',
      link: '/projects',
      color: '#3b82f6',
    },
    {
      icon: FileText,
      title: 'Documents',
      description: 'Upload and process legal documents for review',
      link: '/documents',
      color: '#8b5cf6',
    },
    {
      icon: Layout,
      title: 'Field Templates',
      description: 'Define custom fields to extract from documents',
      link: '/field-templates',
      color: '#ec4899',
    },
    {
      icon: Search,
      title: 'Extractions',
      description: 'View and manage extracted field data with citations',
      link: '/extractions',
      color: '#f59e0b',
    },
    {
      icon: CheckSquare,
      title: 'Reviews',
      description: 'Review and validate extracted information',
      link: '/reviews',
      color: '#10b981',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Legal Document Review System</h1>
          <p className="text-muted">
            Professional document analysis and review platform
          </p>
        </div>
        {health && (
          <div className="badge badge-success">
            Backend: {health.status}
          </div>
        )}
      </div>

      <div className="grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="card hover-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: `${feature.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} color={feature.color} />
                </div>
                <h2 style={{ margin: 0 }}>{feature.title}</h2>
              </div>
              <p className="text-muted">{feature.description}</p>
            </Link>
          );
        })}
      </div>

      {health && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>System Information</h3>
          <div className="info-grid">
            <div>
              <span className="text-muted">Status:</span>
              <span className="badge badge-success">{health.status}</span>
            </div>
            <div>
              <span className="text-muted">Service:</span>
              <span>{health.service}</span>
            </div>
            <div>
              <span className="text-muted">Timestamp:</span>
              <span>{new Date(health.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
