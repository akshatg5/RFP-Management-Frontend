// Frontend hooks for email management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailService } from '../services/emailService';
import toast from 'react-hot-toast';
import { formatAIError } from '../utils/errorFormatter';

export const useUnprocessedEmails = (rfpId?: string) => {
  return useQuery({
    queryKey: rfpId ? ['emails', 'unprocessed', rfpId] : ['emails', 'unprocessed'],
    queryFn: () => emailService.getUnprocessedEmails(rfpId),
    enabled: !!rfpId,
  });
};

export const useReparseEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => emailService.reparseEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails', 'unprocessed'] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Email re-parsed successfully!');
    },
    onError: (error: Error) => {
      toast.error(formatAIError(error));
    },
  });
};
