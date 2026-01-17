import type React from "react"
import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Send, BarChart3, FileText, DollarSign, Calendar, Users, Mail, Plus, RefreshCw, AlertCircle, RotateCw, Trash2 } from "lucide-react"
import Loading from "../components/common/Loading"
import ErrorMessage from "../components/common/ErrorMessage"
import SendRFPModal from "../components/rfp/SendRFPModal"
import ManualProposalForm from "../components/proposal/ManualProposalForm"
import { useRFPWithVendors, useCheckProposals } from "../hooks/useRFPs"
import { useProposals as useProposalData } from "../hooks/useProposals"
import { useUnprocessedEmails, useReparseEmail } from "../hooks/useEmails"
import { useDeleteProposal } from "../hooks/useProposals"
import { formatCurrency } from "../utils/formatters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const RFPDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: rfpData, isLoading, error } = useRFPWithVendors(id!)
  const { data: proposalsData } = useProposalData(id!)
  const checkProposals = useCheckProposals()
  const { data: unprocessedEmailsData } = useUnprocessedEmails(id)
  const reparseEmail = useReparseEmail()
  const deleteProposal = useDeleteProposal()

  const [showSendModal, setShowSendModal] = useState(false)
  const [showManualProposalForm, setShowManualProposalForm] = useState(false)

  const rfp = rfpData?.data
  const proposals = proposalsData?.data || []
  const unprocessedEmails = unprocessedEmailsData?.data || []

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading size="lg" text="Loading RFP details..." />
      </div>
    )
  }

  if (error || !rfp) {
    return <ErrorMessage title="Failed to load RFP" message={error?.message || "RFP not found"} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/rfps">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{rfp.title}</h1>
            <p className="text-muted-foreground mt-1">RFP Details & Management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSendModal(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send to Vendors
          </Button>
          <Button variant="outline" onClick={() => setShowManualProposalForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Proposal
          </Button>
          {proposals.length > 0 && (
            <Link to={`/rfps/${id}/compare`}>
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare ({proposals.length})
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-foreground">
              {rfp.structuredData?.budget ? formatCurrency(rfp.structuredData.budget) : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">Budget</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-2">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-lg font-bold text-foreground">{rfp.structuredData?.deliveryDays || "N/A"}</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mb-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-lg font-bold text-foreground">{rfp.vendors?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Vendors</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mb-2">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-foreground">{proposals.length}</p>
            <p className="text-xs text-muted-foreground">Proposals</p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requirements */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Requirements</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Description</p>
              <p className="text-sm text-foreground mt-1">{rfp.structuredData.description}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Payment Terms</p>
              <p className="text-sm text-foreground mt-1">{rfp.structuredData?.paymentTerms || "Not specified"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Warranty</p>
              <p className="text-sm text-foreground mt-1">
                {rfp.structuredData?.warrantyYears ? `${rfp.structuredData.warrantyYears} years` : "Not specified"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Items Required</h3>
          </CardHeader>
          <CardContent>
            {rfp.structuredData.items && rfp.structuredData.items.length > 0 ? (
              <div className="space-y-3">
                {rfp.structuredData.items.slice(0, 5).map((item, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                    <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No items specified</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vendors */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Assigned Vendors ({rfp.vendors?.length || 0})</h3>
        </CardHeader>
        <CardContent>
          {rfp.vendors && rfp.vendors.length > 0 ? (
            <div className="space-y-3">
              {rfp.vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-foreground">{vendor.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{vendor.email}</p>
                    </div>
                  </div>
                  <Badge variant={vendor.status === "RESPONDED" ? "default" : "secondary"} className="flex-shrink-0">
                    {vendor.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No vendors assigned yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Proposals Received ({proposals.length})</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => checkProposals.mutate(id!)}
              disabled={checkProposals.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${checkProposals.isPending ? 'animate-spin' : ''}`} />
              {checkProposals.isPending ? 'Checking...' : 'Check for Proposals'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {proposals.length > 0 ? (
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <div 
                  key={proposal.id} 
                  className={`p-4 rounded-lg border ${
                    proposal.usedFallbackParsing 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-muted/30 border-border/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground">{proposal.vendorName}</h3>
                      {proposal.usedFallbackParsing && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Needs AI Re-parse
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {proposal.aiScore && (
                        <Badge className="bg-blue-100 text-blue-700">Score: {proposal.aiScore}/100</Badge>
                      )}
                      {proposal.usedFallbackParsing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reparseEmail.mutate(proposal.inboundEmailId ?? "")}
                          disabled={reparseEmail.isPending}
                        >
                          <RotateCw className={`h-3 w-3 mr-1 ${reparseEmail.isPending ? 'animate-spin' : ''}`} />
                          Re-parse
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Delete proposal from ${proposal.vendorName}?`)) {
                            deleteProposal.mutate(proposal.id);
                          }
                        }}
                        disabled={deleteProposal.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(proposal.extractedData.totalPrice)} • {proposal.extractedData.deliveryDays}d
                    delivery
                  </p>
                  {proposal.usedFallbackParsing && (
                    <p className="text-xs text-yellow-700 mt-2">
                      ⚠️ Basic parsing used (AI quota exceeded). Click "Re-parse" for full AI analysis.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No proposals received yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unprocessed Emails */}
      {unprocessedEmails.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-900">
                Unprocessed Emails ({unprocessedEmails.length})
              </h3>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              These emails failed to process (likely due to AI quota limits). Click "Re-parse" to try again.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unprocessedEmails.map((email: any) => (
                <div
                  key={email.id}
                  className="flex items-start justify-between p-4 bg-white rounded-lg border border-yellow-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {email.vendor?.name || email.from}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {new Date(email.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{email.subject}</p>
                    {email.processingError && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        <strong>Error:</strong> {email.processingError.substring(0, 200)}
                        {email.processingError.length > 200 && '...'}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => reparseEmail.mutate(email.id)}
                    disabled={reparseEmail.isPending}
                    className="ml-4"
                  >
                    <RotateCw className={`h-4 w-4 mr-2 ${reparseEmail.isPending ? 'animate-spin' : ''}`} />
                    {reparseEmail.isPending ? 'Re-parsing...' : 'Re-parse'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <SendRFPModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        rfpId={id!}
        rfpTitle={rfp?.title || ""}
      />

      <ManualProposalForm
        isOpen={showManualProposalForm}
        onClose={() => setShowManualProposalForm(false)}
        rfpId={id!}
      />
    </div>
  )
}

export default RFPDetailPage
