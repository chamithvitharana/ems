import { combineReducers } from '@reduxjs/toolkit';
import vehicleTypesReducer from './slices/vehicleTypeSlice';
import brandsReducer from './slices/brandsSlice';
import fuelTypeReducer from './slices/fuelTypeSlice';
import accessPointReducer from './slices/accesspointSlice';

const rootReducer = combineReducers({
  vehicleTypes: vehicleTypesReducer,
  brands: brandsReducer,
  fuelTypes: fuelTypeReducer,
  accessPoints: accessPointReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
