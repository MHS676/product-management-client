import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, extractionsApi, Review } from '../api';
import { Plus, CheckCircle, XCircle, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    extractionId: '',
    reviewerName: '',
    comments: '',
    status: 'approved' as 'approved' | 'rejected',
  });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewsApi.getAll(),
  });

  const { data: extractions } = useQuery({
    queryKey: ['extractions'],
    queryFn: () => extractionsApi.getAll(),
  });

  // Reviews are created automatically with extractions, so we only update them

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      reviewsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setShowModal(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      extractionId: '',
      reviewerName: '',
      comments: '',
      status: 'approved',
    });
    setEditingReview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      updateMutation.mutate({ id: editingReview.id, data: formData });
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      extractionId: review.extractedFieldId,
      reviewerName: review.reviewedBy || '',
      comments: review.reviewerNotes || '',
      status: review.status as any,
    });
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'badge-warning',
      CONFIRMED: 'badge-success',
      REJECTED: 'badge-error',
      MANUAL_UPDATED: 'badge-info',
      MISSING_DATA: 'badge-default',
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
          <h1>Reviews</h1>
          <p className="text-muted">Review and validate extracted information</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={20} />
          New Review
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Reviewer</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Reviewed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map((review: Review) => (
                <tr key={review.id}>
                  <td>Extracted Field {review.extractedFieldId}</td>
                  <td>{review.reviewedBy || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {review.status === 'CONFIRMED' ? (
                        <CheckCircle size={18} color="#10b981" />
                      ) : (
                        <XCircle size={18} color="#ef4444" />
                      )}
                      <span className={`badge ${getStatusBadge(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-muted">{review.reviewerNotes || 'No comments'}</td>
                  <td>{review.reviewedAt ? format(new Date(review.reviewedAt), 'MMM d, yyyy HH:mm') : 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(review)}
                    >
                      <Edit size={16} />
                    </button>
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
              <h2>{editingReview ? 'Edit Review' : 'New Review'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Extraction *</label>
                <select
                  className="form-control"
                  value={formData.extractionId}
                  onChange={(e) =>
                    setFormData({ ...formData, extractionId: e.target.value })
                  }
                  required
                  disabled={!!editingReview}
                >
                  <option value="">Select an extraction</option>
                  {extractions?.map((extraction: any) => (
                    <option key={extraction.id} value={extraction.id}>
                      {extraction.documentId} - {extraction.status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Reviewer Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.reviewerName}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewerName: e.target.value })
                  }
                  required
                  placeholder="Enter reviewer name"
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as any,
                    })
                  }
                  required
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comments</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  placeholder="Add review comments..."
                />
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
                  disabled={updateMutation.isPending}
                >
                  {editingReview ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
