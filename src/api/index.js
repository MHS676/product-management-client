import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});
// API Functions
// Projects
export const projectsApi = {
    getAll: async () => {
        const response = await api.get('/projects');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },
    getStatistics: async (id) => {
        const response = await api.get(`/projects/${id}/statistics`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/projects', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/projects/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },
};
// Documents
export const documentsApi = {
    getAll: async (projectId) => {
        const response = await api.get('/documents', { params: { projectId } });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    },
    upload: async (file, projectId) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);
        const response = await api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/documents', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },
};
// Field Templates
export const fieldTemplatesApi = {
    getAll: async (projectId) => {
        const response = await api.get('/field-templates', { params: { projectId } });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/field-templates/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/field-templates', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/field-templates/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/field-templates/${id}`);
        return response.data;
    },
};
// Extractions
export const extractionsApi = {
    getAll: async (params) => {
        const response = await api.get('/extractions', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/extractions/${id}`);
        return response.data;
    },
    start: async (data) => {
        const response = await api.post('/extractions/start', data);
        return response.data;
    },
    complete: async (id, data) => {
        const response = await api.post(`/extractions/${id}/complete`, data);
        return response.data;
    },
    markFailed: async (id, errorMessage) => {
        const response = await api.patch(`/extractions/${id}/fail`, { errorMessage });
        return response.data;
    },
};
// Reviews
export const reviewsApi = {
    getAll: async (params) => {
        const response = await api.get('/reviews', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/reviews/${id}`);
        return response.data;
    },
    getByExtractedField: async (extractedFieldId) => {
        const response = await api.get(`/reviews/extracted-field/${extractedFieldId}`);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/reviews/${id}`, data);
        return response.data;
    },
    getStatistics: async (projectId) => {
        const response = await api.get(`/reviews/statistics/${projectId}`);
        return response.data;
    },
    getProgress: async (projectId) => {
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
