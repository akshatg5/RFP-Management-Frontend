import api from './api';
import {
  RFP,
  CreateRFPRequest,
  CreateRFPResponse,
  RFPListResponse,
  RFPWithVendors,
  SendRFPRequest,
  SendRFPResponse,
} from '../types/rfp.types';

export const rfpService = {
  // Create a new RFP from natural language
  createRFP: async (data: CreateRFPRequest): Promise<CreateRFPResponse> => {
    return api.post('/rfps', data);
  },

  // Get all RFPs
  getAllRFPs: async (): Promise<RFPListResponse> => {
    return api.get('/rfps');
  },

  // Get RFP by ID
  getRFPById: async (id: string): Promise<{ success: boolean; data: RFP }> => {
    return api.get(`/rfps/${id}`);
  },

  // Get RFP with vendors
  getRFPWithVendors: async (id: string): Promise<{ success: boolean; data: RFPWithVendors }> => {
    return api.get(`/rfps/${id}/vendors`);
  },

  // Send RFP to vendors
  sendRFPToVendors: async (id: string, data: SendRFPRequest): Promise<SendRFPResponse> => {
    return api.post(`/rfps/${id}/send`, data);
  },

  // Compare proposals for an RFP
  compareProposals: async (id: string) => {
    return api.get(`/rfps/${id}/compare`);
  },

  // Delete RFP
  deleteRFP: async (id: string) => {
    return api.delete(`/rfps/${id}`);
  },
};