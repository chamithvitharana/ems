import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAdminAccessPoints } from '../../services/admin';

interface AccessType {
  id: number;
  code: string;
  name: string;
}

interface AccessPointsState {
  accessPoints: AccessType[];
  loading: boolean;
  error: string | null;
}

const initialState: AccessPointsState = {
  accessPoints: [],
  loading: false,
  error: null,
};

export const fetchAccessPoints = createAsyncThunk(
  'accessPoints/fetchAccessPoints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminAccessPoints();
      return response?.data?.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const accessPointsSlice = createSlice({
  name: 'accessPoints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccessPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.accessPoints = action.payload;
      })
      .addCase(fetchAccessPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default accessPointsSlice.reducer;
