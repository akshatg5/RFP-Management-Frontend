export interface Vendor {
  id: string;
  name: string;
  email: string;
  notes?: string;
  createdAt: string;
}

export interface CreateVendorRequest {
  name: string;
  email: string;
  notes?: string;
}

export interface UpdateVendorRequest {
  name?: string;
  email?: string;
  notes?: string;
}

export interface CreateVendorResponse {
  success: boolean;
  data: Vendor;
}

export interface UpdateVendorResponse {
  success: boolean;
  data: Vendor;
}

export interface VendorListResponse {
  success: boolean;
  data: Vendor[];
}

export interface VendorSearchResponse {
  success: boolean;
  data: Vendor[];
}