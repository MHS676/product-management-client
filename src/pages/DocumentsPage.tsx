import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi, projectsApi, Document } from '../api';
import { Upload, FileText, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentsApi.getAll(),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      documentsApi.upload(file, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowModal(false);
      setSelectedFile(null);
      setSelectedProjectId('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && selectedProjectId) {
      uploadMutation.mutate({ projectId: selectedProjectId, file: selectedFile });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownload = (doc: Document) => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/documents/${doc.id}/download`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      uploaded: 'badge-info',
      processing: 'badge-warning',
      processed: 'badge-success',
      failed: 'badge-error',
    };
    return statusMap[status] || 'badge-default';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p className="text-muted">Upload and manage legal documents</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Upload size={20} />
          Upload Document
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Project</th>
                <th>Format</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents?.map((doc: Document) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} color="#8b5cf6" />
                      {doc.fileName}
                    </div>
                  </td>
                  <td>{doc.projectId}</td>
                  <td>
                    <span className="badge badge-info">
                      {doc.format}
                    </span>
                  </td>
                  <td>{(doc.fileSize / 1024).toFixed(2)} KB</td>
                  <td>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleDownload(doc)}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Document</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project *</label>
                <select
                  className="form-control"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  required
                >
                  <option value="">Select a project</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>File *</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.html"
                  required
                />
                <small className="text-muted">
                  Supported formats: PDF, DOC, DOCX, HTML
                </small>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
