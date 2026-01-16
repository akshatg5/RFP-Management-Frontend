import api from './api';
import {
  Vendor,
  CreateVendorRequest,
  CreateVendorResponse,
  UpdateVendorRequest,
  UpdateVendorResponse,
  VendorListResponse,
  VendorSearchResponse,
} from '../types/vendor.types';

export const vendorService = {
  // Create a new vendor
  createVendor: async (data: CreateVendorRequest): Promise<CreateVendorResponse> => {
    return api.post('/vendors', data);
  },

  // Get all vendors
  getAllVendors: async (): Promise<VendorListResponse> => {
    return api.get('/vendors');
  },

  // Get vendor by ID
  getVendorById: async (id: string): Promise<{ success: boolean; data: Vendor }> => {
    return api.get(`/vendors/${id}`);
  },

  // Update vendor
  updateVendor: async (id: string, data: UpdateVendorRequest): Promise<UpdateVendorResponse> => {
    return api.put(`/vendors/${id}`, data);
  },

  // Delete vendor
  deleteVendor: async (id: string) => {
    return api.delete(`/vendors/${id}`);
  },

  // Search vendors
  searchVendors: async (query: string): Promise<VendorSearchResponse> => {
    return api.get(`/vendors/search/${query}`);
  },
};