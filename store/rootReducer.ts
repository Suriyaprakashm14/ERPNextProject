import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import buyingReducer from "@/features/buying/buyingSlice";
import stockReducer from "@/features/stock/stockSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  stock: stockReducer,
  buying: buyingReducer,
});

export type RootReducer = typeof rootReducer;
