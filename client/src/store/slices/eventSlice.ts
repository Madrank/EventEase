/**
 * Slice Redux pour la gestion des événements
 * Conforme référentiel DWWM 2023
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  capacity?: number;
  budget?: number;
  status: "PLANNING" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  isPublic: boolean;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  organizerId: string;
}

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    setCurrentEvent: (state, action: PayloadAction<Event | null>) => {
      state.currentEvent = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.unshift(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id,
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload,
      );
    },
  },
});

export const {
  setEvents,
  setCurrentEvent,
  setLoading,
  setError,
  addEvent,
  updateEvent,
  removeEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
