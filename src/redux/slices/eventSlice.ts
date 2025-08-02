import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/api/axios";
import { Event } from "@/types/event";


interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface EventState {
  events: Event[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination | null;
}

const initialState: EventState = {
  events: [],
  status: "idle",
  error: null,
  pagination: null,
};

// Thunks
export const fetchEvents = createAsyncThunk(
  "event/fetchAll",
  async (query:string = "") => {
    const res = await axiosInstance.get(`/events${query}`);
    return {
      events: res.data.data,
      pagination: res.data.pagination,
    };
  }
);

export const createEvent = createAsyncThunk(
  "event/create",
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Event creation failed"
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/delete",
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Event deletion failed"
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "event/update",
  async ({ id, formData }: { id: string; formData: FormData }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Event update failed"
      );
    }
  }
);

// Slice
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    resetEventState: (state) => {
      state.events = [];
      state.status = "idle";
      state.error = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload.events;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })

      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
      })

      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      });
  },
});

export const { resetEventState } = eventSlice.actions;
export default eventSlice.reducer;
