import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfpService } from '../services/rfpService';
import { CreateRFPRequest } from '../types/rfp.types';
import toast from 'react-hot-toast';
import { formatAIError } from '../utils/errorFormatter';

export const useRFPs = () => {
  return useQuery({
    queryKey: ['rfps'],
    queryFn: rfpService.getAllRFPs,
  });
};

export const useRFP = (id: string) => {
  return useQuery({
    queryKey: ['rfps', id],
    queryFn: () => rfpService.getRFPById(id),
    enabled: !!id,
  });
};

export const useRFPWithVendors = (id: string) => {
  return useQuery({
    queryKey: ['rfps', id, 'vendors'],
    queryFn: () => rfpService.getRFPWithVendors(id),
    enabled: !!id,
  });
};

export const usePreviewRFP = () => {
  return useMutation({
    mutationFn: (data: CreateRFPRequest) => rfpService.previewRFP(data),
    onError: (error: Error) => {
      toast.error(formatAIError(error));
    },
  });
};

export const useCreateRFP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRFPRequest) => rfpService.createRFP(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
      toast.success('RFP created successfully!');
      return response;
    },
    onError: (error: Error) => {
      toast.error(formatAIError(error));
    },
  });
};

export const useSendRFP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { vendorIds: string[] } }) =>
      rfpService.sendRFPToVendors(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['rfps', id] });
      toast.success('RFP sent successfully!');
      return response;
    },
    onError: (error: Error) => {
      toast.error(formatAIError(error));
    },
  });
};

export const useDeleteRFP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rfpService.deleteRFP(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
      toast.success('RFP deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(formatAIError(error));
    },
  });
};

export const useCheckProposals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rfpId: string) => rfpService.checkForProposals(rfpId),
    onSuccess: (response, rfpId) => {
      queryClient.invalidateQueries({ queryKey: ['proposals', rfpId] });
      
      const count = response?.data?.processedCount || 0;
      if (count > 0) {
        toast.success(`Found and processed ${count} proposal${count > 1 ? 's' : ''}!`);
      } else {
        toast.success('No new proposals found. The webhook handles inbound emails automatically.');
      }
    },
    onError: (error: Error) => {
      toast.error(formatAIError(error));
    },
  });
};