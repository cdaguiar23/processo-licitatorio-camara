export type BiddingType = 'dispensa' | 'inexigibilidade' | 'pregao' | 'tomada-precos';

export interface BiddingTypeInfo {
  id: BiddingType;
  name: string;
}

export interface FormData {
  processNumber: string;
  description: string;
  justification: string;
  department: string;
}