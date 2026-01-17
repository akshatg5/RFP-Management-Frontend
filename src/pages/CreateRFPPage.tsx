import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Wand2, FileText, Save, X } from "lucide-react"
import ErrorMessage from "../components/common/ErrorMessage"
import { useCreateRFP } from "../hooks/useRFPs"
import { validateRFPData } from "../utils/validators"
import { formatCurrency } from "../utils/formatters"
import type { RFP } from "../types/rfp.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const CreateRFPPage: React.FC = () => {
  const navigate = useNavigate()
  const createRFP = useCreateRFP()

  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState("")
  const [generatedRFP, setGeneratedRFP] = useState<RFP | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleGenerateRFP = async () => {
    const validation = validateRFPData({ naturalLanguagePrompt })
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setValidationErrors([])

    try {
      const response = await createRFP.mutateAsync({ naturalLanguagePrompt })
      setGeneratedRFP(response.data)
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleSaveRFP = () => {
    if (generatedRFP) {
      navigate(`/rfps/${generatedRFP.id}`)
    }
  }

  const handleCancel = () => {
    navigate("/rfps")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/rfps")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to RFPs
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create RFP</h1>
            <p className="text-muted-foreground mt-1">Use natural language to generate a structured RFP</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Wand2 className="h-5 w-5 mr-2 text-primary" />
              Natural Language Input
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Describe your procurement needs
                </label>
                <textarea
                  value={naturalLanguagePrompt}
                  onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                  placeholder="Example: I need 50 laptops with 16GB RAM, budget $75,000, delivery in 30 days, with 2-year warranty and training included..."
                  rows={8}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">{naturalLanguagePrompt.length} characters</p>
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <ul className="text-sm text-destructive space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={handleGenerateRFP} className="w-full" disabled={!naturalLanguagePrompt.trim()} size="lg">
                <Wand2 className="h-4 w-4 mr-2" />
                {createRFP.isPending ? "Generating RFP..." : "Generate RFP with AI"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Structured Preview
            </h2>
          </CardHeader>
          <CardContent>
            {!generatedRFP ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">RFP Preview</h3>
                <p className="text-muted-foreground text-sm">
                  Enter your requirements and click "Generate RFP" to see the preview
                </p>
              </div>
            ) : createRFP.isError ? (
              <ErrorMessage
                title="Failed to generate RFP"
                message={createRFP.error?.message || "An error occurred"}
                onRetry={handleGenerateRFP}
              />
            ) : (
              <div className="space-y-6">
                {/* Title and Description */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{generatedRFP.structuredData.title}</h3>
                  <p className="text-sm text-muted-foreground">{generatedRFP.structuredData.description}</p>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Budget</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {generatedRFP.structuredData.budget ? formatCurrency(generatedRFP.structuredData.budget) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Delivery</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {generatedRFP.structuredData.deliveryDays
                        ? `${generatedRFP.structuredData.deliveryDays}d`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Payment</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {generatedRFP.structuredData.paymentTerms || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Warranty</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {generatedRFP.structuredData.warrantyYears
                        ? `${generatedRFP.structuredData.warrantyYears}y`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Items */}
                {generatedRFP.structuredData.items && generatedRFP.structuredData.items.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-foreground mb-3">Items Required</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {generatedRFP.structuredData.items.map((item, index) => (
                        <div key={index} className="p-2 bg-muted/50 rounded border border-border/50">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button onClick={handleSaveRFP} className="flex-1" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Save RFP
                  </Button>
                  <Button variant="outline" onClick={handleCancel} size="lg">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateRFPPage
