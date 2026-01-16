import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, BarChart3, FileText, DollarSign, Calendar, Users, Mail, Plus } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Badge from '../components/common/Badge';
import SendRFPModal from '../components/rfp/SendRFPModal';
import ManualProposalForm from '../components/proposal/ManualProposalForm';
import { useRFPWithVendors } from '../hooks/useRFPs';
import { useProposals as useProposalData } from '../hooks/useProposals';
import { formatDate, formatCurrency } from '../utils/formatters';

const RFPDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: rfpData, isLoading, error } = useRFPWithVendors(id!);
  const { data: proposalsData } = useProposalData(id!);

  const [showSendModal, setShowSendModal] = useState(false);
  const [showManualProposalForm, setShowManualProposalForm] = useState(false);

  const rfp = rfpData?.data;
  const proposals = proposalsData?.data || [];

  const handleSendRFP = () => {
    setShowSendModal(true);
  };

  const handleManualProposal = () => {
    setShowManualProposalForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading RFP details..." />
      </div>
    );
  }

  if (error || !rfp) {
    return (
      <ErrorMessage
        title="Failed to load RFP"
        message={error?.message || 'RFP not found'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/rfps">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to RFPs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{rfp.title}</h1>
            <p className="text-gray-600 mt-1">RFP Details and Management</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSendRFP}>
            <Send className="h-4 w-4 mr-2" />
            Send to Vendors
          </Button>
          <Button variant="outline" onClick={handleManualProposal}>
            <Plus className="h-4 w-4 mr-2" />
            Manual Proposal
          </Button>
          {proposals.length > 0 && (
            <Link to={`/rfps/${id}/compare`}>
              <Button variant="primary">
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare Proposals ({proposals.length})
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* RFP Overview */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">RFP Overview</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {rfp.budget ? formatCurrency(rfp.budget) : 'N/A'}
              </div>
              <p className="text-sm text-gray-600">Budget</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {rfp.deliveryDays || 'N/A'}
              </div>
              <p className="text-sm text-gray-600">Delivery Days</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {rfp.vendors?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Vendors</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {proposals.length}
              </div>
              <p className="text-sm text-gray-600">Proposals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-700">{rfp.structuredData.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Terms</p>
                  <p className="text-gray-700">{rfp.paymentTerms || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Warranty</p>
                  <p className="text-gray-700">
                    {rfp.warrantyYears ? `${rfp.warrantyYears} years` : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Items Required</h3>
              {rfp.structuredData.items && rfp.structuredData.items.length > 0 ? (
                <div className="space-y-3">
                  {rfp.structuredData.items.map((item, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.specifications && Object.keys(item.specifications).length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500">Specifications:</p>
                          <ul className="text-xs text-gray-600 ml-4">
                            {Object.entries(item.specifications).map(([key, value]) => (
                              <li key={key} className="capitalize">{key}: {String(value)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No items specified</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Vendors Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Vendors</h2>
        </CardHeader>
        <CardBody>
          {rfp.vendors && rfp.vendors.length > 0 ? (
            <div className="space-y-3">
              {rfp.vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{vendor.name}</h3>
                      <p className="text-sm text-gray-600">{vendor.email}</p>
                      {vendor.sentAt && (
                        <p className="text-xs text-gray-500">
                          Sent {formatDate(vendor.sentAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={vendor.status === 'RESPONDED' ? 'success' : 'secondary'}>
                    {vendor.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors assigned</h3>
              <p className="text-gray-600">Send this RFP to vendors to receive proposals</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Proposals Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Proposals Received</h2>
        </CardHeader>
        <CardBody>
          {proposals.length > 0 ? (
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{proposal.vendorName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        Score: {proposal.aiScore}/100
                      </span>
                      <Badge variant="success">AI Processed</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Total: {formatCurrency(proposal.extractedData.totalPrice)} •
                    Delivery: {proposal.extractedData.deliveryDays} days •
                    Received: {formatDate(proposal.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {proposal.aiEvaluation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals received</h3>
              <p className="text-gray-600">
                Proposals will appear here once vendors respond to your RFP
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Send RFP Modal */}
      <SendRFPModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        rfpId={id!}
        rfpTitle={rfp?.title || ''}
      />

      {/* Manual Proposal Form Modal */}
      <ManualProposalForm
        isOpen={showManualProposalForm}
        onClose={() => setShowManualProposalForm(false)}
        rfpId={id!}
      />
    </div>
  );
};

export default RFPDetailPage;