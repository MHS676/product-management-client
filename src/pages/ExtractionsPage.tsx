import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { extractionsApi, documentsApi, Extraction } from '../api';
import { Play, Eye, Trash2, FileText, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function ExtractionsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExtraction, setSelectedExtraction] = useState<Extraction | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState('');

  const { data: extractions, isLoading } = useQuery({
    queryKey: ['extractions'],
    queryFn: extractionsApi.getAll,
  });

  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: extractionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extractions'] });
      setShowModal(false);
      setSelectedDocumentId('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: extractionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extractions'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocumentId) {
      createMutation.mutate({ documentId: selectedDocumentId });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this extraction?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetails = (extraction: Extraction) => {
    setSelectedExtraction(extraction);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'badge-default',
      processing: 'badge-warning',
      completed: 'badge-success',
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
          <h1>Extractions</h1>
          <p className="text-muted">View and manage field extractions from documents</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Play size={20} />
          Start Extraction
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Status</th>
                <th>Fields Extracted</th>
                <th>Started</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {extractions?.map((extraction) => (
                <tr key={extraction.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} color="#8b5cf6" />
                      {extraction.document?.fileName || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(extraction.status)}`}>
                      {extraction.status}
                    </span>
                  </td>
                  <td>{extraction.extractedFields?.length || 0}</td>
                  <td>{format(new Date(extraction.startedAt), 'MMM d, yyyy HH:mm')}</td>
                  <td>
                    {extraction.completedAt
                      ? format(new Date(extraction.completedAt), 'MMM d, yyyy HH:mm')
                      : 'N/A'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleViewDetails(extraction)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(extraction.id)}
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
              <h2>Start Extraction</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Document *</label>
                <select
                  className="form-control"
                  value={selectedDocumentId}
                  onChange={(e) => setSelectedDocumentId(e.target.value)}
                  required
                >
                  <option value="">Select a document</option>
                  {documents?.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fileName} - {doc.project?.name}
                    </option>
                  ))}
                </select>
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
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Starting...' : 'Start'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedExtraction && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Extraction Details</h2>
              <button className="btn-close" onClick={() => setShowDetailModal(false)}>
                ×
              </button>
            </div>
            <div>
              <div className="info-grid" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <span className="text-muted">Document:</span>
                  <span>{selectedExtraction.document?.fileName}</span>
                </div>
                <div>
                  <span className="text-muted">Status:</span>
                  <span className={`badge ${getStatusBadge(selectedExtraction.status)}`}>
                    {selectedExtraction.status}
                  </span>
                </div>
                <div>
                  <span className="text-muted">Started:</span>
                  <span>{format(new Date(selectedExtraction.startedAt), 'PPpp')}</span>
                </div>
                {selectedExtraction.completedAt && (
                  <div>
                    <span className="text-muted">Completed:</span>
                    <span>{format(new Date(selectedExtraction.completedAt), 'PPpp')}</span>
                  </div>
                )}
              </div>

              <h3>Extracted Fields ({selectedExtraction.extractedFields?.length || 0})</h3>
              {selectedExtraction.extractedFields && selectedExtraction.extractedFields.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Field Name</th>
                        <th>Value</th>
                        <th>Confidence</th>
                        <th>Citations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedExtraction.extractedFields.map((field: any) => (
                        <tr key={field.id}>
                          <td>{field.fieldTemplate?.fieldName || 'N/A'}</td>
                          <td><code>{field.value}</code></td>
                          <td>
                            {field.confidence ? (
                              <span className={`badge ${
                                field.confidence >= 0.8 ? 'badge-success' :
                                field.confidence >= 0.5 ? 'badge-warning' : 'badge-error'
                              }`}>
                                {(field.confidence * 100).toFixed(0)}%
                              </span>
                            ) : 'N/A'}
                          </td>
                          <td>{field.citations?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">No extracted fields yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
