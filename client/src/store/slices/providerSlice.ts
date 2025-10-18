/**
 * Slice Redux pour la gestion des prestataires
 * Conforme référentiel DWWM 2023
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Provider {
  id: string;
  name: string;
  description?: string;
  category:
    | "CATERING"
    | "PHOTOGRAPHY"
    | "MUSIC"
    | "DECORATION"
    | "VENUE"
    | "TRANSPORT"
    | "OTHER";
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  logo?: string;
  images: string[];
  priceRange?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProviderState {
  providers: Provider[];
  currentProvider: Provider | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category?: string;
    city?: string;
    priceRange?: string;
    rating?: number;
  };
}

const initialState: ProviderState = {
  providers: [],
  currentProvider: null,
  isLoading: false,
  error: null,
  filters: {},
};

const providerSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload;
    },
    setCurrentProvider: (state, action: PayloadAction<Provider | null>) => {
      state.currentProvider = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<ProviderState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setProviders,
  setCurrentProvider,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = providerSlice.actions;

export default providerSlice.reducer;
