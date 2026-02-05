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
  getAll: async () => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },
  getStatistics: async (id: string) => {
    const response = await api.get(`/projects/${id}/statistics`);
    return response.data;
  },
  create: async (data: Partial<Project>) => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Project>) => {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Documents
export const documentsApi = {
  getAll: async (projectId?: string) => {
    const response = await api.get<Document[]>('/documents', { params: { projectId } });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Document>(`/documents/${id}`);
    return response.data;
  },
  upload: async (file: File, projectId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    const response = await api.post<Document>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  create: async (data: Partial<Document>) => {
    const response = await api.post<Document>('/documents', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

// Field Templates
export const fieldTemplatesApi = {
  getAll: async (projectId?: string) => {
    const response = await api.get<FieldTemplate[]>('/field-templates', { params: { projectId } });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<FieldTemplate>(`/field-templates/${id}`);
    return response.data;
  },
  create: async (data: Partial<FieldTemplate>) => {
    const response = await api.post<FieldTemplate>('/field-templates', data);
    return response.data;
  },
  update: async (id: string, data: Partial<FieldTemplate>) => {
    const response = await api.patch<FieldTemplate>(`/field-templates/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/field-templates/${id}`);
    return response.data;
  },
};

// Extractions
export const extractionsApi = {
  getAll: async (params?: { projectId?: string; documentId?: string }) => {
    const response = await api.get<Extraction[]>('/extractions', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Extraction>(`/extractions/${id}`);
    return response.data;
  },
  start: async (data: { projectId: string; documentId: string }) => {
    const response = await api.post<Extraction>('/extractions/start', data);
    return response.data;
  },
  complete: async (id: string, data: { extractedFields: any[] }) => {
    const response = await api.post<Extraction>(`/extractions/${id}/complete`, data);
    return response.data;
  },
  markFailed: async (id: string, errorMessage: string) => {
    const response = await api.patch<Extraction>(`/extractions/${id}/fail`, { errorMessage });
    return response.data;
  },
};

// Reviews
export const reviewsApi = {
  getAll: async (params?: { extractionId?: string; status?: string }) => {
    const response = await api.get<Review[]>('/reviews', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Review>(`/reviews/${id}`);
    return response.data;
  },
  getByExtractedField: async (extractedFieldId: string) => {
    const response = await api.get<Review>(`/reviews/extracted-field/${extractedFieldId}`);
    return response.data;
  },
  update: async (id: string, data: Partial<Review>) => {
    const response = await api.patch<Review>(`/reviews/${id}`, data);
    return response.data;
  },
  getStatistics: async (projectId: string) => {
    const response = await api.get(`/reviews/statistics/${projectId}`);
    return response.data;
  },
  getProgress: async (projectId: string) => {
    const response = await api.get(`/reviews/progress/${projectId}`);
    return response.data;
  },
};

// Health Check
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};
