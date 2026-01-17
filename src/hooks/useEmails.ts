// Frontend hooks for email management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailService } from '../services/emailService';
import toast from 'react-hot-toast';

export const useUnprocessedEmails = (rfpId?: string) => {
  return useQuery({
    queryKey: ['unprocessedEmails', rfpId],
    queryFn: () => emailService.getUnprocessedEmails(rfpId),
  });
};

export const useReparseEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => emailService.reparseEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unprocessedEmails'] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Email re-parsed successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to re-parse email: ${error.message}`);
    },
  });
};
