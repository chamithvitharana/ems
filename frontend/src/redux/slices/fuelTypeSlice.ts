import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFuelTypes } from '../../services/vehicles';

interface FuelType {
  id: number;
  code: string;
  name: string;
}

interface FuelTypesState {
  fuelTypes: FuelType[];
  loading: boolean;
  error: string | null;
}

const initialState: FuelTypesState = {
  fuelTypes: [],
  loading: false,
  error: null,
};

export const fetchFuelTypes = createAsyncThunk(
  'fuelTypes/fetchFuelTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFuelTypes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const fuelTypeSlice = createSlice({
  name: 'fuelTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuelTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuelTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelTypes = action.payload;
      })
      .addCase(fetchFuelTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default fuelTypeSlice.reducer;
