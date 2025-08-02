import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types/category";
import { axiosInstance } from "@/api/axios";

interface CategoryState {
  categories: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  status: "idle",
  error: null,
};

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  "category/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/categories");
      return res.data.data as Category[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const createCategory = createAsyncThunk<Category, FormData, { rejectValue: string }>(
  "category/create",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(formData);
      return res.data as Category;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Category creation failed"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
  "category/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Category deletion failed"
      );
    }
  }
);


const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategoriesState: (state) => {
      state.categories = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch categories";
      })

      // Create
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload || "Failed to create category";
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export const { resetCategoriesState } = categorySlice.actions;
export default categorySlice.reducer;
