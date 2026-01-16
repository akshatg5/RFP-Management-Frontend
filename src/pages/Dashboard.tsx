import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  MessageSquare,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatDate, formatCurrency } from '../utils/formatters';
import { useRFPs } from '../hooks/useRFPs';
import { useVendors } from '../hooks/useVendors';

const Dashboard: React.FC = () => {
  const { data: rfpsData, isLoading: rfpsLoading, error: rfpsError } = useRFPs();
  const { data: vendorsData, isLoading: vendorsLoading } = useVendors();

  const rfps = rfpsData?.data || [];
  const vendors = vendorsData?.data || [];

  // Calculate statistics
  const totalRFPs = rfps.length;
  const sentRFPs = rfps.filter(rfp => rfp.structuredData).length; // Simplified calculation
  const totalVendors = vendors.length;

  // Get recent RFPs (last 5)
  const recentRFPs = rfps.slice(0, 5);

  const isLoading = rfpsLoading || vendorsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (rfpsError) {
    return (
      <ErrorMessage
        title="Failed to load dashboard"
        message={rfpsError.message}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your RFP management system</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/rfps/create">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create RFP
            </Button>
          </Link>
          <Link to="/vendors">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalRFPs}</div>
            <p className="text-sm text-gray-600">Total RFPs</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{sentRFPs}</div>
            <p className="text-sm text-gray-600">RFPs Sent</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalVendors}</div>
            <p className="text-sm text-gray-600">Total Vendors</p>
          </CardBody>
        </Card>
      </div>

      {/* Recent RFPs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent RFPs</h2>
            <Link to="/rfps">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          {recentRFPs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No RFPs yet</h3>
              <p className="text-gray-600 mb-4">Create your first RFP to get started</p>
              <Link to="/rfps/create">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFP
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRFPs.map((rfp) => (
                <div key={rfp.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{rfp.title}</h3>
                    <p className="text-sm text-gray-600">
                      Budget: {rfp.structuredData?.budget ? formatCurrency(rfp.structuredData.budget) : 'N/A'} •
                      Created: {formatDate(rfp.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/rfps/${rfp.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/rfps/${rfp.id}/compare`}>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Compare
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/rfps/create">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Create New RFP</h3>
                    <p className="text-xs text-gray-600">Use AI to generate structured RFPs</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/vendors">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Manage Vendors</h3>
                    <p className="text-xs text-gray-600">Add and organize your vendor contacts</p>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;