import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  _count?: {
    documents: number;
    fieldTemplates: number;
    extractions: number;
  };
}

export interface Document {
  id: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  format: 'PDF' | 'DOCX' | 'HTML' | 'TXT';
  uploadedAt: string;
  parsedAt?: string;
  parsedText?: string;
  metadata?: any;
}

export interface FieldTemplate {
  id: string;
  projectId: string;
  fieldName: string;
  fieldType: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'CURRENCY' | 'PERCENTAGE' | 'EMAIL' | 'URL' | 'PHONE';
  description?: string;
  isRequired: boolean;
  validationRules?: any;
  normalizationRules?: any;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Extraction {
  id: string;
  projectId: string;
  documentId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  extractedFields?: ExtractedField[];
}

export interface ExtractedField {
  id: string;
  extractionId: string;
  fieldTemplateId: string;
  rawValue?: string;
  normalizedValue?: string;
  confidence: number;
  extractedAt: string;
  fieldTemplate?: FieldTemplate;
  citations?: Citation[];
  review?: Review;
}

export interface Citation {
  id: string;
  extractedFieldId: string;
  documentId: string;
  startPosition?: number;
  endPosition?: number;
  pageNumber?: number;
  textSnippet?: string;
}

export interface Review {
  id: string;
  extractedFieldId: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'MANUAL_UPDATED' | 'MISSING_DATA';
  manualValue?: string;
  reviewerNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// API Functions

// Projects
export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  getStatistics: (id: string) => api.get(`/projects/${id}/statistics`),
  create: (data: Partial<Project>) => api.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.patch<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Documents
export const documentsApi = {
  getAll: (projectId?: string) => 
    api.get<Document[]>('/documents', { params: { projectId } }),
  getById: (id: string) => api.get<Document>(`/documents/${id}`),
  upload: (file: File, projectId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    return api.post<Document>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  create: (data: Partial<Document>) => api.post<Document>('/documents', data),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

// Field Templates
export const fieldTemplatesApi = {
  getAll: (projectId?: string) => 
    api.get<FieldTemplate[]>('/field-templates', { params: { projectId } }),
  getById: (id: string) => api.get<FieldTemplate>(`/field-templates/${id}`),
  create: (data: Partial<FieldTemplate>) => api.post<FieldTemplate>('/field-templates', data),
  update: (id: string, data: Partial<FieldTemplate>) => 
    api.patch<FieldTemplate>(`/field-templates/${id}`, data),
  delete: (id: string) => api.delete(`/field-templates/${id}`),
};

// Extractions
export const extractionsApi = {
  getAll: (params?: { projectId?: string; documentId?: string }) => 
    api.get<Extraction[]>('/extractions', { params }),
  getById: (id: string) => api.get<Extraction>(`/extractions/${id}`),
  start: (data: { projectId: string; documentId: string }) => 
    api.post<Extraction>('/extractions/start', data),
  complete: (id: string, data: { extractedFields: any[] }) => 
    api.post<Extraction>(`/extractions/${id}/complete`, data),
  markFailed: (id: string, errorMessage: string) => 
    api.patch<Extraction>(`/extractions/${id}/fail`, { errorMessage }),
};

// Reviews
export const reviewsApi = {
  getAll: (params?: { extractionId?: string; status?: string }) => 
    api.get<Review[]>('/reviews', { params }),
  getById: (id: string) => api.get<Review>(`/reviews/${id}`),
  getByExtractedField: (extractedFieldId: string) => 
    api.get<Review>(`/reviews/extracted-field/${extractedFieldId}`),
  update: (id: string, data: Partial<Review>) => 
    api.patch<Review>(`/reviews/${id}`, data),
  getStatistics: (projectId: string) => 
    api.get(`/reviews/statistics/${projectId}`),
  getProgress: (projectId: string) => 
    api.get(`/reviews/progress/${projectId}`),
};

// Health Check
export const healthApi = {
  check: () => api.get('/health'),
};
