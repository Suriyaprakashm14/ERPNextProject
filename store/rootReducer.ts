import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import stockReducer from "@/features/stock/stockSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  stock: stockReducer,
});

export type RootReducer = typeof rootReducer;
