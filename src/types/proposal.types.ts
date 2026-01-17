export interface ProposalItem {
  name: string;
  quantity: number;
  price: number;
  specifications?: Record<string, any>;
}

export interface ExtractedProposalData {
  items: ProposalItem[];
  totalPrice: number;
  deliveryDays: number;
  paymentTerms: string;
  warranty?: string;
}

export interface Proposal {
  id: string;
  rfpId: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  rawEmailBody: string;
  extractedData: ExtractedProposalData;
  aiScore: number | null;
  aiEvaluation: string | null;
  usedFallbackParsing: boolean;
  inboundEmailId?: string;
  createdAt: string;
}

export interface ProcessProposalRequest {
  vendorEmail: string;
  emailBody: string;
}

export interface ProcessProposalResponse {
  success: boolean;
  data: {
    success: boolean;
    proposalId: string;
  };
}

export interface ProposalComparisonResponse {
  success: boolean;
  data: {
    rfpId: string;
    rfpTitle: string;
    proposals: Proposal[];
    aiRecommendation: {
      recommendedVendorId: string;
      reasoning: string;
      comparisonSummary: string;
    };
  };
}

export interface ProposalStats {
  totalProposals: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  topVendor: {
    name: string;
    score: number;
  };
}

export interface ProposalStatsResponse {
  success: boolean;
  data: ProposalStats;
}

export interface ProposalListResponse {
  success: boolean;
  data: Proposal[];
}