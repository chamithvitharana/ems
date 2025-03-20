import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getVehicleTypes } from '../../services/vehicles';

interface VehicleType {
  id: number;
  code: string;
  name: string;
}

interface VehicleTypesState {
  vehicleTypes: VehicleType[];
  loading: boolean;
  error: string | null;
}

const initialState: VehicleTypesState = {
  vehicleTypes: [],
  loading: false,
  error: null,
};

export const fetchVehicleTypes = createAsyncThunk(
  'vehicleTypes/fetchVehicleTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVehicleTypes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const vehicleTypesSlice = createSlice({
  name: 'vehicleTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleTypes = action.payload;
      })
      .addCase(fetchVehicleTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default vehicleTypesSlice.reducer;
