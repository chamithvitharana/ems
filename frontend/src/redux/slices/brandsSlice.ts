import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBrands } from '../../services/vehicles';

interface Brand {
  id: number;
  code: string;
  name: string;
}

interface BrandsState {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandsState = {
  brands: [],
  loading: false,
  error: null,
};

export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBrands();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const brandsSlice = createSlice({
  name: 'fetchBrands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default brandsSlice.reducer;
