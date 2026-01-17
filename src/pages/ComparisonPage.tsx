import type React from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Trophy, RefreshCw } from "lucide-react"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import { useProposalComparison } from "../hooks/useProposals"
import { formatCurrency, getScoreColor, formatScore } from "../utils/formatters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useState } from "react"

const ComparisonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: comparisonData, isLoading, error } = useProposalComparison(id!)
  const queryClient = useQueryClient()
  const [regenerating, setRegenerating] = useState(false)

  const comparison = comparisonData?.data

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading proposal comparison..." />
      </div>
    )
  }

  if (error || !comparison) {
    return (
      <ErrorMessage title="Failed to load comparison" message={error?.message || "Comparison data not available"} />
    )
  }

  const { proposals } = comparison
  const aiRecommendation = comparison.aiRecommendations

  if (!proposals || proposals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to={`/rfps/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{comparison.rfpTitle}</h1>
            <p className="text-muted-foreground mt-1">Proposal Comparison</p>
          </div>
        </div>

        <Card>
          <div className="text-center py-16">
            <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Proposals to Compare</h3>
            <p className="text-muted-foreground mb-6">No proposals have been submitted yet</p>
            <Link to={`/rfps/${id}`}>
              <Button variant="outline">Back to RFP Details</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const sortedProposals = [...proposals].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))

  const handleRegenerateComparison = async () => {
    if (!id) return

    setRegenerating(true)
    try {
      // Invalidate and refetch the comparison data
      await queryClient.invalidateQueries({ queryKey: ['proposals', id, 'comparison'] })
      toast.success('Comparison regenerated successfully!')
    } catch (error) {
      toast.error('Failed to regenerate comparison')
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Link to={`/rfps/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{comparison.rfpTitle}</h1>
            <p className="text-muted-foreground mt-1">Proposal Comparison & AI Analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateComparison}
            disabled={regenerating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'Regenerating...' : 'Regenerate Analysis'}
          </Button>
        </div>
      </div>

      {/* AI Recommendation */}
      {aiRecommendation ? (
        <Card className="border-green-200/50 bg-gradient-to-br from-green-50 to-green-50/50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-green-600" />
              AI Recommendation
            </h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {aiRecommendation?.recommendedVendorId
                    ? proposals.find((p) => p.id === aiRecommendation?.recommendedVendorId)?.vendorName
                    : "No recommendation"}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{aiRecommendation?.reasoning}</p>
                <div className="bg-background/50 p-3 rounded border border-border/50">
                  <p className="text-sm text-foreground">{aiRecommendation?.comparisonSummary}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200/50 bg-gradient-to-br from-yellow-50 to-yellow-50/50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
              AI Analysis
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Compare proposals manually using the detailed table below</p>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Detailed Comparison</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Vendor</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">AI Score</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Total Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Delivery</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Payment Terms</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Warranty</th>
                </tr>
              </thead>
              <tbody>
                {sortedProposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className={`border-b border-border hover:bg-muted/30 transition-colors ${
                      aiRecommendation?.recommendedVendorId === proposal.id ? "bg-green-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {aiRecommendation?.recommendedVendorId === proposal.id && (
                          <Trophy className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{proposal.vendorName}</p>
                          <p className="text-xs text-muted-foreground">{proposal.vendorEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-semibold ${getScoreColor(proposal.aiScore || 0)}`}>
                          {formatScore(proposal.aiScore || 0)}
                        </div>
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              (proposal.aiScore || 0) >= 80
                                ? "bg-green-600"
                                : (proposal.aiScore || 0) >= 60
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                            }`}
                            style={{ width: `${proposal.aiScore || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {formatCurrency(proposal.extractedData.totalPrice)}
                    </td>
                    <td className="px-4 py-3 text-foreground">{proposal.extractedData.deliveryDays}d</td>
                    <td className="px-4 py-3 text-foreground">{proposal.extractedData.paymentTerms}</td>
                    <td className="px-4 py-3 text-foreground">{proposal.extractedData.warranty || "N/A"}</td>
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
          <h2 className="text-lg font-semibold text-foreground">Score Ranking</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedProposals.map((proposal) => (
              <div key={proposal.id} className="flex items-center gap-4">
                <div className="w-40 flex-shrink-0">
                  <p className="text-sm font-medium text-foreground truncate">{proposal.vendorName}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          (proposal.aiScore || 0) >= 80
                            ? "bg-green-600"
                            : (proposal.aiScore || 0) >= 60
                              ? "bg-yellow-600"
                              : "bg-red-600"
                        }`}
                        style={{ width: `${proposal.aiScore || 0}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold min-w-12 ${getScoreColor(proposal.aiScore || 0)}`}>
                      {formatScore(proposal.aiScore || 0)}
                    </span>
                  </div>
                </div>
                {aiRecommendation?.recommendedVendorId === proposal.id && (
                  <Badge className="bg-green-100 text-green-700 flex-shrink-0">
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
      <div className="flex justify-end gap-3">
        <Link to={`/rfps/${id}`}>
          <Button variant="outline">Back to RFP</Button>
        </Link>
        <Button>Export Comparison</Button>
      </div>
    </div>
  )
}

export default ComparisonPage
