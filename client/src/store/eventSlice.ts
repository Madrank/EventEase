import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventService } from 'services/event.service';
import { Event, PaginatedResponse } from 'types';

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  myEvents: Event[];
  pagination: { total: number; page: number; limit: number; totalPages: number } | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  currentEvent: null,
  myEvents: [],
  pagination: null,
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (params?: { page?: number; limit?: number; search?: string; category?: string; city?: string; status?: string }) => {
    return await eventService.findAll(params);
  },
);

export const fetchEvent = createAsyncThunk('events/fetchOne', async (id: string) => {
  return await eventService.findOne(id);
});

export const fetchMyEvents = createAsyncThunk('events/fetchMy', async () => {
  return await eventService.getMyEvents();
});

export const createEvent = createAsyncThunk('events/create', async (data: Partial<Event>) => {
  return await eventService.create(data);
});

export const updateEvent = createAsyncThunk('events/update', async ({ id, data }: { id: string; data: Partial<Event> }) => {
  return await eventService.update(id, data);
});

export const deleteEvent = createAsyncThunk('events/delete', async (id: string) => {
  await eventService.delete(id);
  return id;
});

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent(state) {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur';
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.myEvents = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const idx = state.events.findIndex((e) => e.id === action.payload.id);
        if (idx >= 0) state.events[idx] = action.payload;
        if (state.currentEvent?.id === action.payload.id) state.currentEvent = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
        state.myEvents = state.myEvents.filter((e) => e.id !== action.payload);
      });
  },
});

export const { clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
