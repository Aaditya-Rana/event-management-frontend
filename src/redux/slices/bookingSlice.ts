import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/api/axios";
import { Booking } from "@/types/bookings";

export interface BookingPagination {
  total: number;
  page: number;
  totalPages: number;
}

export interface BookingState {
  bookings: Booking[];
  pagination: BookingPagination | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  pagination: null,
  status: "idle",
  error: null,
};

export const bookEvent = createAsyncThunk(
  "booking/book",
  async ({ eventId, seats }: { eventId: string; seats: number }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/bookings", { eventId, seats });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Booking failed");
    }
  }
);

export const fetchMyBookings = createAsyncThunk("booking/myBookings", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/bookings/me");
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetching my bookings failed");
  }
});

export const fetchBookingsByEvent = createAsyncThunk(
  "booking/byEvent",
  async (eventId: string, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/bookings/admin/event/${eventId}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetching bookings by event failed"
      );
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  "booking/all",
  async (query: string = "", thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/bookings/admin${query}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetching all bookings failed"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Book event
      .addCase(bookEvent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(bookEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings.push(action.payload);
      })
      .addCase(bookEvent.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // My bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload.bookings;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Something went wrong";
      })

      // Bookings by event
      .addCase(fetchBookingsByEvent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBookingsByEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
        state.pagination = null;
      })
      .addCase(fetchBookingsByEvent.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // All bookings (admin)
      .addCase(fetchAllBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload.bookings;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchAllBookings.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
