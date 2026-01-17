import api from './api';
import {
  RFP,
  CreateRFPRequest,
  CreateRFPResponse,
  RFPListResponse,
  RFPWithVendors,
  SendRFPRequest,
  SendRFPResponse,
  StructuredRFP,
} from '../types/rfp.types';

export const rfpService = {
  // Preview RFP structure without saving to database
  previewRFP: async (data: CreateRFPRequest): Promise<{ success: boolean; data: StructuredRFP }> => {
    return api.post('/rfps/preview', data);
  },

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

  // Manually check for proposals in recent emails
  checkForProposals: async (id: string) => {
    return api.post(`/rfps/${id}/check-proposals`);
  },

  // Delete RFP
  deleteRFP: async (id: string) => {
    return api.delete(`/rfps/${id}`);
  },
};