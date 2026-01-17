import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, Plus, Eye, Send, BarChart3, Trash2, Calendar, DollarSign, Users } from "lucide-react"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import { useRFPs, useDeleteRFP } from "../hooks/useRFPs"
import { formatDate, formatCurrency } from "../utils/formatters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const RFPsPage: React.FC = () => {
  const { data: rfpsData, isLoading, error, refetch } = useRFPs()
  const deleteRFP = useDeleteRFP()
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "sent" | "draft">("all")

  const rfps = rfpsData?.data || []

  const filteredRFPs = rfps.filter((rfp) => {
    const matchesSearch =
      rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.rawPrompt.toLowerCase().includes(searchTerm.toLowerCase())
    return filter === "all" ? matchesSearch : matchesSearch
  })

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this RFP?")) {
      try {
        await deleteRFP.mutateAsync(id)
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading RFPs..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage title="Failed to load RFPs" message={error.message} onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">RFPs</h1>
          <p className="text-muted-foreground mt-2">Manage your Request for Proposals</p>
        </div>
        <Link to="/rfps/create">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create RFP
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search RFPs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "sent" | "draft")}
                className="px-3 py-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value="all">All RFPs</option>
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFPs List */}
      <div className="space-y-4">
        {filteredRFPs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm || filter !== "all" ? "No matching RFPs found" : "No RFPs yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first RFP to get started with the system"}
              </p>
              <Link to="/rfps/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFP
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredRFPs.map((rfp) => (
            <Card key={rfp.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{rfp.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">{rfp.rawPrompt}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-3 border-t border-b border-border/50">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">
                        {rfp.structuredData?.budget ? formatCurrency(rfp.structuredData.budget) : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">
                        {rfp.structuredData?.deliveryDays ? `${rfp.structuredData.deliveryDays}d` : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">0 vendors</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Created At : {formatDate(rfp.createdAt)}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-2">
                      <Link to={`/rfps/${rfp.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Compare
                      </Button>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(rfp.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default RFPsPage
