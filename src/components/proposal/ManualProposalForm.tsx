import React, { useState } from 'react';
import { X, Mail, FileText } from 'lucide-react';
import { useProcessProposal } from '../../hooks/useProposals';
import { isValidEmail } from '../../utils/validators';
import Button from '../common/Button';

interface ManualProposalFormProps {
  isOpen: boolean;
  onClose: () => void;
  rfpId: string;
}

const ManualProposalForm: React.FC<ManualProposalFormProps> = ({
  isOpen,
  onClose,
  rfpId
}) => {
  const processProposal = useProcessProposal();

  const [vendorEmail, setVendorEmail] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    if (!vendorEmail || !isValidEmail(vendorEmail)) {
      errors.push('Please provide a valid vendor email address');
    }

    if (!emailBody.trim()) {
      errors.push('Please provide the email body content');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    try {
      await processProposal.mutateAsync({
        rfpId,
        data: { vendorEmail, emailBody }
      });
      onClose();
      // Reset form
      setVendorEmail('');
      setEmailBody('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleClose = () => {
    setVendorEmail('');
    setEmailBody('');
    setValidationErrors([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Process Manual Proposal</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manually input vendor proposal details for AI processing
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Email *
                </label>
                <input
                  type="email"
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="vendor@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Body *
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Paste the full email content from the vendor proposal here..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {emailBody.length} characters
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">AI Processing</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      The system will use AI to analyze this email, extract pricing information,
                      terms, and generate a comprehensive proposal evaluation.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleSubmit}
              loading={processProposal.isPending}
              className="w-full sm:w-auto sm:ml-3"
            >
              <Mail className="h-4 w-4 mr-2" />
              Process Proposal
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualProposalForm;