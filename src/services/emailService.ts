// Frontend email service
import api from './api';

export interface InboundEmail {
  id: string;
  emailId: string;
  from: string;
  subject: string;
  rawBody: string;
  rfpId: string | null;
  vendorId: string | null;
  processed: boolean;
  processingError: string | null;
  proposalId: string | null;
  createdAt: string;
  processedAt: string | null;
  rfp?: {
    id: string;
    title: string;
  };
  vendor?: {
    id: string;
    name: string;
    email: string;
  };
}

export const emailService = {
  // Get all unprocessed emails
  getUnprocessedEmails: async (rfpId?: string) => {
    const params = rfpId ? `?rfpId=${rfpId}` : '';
    return api.get(`/emails/inbound/unprocessed${params}`);
  },

  // Re-parse a stored email
  reparseEmail: async (id: string) => {
    return api.post(`/emails/inbound/${id}/reparse`);
  },
};
