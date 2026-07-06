export type SystemType = 'on-grid' | 'off-grid' | 'hybrid';

export interface SolarCalculation {
  recommendedCapacityKw: number;
  estimatedPanels: number;
  estimatedCostInr: number;
  estimatedAnnualSavingsInr: number;
  paybackYears: number;
  carbonOffsetKg: number;
  systemType: SystemType;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  monthlyBill?: number;
  roofAreaSqFt?: number;
  calculation?: SolarCalculation;
  status: 'new' | 'contacted' | 'completed';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
