import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfpService } from '../services/rfpService';
import { CreateRFPRequest, SendRFPRequest } from '../types/rfp.types';
import toast from 'react-hot-toast';

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
      toast.error(`Failed to preview RFP: ${error.message}`);
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
      toast.error(`Failed to create RFP: ${error.message}`);
    },
  });
};

export const useSendRFP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SendRFPRequest }) =>
      rfpService.sendRFPToVendors(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['rfps', id, 'vendors'] });
      toast.success(`RFP sent to ${response.data.sentCount} vendor(s)!`);
      return response;
    },
    onError: (error: Error) => {
      toast.error(`Failed to send RFP: ${error.message}`);
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
      toast.error(`Failed to delete RFP: ${error.message}`);
    },
  });
};

export const useCheckProposals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rfpService.checkForProposals(id),
    onSuccess: (response, id) => {
      const result = response.data;
      queryClient.invalidateQueries({ queryKey: ['proposals', id] });
      
      if (result.processedCount > 0) {
        toast.success(`Found and processed ${result.processedCount} new proposal(s)!`);
      } else if (result.errors.length > 0 && result.errors[0].includes('haven\'t responded')) {
        toast.success(result.errors[0]);
      } else {
        toast.success(`All vendors have responded or webhook will process inbound emails automatically.`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to check proposals: ${error.message}`);
    },
  });
};