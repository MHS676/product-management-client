import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../api';
import { FileText, FolderOpen, Layout, Search, CheckSquare, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { data: health, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => healthApi.check(),
    retry: 3,
  });

  const features = [
    {
      icon: FolderOpen,
      title: 'Projects',
      description: 'Organize and manage legal document review projects',
      link: '/projects',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: FileText,
      title: 'Documents',
      description: 'Upload and process legal documents for review',
      link: '/documents',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: Layout,
      title: 'Field Templates',
      description: 'Define custom fields to extract from documents',
      link: '/field-templates',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      icon: Search,
      title: 'Extractions',
      description: 'View and manage extracted field data with citations',
      link: '/extractions',
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      icon: CheckSquare,
      title: 'Reviews',
      description: 'Review and validate extracted information',
      link: '/reviews',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Legal Document Review System</h1>
          <p className="mt-2 text-lg text-gray-600">
            Professional document analysis and review platform
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <Loader2 className="animate-spin" size={20} />
            <span className="font-medium">Connecting...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle size={20} />
            <span className="font-medium">Backend Offline</span>
          </div>
        )}
        {health && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Backend: {health.status}</span>
          </div>
        )}
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{feature.title}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
            </Link>
          );
        })}
      </div>

      {/* System Information */}
      {health && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-sm text-gray-500">Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-lg font-medium text-gray-900">{health.status}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-gray-500">Service</span>
              <p className="text-lg font-medium text-gray-900">{health.service}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-gray-500">Timestamp</span>
              <p className="text-lg font-medium text-gray-900">
                {new Date(health.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats (Example) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-blue-100 text-sm">Total Projects</p>
          <p className="text-3xl font-bold mt-2">-</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-purple-100 text-sm">Documents</p>
          <p className="text-3xl font-bold mt-2">-</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <p className="text-amber-100 text-sm">Extractions</p>
          <p className="text-3xl font-bold mt-2">-</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm">Reviews</p>
          <p className="text-3xl font-bold mt-2">-</p>
        </div>
      </div>
    </div>
  );
}
