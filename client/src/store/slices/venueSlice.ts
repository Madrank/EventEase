/**
 * Slice Redux pour la gestion des lieux
 * Conforme référentiel DWWM 2023
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  capacity: number;
  pricePerDay?: number;
  amenities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

interface VenueState {
  venues: Venue[];
  currentVenue: Venue | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    city?: string;
    capacity?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    amenities?: string[];
    rating?: number;
  };
}

const initialState: VenueState = {
  venues: [],
  currentVenue: null,
  isLoading: false,
  error: null,
  filters: {},
};

const venueSlice = createSlice({
  name: "venues",
  initialState,
  reducers: {
    setVenues: (state, action: PayloadAction<Venue[]>) => {
      state.venues = action.payload;
    },
    setCurrentVenue: (state, action: PayloadAction<Venue | null>) => {
      state.currentVenue = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<VenueState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setVenues,
  setCurrentVenue,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = venueSlice.actions;

export default venueSlice.reducer;
