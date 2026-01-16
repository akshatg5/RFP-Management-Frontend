import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2, FileText, Save, X } from 'lucide-react';
import ErrorMessage from '../components/common/ErrorMessage';
import { useCreateRFP } from '../hooks/useRFPs';
import { validateRFPData } from '../utils/validators';
import { formatCurrency } from '../utils/formatters';
import { RFP } from '../types/rfp.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const CreateRFPPage: React.FC = () => {
  const navigate = useNavigate();
  const createRFP = useCreateRFP();

  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
  const [generatedRFP, setGeneratedRFP] = useState<RFP | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleGenerateRFP = async () => {
    const validation = validateRFPData({ naturalLanguagePrompt });
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);

    try {
      const response = await createRFP.mutateAsync({ naturalLanguagePrompt });
      setGeneratedRFP(response.data);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleSaveRFP = () => {
    if (generatedRFP) {
      navigate(`/rfps/${generatedRFP.id}`);
    }
  };

  const handleCancel = () => {
    navigate('/rfps');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/rfps')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to RFPs
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create RFP</h1>
          <p className="text-gray-600 mt-1">Use natural language to generate a structured RFP</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Wand2 className="h-5 w-5 mr-2 text-blue-600" />
              Natural Language Input
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your procurement needs
                </label>
                <textarea
                  value={naturalLanguagePrompt}
                  onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                  placeholder="Example: I need 50 laptops with 16GB RAM, budget $75,000, delivery in 30 days, with 2-year warranty and training included..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {naturalLanguagePrompt.length} characters
                </p>
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <ul className="text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={handleGenerateRFP}
                className="w-full"
                disabled={!naturalLanguagePrompt.trim()}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {createRFP.isPending ? 'AI is structuring your RFP...' : 'Generate RFP'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Structured RFP Preview
            </h2>
          </CardHeader>
          <CardContent>
            {!generatedRFP ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">RFP Preview</h3>
                <p className="text-gray-600">
                  Enter your requirements above and click "Generate RFP" to see the structured preview
                </p>
              </div>
            ) : createRFP.isError ? (
              <ErrorMessage
                title="Failed to generate RFP"
                message={createRFP.error?.message || 'An error occurred while generating the RFP'}
                onRetry={handleGenerateRFP}
              />
            ) : (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {generatedRFP.structuredData.title}
                  </h3>
                  <p className="text-gray-600">
                    {generatedRFP.structuredData.description}
                  </p>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {generatedRFP.structuredData.budget
                        ? formatCurrency(generatedRFP.structuredData.budget)
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Time</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {generatedRFP.structuredData.deliveryDays
                        ? `${generatedRFP.structuredData.deliveryDays} days`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Terms</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {generatedRFP.structuredData.paymentTerms || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Warranty</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {generatedRFP.structuredData.warrantyYears
                        ? `${generatedRFP.structuredData.warrantyYears} years`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                </div>

                {/* Items */}
                {generatedRFP.structuredData.items && generatedRFP.structuredData.items.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Items</h4>
                    <div className="space-y-3">
                      {generatedRFP.structuredData.items.map((item, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              {item.specifications && Object.keys(item.specifications).length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Specifications:</p>
                                  <ul className="text-sm text-gray-600 ml-4">
                                    {Object.entries(item.specifications).map(([key, value]) => (
                                      <li key={key} className="capitalize">
                                        {key}: {String(value)}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Requirements */}
                {generatedRFP.structuredData.additionalRequirements && generatedRFP.structuredData.additionalRequirements.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Requirements</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {generatedRFP.structuredData.additionalRequirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="default"
                    onClick={handleSaveRFP}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save RFP
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
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
  );
};

export default CreateRFPPage;