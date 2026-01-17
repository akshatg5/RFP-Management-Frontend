export interface RFPItem {
  name: string;
  quantity: number;
  specifications?: Record<string, any>;
}

export interface StructuredRFP {
  title: string;
  description: string;
  items: RFPItem[];
  budget?: number;
  deliveryDays?: number;
  paymentTerms?: string;
  warrantyYears?: number;
  additionalRequirements?: string[];
}

export interface RFP {
  id: string;
  title: string;
  rawPrompt: string;
  structuredData: StructuredRFP;
  budget?: number;
  deliveryDays?: number;
  paymentTerms?: string;
  warrantyYears?: number;
  createdAt: string;
}

export interface RFPWithVendors extends RFP {
  vendors: RFPVendor[];
}

export interface RFPVendor {
  id: string;
  name: string;
  email: string;
  status: 'SENT' | 'RESPONDED' | 'DRAFT';
  sentAt?: string;
}

export interface CreateRFPRequest {
  naturalLanguagePrompt: string;
}

export interface CreateRFPResponse {
  success: boolean;
  data: RFP;
}

export interface SendRFPRequest {
  vendorIds: string[];
}

export interface SendRFPResponse {
  success: boolean;
  data: {
    success: boolean;
    sentCount: number;
    failedVendors: string[];
  };
}

export interface RFPListResponse {
  success: boolean;
  data: RFP[];
}