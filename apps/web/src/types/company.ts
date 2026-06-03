export interface Company {
  id: string;
  name: string;
  industry: string;
  currency: string;
  location: string;
  isPrimary: boolean;
  symbol: string;
}

export interface CompanyStateProps {
  companies: Company[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;
}
