import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalService } from '../services/proposalService';
import { ProcessProposalRequest } from '../types/proposal.types';
import toast from 'react-hot-toast';

export const useProposals = (rfpId?: string) => {
  return useQuery({
    queryKey: rfpId ? ['proposals', rfpId] : ['proposals', 'all'],
    queryFn: () => rfpId ? proposalService.getProposalsByRFP(rfpId) : proposalService.getAllProposals(),
    enabled: rfpId ? !!rfpId : true,
  });
};

export const useAllProposals = () => {
  return useQuery({
    queryKey: ['proposals', 'all'],
    queryFn: () => proposalService.getAllProposals(),
  });
};

export const useProposal = (id: string) => {
  return useQuery({
    queryKey: ['proposals', 'single', id],
    queryFn: () => proposalService.getProposalById(id),
    enabled: !!id,
  });
};

export const useProposalComparison = (rfpId: string) => {
  return useQuery({
    queryKey: ['proposals', rfpId, 'comparison'],
    queryFn: () => proposalService.compareProposals(rfpId),
    enabled: !!rfpId,
  });
};

export const useProposalStats = (rfpId: string) => {
  return useQuery({
    queryKey: ['proposals', rfpId, 'stats'],
    queryFn: () => proposalService.getProposalStats(rfpId),
    enabled: !!rfpId,
  });
};

export const useProcessProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rfpId, data }: { rfpId: string; data: ProcessProposalRequest }) =>
      proposalService.processProposal(rfpId, data),
    onSuccess: (response, { rfpId }) => {
      queryClient.invalidateQueries({ queryKey: ['proposals', rfpId] });
      queryClient.invalidateQueries({ queryKey: ['proposals', rfpId, 'comparison'] });
      toast.success('Proposal processed successfully!');
      return response;
    },
    onError: (error: Error) => {
      toast.error(`Failed to process proposal: ${error.message}`);
    },
  });
};

export const useDeleteProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalService.deleteProposal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Proposal deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete proposal: ${error.message}`);
    },
  });
};