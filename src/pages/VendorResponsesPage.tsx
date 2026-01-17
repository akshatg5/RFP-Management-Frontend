import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, Eye, Calendar, DollarSign, User, Building, BarChart3, RefreshCw, CheckCircle } from "lucide-react"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAllProposals } from "../hooks/useProposals"
import { useRFPs } from "../hooks/useRFPs"
import { formatDate, formatCurrency, getScoreColor, formatScore } from "../utils/formatters"

const VendorResponsesPage: React.FC = () => {
  const { data: proposalsData, isLoading, error } = useAllProposals()
  const { data: rfpsData } = useRFPs()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRfp, setSelectedRfp] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "score">("newest")

  const proposals = proposalsData?.data || []
  const rfps = rfpsData?.data || []

  const filteredProposals = proposals
    .filter((proposal) => {
      const matchesSearch =
        proposal.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.vendorEmail.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRfp = selectedRfp === "all" || proposal.rfpId === selectedRfp

      return matchesSearch && matchesRfp
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "score":
          return (b.aiScore || 0) - (a.aiScore || 0)
        default:
          return 0
      }
    })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading vendor responses..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage title="Failed to load responses" message={error.message} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Responses</h1>
          <p className="text-muted-foreground mt-2">Monitor and review all received vendor proposals</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Responses
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{proposals.length}</p>
                <p className="text-xs text-muted-foreground">Total Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {proposals.filter(p => (p.aiScore || 0) >= 80).length}
                </p>
                <p className="text-xs text-muted-foreground">High Score (80+)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <User className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(proposals.map(p => p.vendorId)).size}
                </p>
                <p className="text-xs text-muted-foreground">Unique Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {proposals.length > 0 ? formatDate(proposals[0].createdAt, "MMM dd") : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Latest Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by vendor name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedRfp}
                onChange={(e) => setSelectedRfp(e.target.value)}
                className="px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value="all">All RFPs</option>
                {rfps.map((rfp) => (
                  <option key={rfp.id} value={rfp.id}>
                    {rfp.title}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "score")}
              className="px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score">Highest Score</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Responses List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Building className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm || selectedRfp !== "all" ? "No matching responses found" : "No responses yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedRfp !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Responses will appear here once vendors reply to your RFPs"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredProposals.map((proposal) => {
            const rfp = rfps.find(r => r.id === proposal.rfpId)
            return (
              <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{proposal.vendorName}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getScoreColor(proposal.aiScore || 0)}`}>
                            Score: {formatScore(proposal.aiScore || 0)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{proposal.vendorEmail}</span>
                        </div>

                        {rfp && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{rfp.title}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {proposal.extractedData?.totalPrice
                              ? formatCurrency(proposal.extractedData.totalPrice)
                              : "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatDate(proposal.createdAt)}
                          </span>
                        </div>
                      </div>

                      {proposal.aiEvaluation && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-foreground line-clamp-2">
                            {proposal.aiEvaluation}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/rfps/${proposal.rfpId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View RFP
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default VendorResponsesPage