
export interface WhaleAlert {
  id: string;
  type: 'whale' | 'dolphin' | 'small_fish';
  amount: number;
  price: number;
  from: string;
  to: string;
  timestamp: number;
  txHash: string;
}

export interface TechnicalParams {
  whypeAddress: string;
  precompileAddress: string;
  spotIndex: number;
  szDecimals: number;
  thresholds: {
    whale: number;
    dolphin: number;
    small_fish: number;
  };
}

export interface AnalysisResult {
  summary: string;
  obsoleteInfo: string;
  suggestions: string;
}
