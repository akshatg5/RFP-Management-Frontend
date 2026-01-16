import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Send,
  BarChart3,
  Trash2,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Badge from '../components/common/Badge';
import { useRFPs, useDeleteRFP } from '../hooks/useRFPs';
import { formatDate, formatCurrency } from '../utils/formatters';

const RFPsPage: React.FC = () => {
  const { data: rfpsData, isLoading, error, refetch } = useRFPs();
  const deleteRFP = useDeleteRFP();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'sent' | 'draft'>('all');

  const rfps = rfpsData?.data || [];

  // Filter and search RFPs
  const filteredRFPs = rfps.filter(rfp => {
    const matchesSearch = rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfp.rawPrompt.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;

    // For now, we'll consider all RFPs as sent since we don't have status tracking
    // This would need to be updated based on actual RFP status from the backend
    return matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this RFP?')) {
      try {
        await deleteRFP.mutateAsync(id);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading RFPs..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load RFPs"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RFPs</h1>
          <p className="text-gray-600 mt-1">Manage your Request for Proposals</p>
        </div>
        <Link to="/rfps/create">
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Create RFP
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search RFPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'sent' | 'draft')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All RFPs</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* RFPs List */}
      <div className="space-y-4">
        {filteredRFPs.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filter !== 'all' ? 'No matching RFPs found' : 'No RFPs yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first RFP to get started with the system'
                }
              </p>
              <Link to="/rfps/create">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFP
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          filteredRFPs.map((rfp) => (
            <Card key={rfp.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{rfp.title}</h3>
                      <Badge variant="secondary">Draft</Badge>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {rfp.rawPrompt}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{rfp.budget ? formatCurrency(rfp.budget) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{rfp.deliveryDays ? `${rfp.deliveryDays} days` : 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>0 vendors</span> {/* This would need to be calculated */}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Created {formatDate(rfp.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Link to={`/rfps/${rfp.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Send to Vendors
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Compare Proposals
                    </Button>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(rfp.id)}
                    loading={deleteRFP.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RFPsPage;