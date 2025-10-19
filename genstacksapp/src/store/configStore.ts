// /genstacks/genstacksapp/src/store/configStore.ts

import { create } from 'zustand';

export interface Trait { // <-- ADD export
  name: string; 
  rarity: number; 
}

export interface Layer { // <-- ADD export
  id: string; 
  name: string;
  order: number; 
  traits: Trait[]; 
}

// The main collection configuration state
interface CollectionConfigState {
  // Step 1: Basic Info
  collectionName: string;
  description: string;
  supply: number; // 100 to 10000

  // Step 2: Layer Upload & Ordering
  layers: Layer[];
  isLayersUploaded: boolean;

  // Step 3: Rarity Editing
  isRarityConfigured: boolean;

  // Actions
  setBasicInfo: (name: string, desc: string, supply: number) => void;
  setLayers: (layers: Layer[]) => void;
  updateLayerOrder: (layerId: string, newOrder: number) => void;
  updateTraitRarity: (layerId: string, traitName: string, rarity: number) => void;
  resetConfig: () => void;
}

// /genstacks/genstacksapp/src/store/configStore.ts (Cont.)

// The initial state contains only the data fields (no action functions).
// Explicitly omit the action keys from CollectionConfigState to form the
// initial plain-data state object.
type CollectionDataOnly = Omit<
  CollectionConfigState,
  | 'setBasicInfo'
  | 'setLayers'
  | 'updateLayerOrder'
  | 'updateTraitRarity'
  | 'resetConfig'
>;

const initialConfigState: CollectionDataOnly = {
  collectionName: '',
  description: '',
  supply: 100,
  layers: [],
  isLayersUploaded: false,
  isRarityConfigured: false,
};

export const useCollectionConfigStore = create<CollectionConfigState>((set) => ({
  ...initialConfigState,

  setBasicInfo: (name, desc, supply) => 
    set({ collectionName: name, description: desc, supply }),

  setLayers: (newLayers) => 
    set({ layers: newLayers, isLayersUploaded: true }),

  updateLayerOrder: (layerId, newOrder) =>
    set((state) => ({
      layers: state.layers
        .map(layer => 
          layer.id === layerId ? { ...layer, order: newOrder } : layer
        )
        // Sort the layers visually based on the new order
        .sort((a, b) => a.order - b.order),
    })),

  updateTraitRarity: (layerId, traitName, rarity) =>
    set((state) => ({
      layers: state.layers.map(layer => {
        if (layer.id === layerId) {
          return {
            ...layer,
            traits: layer.traits.map(trait => 
              trait.name === traitName ? { ...trait, rarity } : trait
            ),
          };
        }
        return layer;
      }),
      isRarityConfigured: true,
    })),

  resetConfig: () => set(initialConfigState),
}));