import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api';
import { ArrowLeft, FileText, Layout, Search, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="alert alert-error">
        Project not found
      </div>
    );
  }

  return (
    <div>
      <Link to="/projects" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={20} />
        Back to Projects
      </Link>

      <div className="page-header">
        <div>
          <h1>{project.name}</h1>
          {project.description && (
            <p className="text-muted">{project.description}</p>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Project Information</h3>
        <div className="info-grid">
          <div>
            <span className="text-muted">Project ID:</span>
            <code>{project.id}</code>
          </div>
          <div>
            <span className="text-muted">Created:</span>
            <span>{format(new Date(project.createdAt), 'PPpp')}</span>
          </div>
          <div>
            <span className="text-muted">Last Updated:</span>
            <span>{format(new Date(project.updatedAt), 'PPpp')}</span>
          </div>
        </div>
      </div>

      <div className="grid">
        <Link to="/documents" className="card hover-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FileText size={24} color="#8b5cf6" />
            <h3 style={{ margin: 0 }}>Documents</h3>
          </div>
          <p className="text-muted">View and manage documents in this project</p>
        </Link>

        <Link to="/field-templates" className="card hover-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Layout size={24} color="#ec4899" />
            <h3 style={{ margin: 0 }}>Field Templates</h3>
          </div>
          <p className="text-muted">Configure extraction fields for this project</p>
        </Link>

        <Link to="/extractions" className="card hover-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Search size={24} color="#f59e0b" />
            <h3 style={{ margin: 0 }}>Extractions</h3>
          </div>
          <p className="text-muted">View extraction results and citations</p>
        </Link>

        <Link to="/reviews" className="card hover-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <CheckSquare size={24} color="#10b981" />
            <h3 style={{ margin: 0 }}>Reviews</h3>
          </div>
          <p className="text-muted">Review and validate extracted data</p>
        </Link>
      </div>
    </div>
  );
}
