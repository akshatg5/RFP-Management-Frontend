import api from './api';
import {
  Proposal,
  ProcessProposalRequest,
  ProcessProposalResponse,
  ProposalComparisonResponse,
  ProposalStatsResponse,
  ProposalListResponse,
} from '../types/proposal.types';

export const proposalService = {
  // Get proposal by ID
  getProposalById: async (id: string): Promise<{ success: boolean; data: Proposal }> => {
    return api.get(`/proposals/${id}`);
  },

  // Get proposals by RFP ID
  getProposalsByRFP: async (rfpId: string): Promise<ProposalListResponse> => {
    return api.get(`/proposals/rfp/${rfpId}`);
  },

  // Process manual proposal
  processProposal: async (rfpId: string, data: ProcessProposalRequest): Promise<ProcessProposalResponse> => {
    return api.post(`/rfps/${rfpId}/proposals`, data);
  },

  // Compare proposals for RFP
  compareProposals: async (rfpId: string): Promise<ProposalComparisonResponse> => {
    return api.get(`/rfps/${rfpId}/compare`);
  },

  // Get proposal statistics
  getProposalStats: async (rfpId: string): Promise<ProposalStatsResponse> => {
    return api.get(`/proposals/rfp/${rfpId}/stats`);
  },

  // Delete proposal
  deleteProposal: async (id: string) => {
    return api.delete(`/proposals/${id}`);
  },
};