import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { useProposalComparison } from '../hooks/useProposals';
import { formatCurrency, getScoreColor, formatScore } from '../utils/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ComparisonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: comparisonData, isLoading, error } = useProposalComparison(id!);

  const comparison = comparisonData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading proposal comparison..." />
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <ErrorMessage
        title="Failed to load comparison"
        message={error?.message || 'Comparison data not available'}
      />
    );
  }

  const { proposals } = comparison;
  const aiRecommendation = comparison.aiRecommendation;

  // Check if there are proposals to compare
  if (!proposals || proposals.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/rfps/${id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to RFP
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{comparison.rfpTitle}</h1>
              <p className="text-gray-600 mt-1">Proposal Comparison & AI Recommendation</p>
            </div>
          </div>
        </div>

        {/* No Proposals Message */}
        <Card>
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Proposals to Compare</h3>
            <p className="text-gray-600 mb-6">
              There are no proposals submitted for this RFP yet. Once vendors submit proposals,
              you can compare them here and get AI-powered recommendations.
            </p>
            <Link to={`/rfps/${id}`}>
              <Button variant="default">
                Back to RFP Details
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Sort proposals by AI score (highest first)
  const sortedProposals = [...proposals].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to={`/rfps/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to RFP
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{comparison.rfpTitle}</h1>
            <p className="text-gray-600 mt-1">Proposal Comparison & AI Recommendation</p>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      {aiRecommendation ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-green-600" />
              AI Recommendation
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Recommended: {aiRecommendation?.recommendedVendorId ?
                      (proposals.find(p => p.id === aiRecommendation?.recommendedVendorId)?.vendorName || 'Unknown Vendor') :
                      'No recommendation available'
                    }
                  </h3>
                  <p className="text-gray-700 mb-3">{aiRecommendation?.reasoning || 'No reasoning provided'}</p>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-gray-900 mb-2">Comparison Summary</h4>
                    <p className="text-sm text-gray-700">{aiRecommendation?.comparisonSummary || 'No summary available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
              AI Recommendation Unavailable
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    AI recommendation is currently unavailable. You can still compare proposals manually using the table below.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Detailed Comparison</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Terms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warranty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Evaluation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProposals.map((proposal, index) => (
                  <tr key={proposal.id} className={index === 0 ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {aiRecommendation && aiRecommendation.recommendedVendorId === proposal.id && (
                            <Trophy className="h-5 w-5 text-green-600 mr-2" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {proposal.vendorName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {proposal.vendorEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`text-lg font-semibold ${getScoreColor(proposal.aiScore || 0)}`}>
                          {formatScore(proposal.aiScore || 0)}
                        </div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (proposal.aiScore || 0) >= 80 ? 'bg-green-600' :
                          (proposal.aiScore || 0) >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${proposal.aiScore || 0}%` }}
                      />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(proposal.extractedData.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proposal.extractedData.deliveryDays} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proposal.extractedData.paymentTerms}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proposal.extractedData.warranty || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="line-clamp-3">
                        {proposal.aiEvaluation}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Score Visualization */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Score Visualization</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedProposals.map((proposal) => (
              <div key={proposal.id} className="flex items-center space-x-4">
                <div className="w-32 flex-shrink-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {proposal.vendorName}
                  </div>
                </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                              className={`h-4 rounded-full ${
                                (proposal.aiScore || 0) >= 80 ? 'bg-green-600' :
                                (proposal.aiScore || 0) >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${proposal.aiScore || 0}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium min-w-[60px] ${getScoreColor(proposal.aiScore || 0)}`}>
                            {formatScore(proposal.aiScore || 0)}
                          </span>
                        </div>
                      </div>
                {aiRecommendation && aiRecommendation.recommendedVendorId === proposal.id && (
                  <Badge variant="default" className="flex-shrink-0">
                    <Trophy className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Link to={`/rfps/${id}`}>
          <Button variant="outline">
            Back to RFP Details
          </Button>
        </Link>
        <Button variant="default">
          Export Comparison
        </Button>
      </div>
    </div>
  );
};

export default ComparisonPage;