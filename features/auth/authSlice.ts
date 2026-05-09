import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
  AuthUser,
  LogoutResponse,
  SessionResponse,
  SignInPayload,
  SignInResponse,
} from "./authTypes";
import api from "@/lib/api";

export type AuthStatus = "idle" | "loading" | "authenticated" | "anonymous";

export type AuthState = {
  user: AuthUser | null;
  authenticated: boolean;
  status: AuthStatus;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  authenticated: false,
  status: "idle",
  error: null,
};

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { error?: string; message?: string };

    return (
      data?.error ??
      data?.message ??
      "Unable to complete the authentication request."
    );
  }

  return error instanceof Error
    ? error.message
    : "Unable to complete the authentication request.";
}

export const signInThunk = createAsyncThunk<
  SignInResponse,
  SignInPayload,
  { rejectValue: string }
>("auth/signIn", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<SignInResponse>("/api/auth/login", credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const signOutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/signOut", async (_, { rejectWithValue }) => {
  try {
    await api.post<LogoutResponse>("/api/auth/logout");
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const getSessionThunk = createAsyncThunk<
  SessionResponse,
  void,
  { rejectValue: string }
>("auth/getSession", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<SessionResponse>("/api/auth/session", {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.authenticated = action.payload.authenticated;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.status = "anonymous";
        state.authenticated = false;
        state.user = null;
        state.error =
          action.payload ?? action.error.message ?? "Unable to sign in.";
      })
      .addCase(signOutThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.status = "anonymous";
        state.authenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state.status = state.authenticated ? "authenticated" : "anonymous";
        state.error =
          action.payload ?? action.error.message ?? "Unable to sign out.";
      })
      .addCase(getSessionThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSessionThunk.fulfilled, (state, action) => {
        state.status = action.payload.authenticated
          ? "authenticated"
          : "anonymous";
        state.authenticated = action.payload.authenticated;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getSessionThunk.rejected, (state, action) => {
        state.status = "anonymous";
        state.authenticated = false;
        state.user = null;
        state.error =
          action.payload ??
          action.error.message ??
          "Unable to load the session.";
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
