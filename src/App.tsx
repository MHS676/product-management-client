import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DocumentsPage from './pages/DocumentsPage';
import FieldTemplatesPage from './pages/FieldTemplatesPage';
import ExtractionsPage from './pages/ExtractionsPage';
import ReviewsPage from './pages/ReviewsPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/field-templates" element={<FieldTemplatesPage />} />
        <Route path="/extractions" element={<ExtractionsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
    </Layout>
  );
}
