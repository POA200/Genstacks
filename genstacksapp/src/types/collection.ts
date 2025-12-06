export interface TraitVariant {
  name: string;
  fileName: string;
  assetId: string;
  weight: number;
  rarityPercent: number;
}

export interface TraitLayer {
  name: string;
  order: number;
  totalWeight: number;
  variants: TraitVariant[];
  exclusionRules?: string[];
}

export interface CollectionConfig {
  id: string;
  creatorAddress: string;
  name: string;
  size: number;
  symbol: string;
  metadataBaseUri: string;
  layers: TraitLayer[];
  isConfigured: boolean;
}

export interface GenerationStatus {
  status: 'PENDING' | 'GENERATING' | 'COMPLETE' | 'FAILED';
  progressPercent: number;
  currentImage: number;
  totalImages: number;
  finalDownloadCID?: string;
  errorMessage?: string;
}
