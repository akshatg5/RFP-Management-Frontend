import React, { useState, useEffect } from 'react';
import { X, Search, Mail, Check } from 'lucide-react';
import { useSendRFP } from '../../hooks/useRFPs';
import { useVendors } from '../../hooks/useVendors';
import { Vendor } from '../../types/vendor.types';
import Button from '../common/Button';
import Loading from '../common/Loading';

interface SendRFPModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfpId: string;
  rfpTitle: string;
}

const SendRFPModal: React.FC<SendRFPModalProps> = ({
  isOpen,
  onClose,
  rfpId,
  rfpTitle
}) => {
  const { data: vendorsData, isLoading: vendorsLoading } = useVendors();
  const sendRFP = useSendRFP();

  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);

  const vendors = vendorsData?.data || [];

  useEffect(() => {
    if (vendors.length > 0) {
      const filtered = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVendors(filtered);
    }
  }, [vendors, searchTerm]);

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendorIds(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVendorIds(filteredVendors.map(vendor => vendor.id));
  };

  const handleDeselectAll = () => {
    setSelectedVendorIds([]);
  };

  const handleSend = async () => {
    if (selectedVendorIds.length === 0) return;

    try {
      await sendRFP.mutateAsync({
        id: rfpId,
        data: { vendorIds: selectedVendorIds }
      });
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Send RFP to Vendors</h3>
                <p className="text-sm text-gray-600 mt-1">{rfpTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Select All/Deselect All */}
            <div className="flex space-x-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={filteredVendors.length === 0}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
              >
                Deselect All
              </Button>
            </div>

            {/* Vendor List */}
            <div className="max-h-96 overflow-y-auto">
              {vendorsLoading ? (
                <div className="flex justify-center py-8">
                  <Loading size="md" text="Loading vendors..." />
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? 'No vendors match your search' : 'No vendors available'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredVendors.map((vendor) => {
                    const isSelected = selectedVendorIds.includes(vendor.id);
                    return (
                      <div
                        key={vendor.id}
                        onClick={() => handleVendorToggle(vendor.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                            <p className="text-sm text-gray-600">{vendor.email}</p>
                            {vendor.notes && (
                              <p className="text-xs text-gray-500 mt-1">{vendor.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleSend}
              loading={sendRFP.isPending}
              disabled={selectedVendorIds.length === 0}
              className="w-full sm:w-auto sm:ml-3"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send to {selectedVendorIds.length} Vendor{selectedVendorIds.length !== 1 ? 's' : ''}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
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

export default SendRFPModal;