import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorService } from '../services/vendorService';
import { CreateVendorRequest, UpdateVendorRequest } from '../types/vendor.types';
import toast from 'react-hot-toast';

export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: vendorService.getAllVendors,
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ['vendors', id],
    queryFn: () => vendorService.getVendorById(id),
    enabled: !!id,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendorRequest) => vendorService.createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create vendor: ${error.message}`);
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendorRequest }) =>
      vendorService.updateVendor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update vendor: ${error.message}`);
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vendorService.deleteVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete vendor: ${error.message}`);
    },
  });
};

export const useSearchVendors = () => {
  return useMutation({
    mutationFn: (query: string) => vendorService.searchVendors(query),
  });
};