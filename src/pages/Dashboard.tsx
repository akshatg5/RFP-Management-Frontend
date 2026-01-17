import type React from "react"
import { Link } from "react-router-dom"
import { FileText, Users, TrendingUp, Plus, Eye, BarChart3, ArrowRight } from "lucide-react"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import { formatDate, formatCurrency } from "../utils/formatters"
import { useRFPs } from "../hooks/useRFPs"
import { useVendors } from "../hooks/useVendors"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const Dashboard: React.FC = () => {
  const { data: rfpsData, isLoading: rfpsLoading, error: rfpsError } = useRFPs()
  const { data: vendorsData, isLoading: vendorsLoading } = useVendors()

  const rfps = rfpsData?.data || []
  const vendors = vendorsData?.data || []

  const totalRFPs = rfps.length
  const sentRFPs = rfps.filter((rfp) => rfp.structuredData).length
  const totalVendors = vendors.length
  const recentRFPs = rfps.slice(0, 5)

  const isLoading = rfpsLoading || vendorsLoading

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  if (rfpsError) {
    return <ErrorMessage title="Failed to load dashboard" message={rfpsError.message} />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your RFP overview</p>
        </div>
        <Link to="/rfps/create">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Create New RFP
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total RFPs</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalRFPs}</p>
                <p className="text-xs text-muted-foreground mt-2">Active in system</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Sent RFPs</p>
                <p className="text-3xl font-bold text-foreground mt-2">{sentRFPs}</p>
                <p className="text-xs text-muted-foreground mt-2">Awaiting responses</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Vendors</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalVendors}</p>
                <p className="text-xs text-muted-foreground mt-2">In your network</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent RFPs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Recent RFPs</h2>
            <Link to="/rfps">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentRFPs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No RFPs yet</h3>
              <p className="text-muted-foreground mb-6">Create your first RFP to get started</p>
              <Link to="/rfps/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFP
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRFPs.map((rfp) => (
                <div
                  key={rfp.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">{rfp.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rfp.structuredData?.budget
                        ? `Budget: ${formatCurrency(rfp.structuredData.budget)}`
                        : "No budget set"}{" "}
                      • Created {formatDate(rfp.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link to={`/rfps/${rfp.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/rfps/${rfp.id}/compare`}>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-50/50 border-blue-200/50 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Link to="/rfps/create">
              <div className="flex items-start justify-between cursor-pointer group">
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                    Create New RFP
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Use AI to generate structured RFPs in seconds</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-50/50 border-green-200/50 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <Link to="/vendors">
              <div className="flex items-start justify-between cursor-pointer group">
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-green-600 transition-colors">
                    Manage Vendors
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Add and organize your vendor contacts</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
