import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fieldTemplatesApi, projectsApi, FieldTemplate } from '../api';
import { Plus, Trash2, Edit, Layout } from 'lucide-react';
import { format } from 'date-fns';

export default function FieldTemplatesPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FieldTemplate | null>(null);
  const [formData, setFormData] = useState({
    projectId: '',
    fieldName: '',
    fieldType: 'TEXT' as 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN',
    description: '',
    isRequired: false,
  });

  const { data: templates, isLoading } = useQuery({
    queryKey: ['field-templates'],
    queryFn: () => fieldTemplatesApi.getAll(),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<FieldTemplate>) => fieldTemplatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-templates'] });
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fieldTemplatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-templates'] });
      setShowModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fieldTemplatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-templates'] });
    },
  });

  const resetForm = () => {
    setFormData({
      projectId: '',
      fieldName: '',
      fieldType: 'TEXT',
      description: '',
      isRequired: false,
    });
    setEditingTemplate(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (template: FieldTemplate) => {
    setEditingTemplate(template);
    setFormData({
      projectId: template.projectId,
      fieldName: template.fieldName,
      fieldType: template.fieldType as any,
      description: template.description || '',
      isRequired: template.isRequired,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this field template?')) {
      deleteMutation.mutate(id);
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      text: 'badge-info',
      number: 'badge-warning',
      date: 'badge-success',
      boolean: 'badge-default',
    };
    return typeMap[type] || 'badge-default';
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
          <h1>Field Templates</h1>
          <p className="text-muted">Define custom fields to extract from documents</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={20} />
          New Field Template
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Project</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates?.map((template: FieldTemplate) => (
                <tr key={template.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Layout size={18} color="#ec4899" />
                      {template.fieldName}
                    </div>
                  </td>
                  <td>{template.projectId}</td>
                  <td>
                    <span className={`badge ${getTypeBadge(template.fieldType)}`}>
                      {template.fieldType}
                    </span>
                  </td>
                  <td>
                    {template.isRequired ? (
                      <span className="badge badge-error">Required</span>
                    ) : (
                      <span className="badge badge-default">Optional</span>
                    )}
                  </td>
                  <td className="text-muted">{template.description || 'N/A'}</td>
                  <td>{format(new Date(template.createdAt), 'MMM d, yyyy')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(template.id)}
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
              <h2>{editingTemplate ? 'Edit Field Template' : 'New Field Template'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project *</label>
                <select
                  className="form-control"
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  required
                  disabled={!!editingTemplate}
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
                <label>Field Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.fieldName}
                  onChange={(e) =>
                    setFormData({ ...formData, fieldName: e.target.value })
                  }
                  required
                  placeholder="e.g., Contract Date, Party Name"
                />
              </div>
              <div className="form-group">
                <label>Field Type *</label>
                <select
                  className="form-control"
                  value={formData.fieldType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fieldType: e.target.value as any,
                    })
                  }
                  required
                >
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="DATE">Date</option>
                  <option value="BOOLEAN">Boolean</option>
                  <option value="CURRENCY">Currency</option>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="EMAIL">Email</option>
                  <option value="URL">URL</option>
                  <option value="PHONE">Phone</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what this field represents"
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isRequired}
                    onChange={(e) =>
                      setFormData({ ...formData, isRequired: e.target.checked })
                    }
                  />
                  Required field
                </label>
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingTemplate ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
