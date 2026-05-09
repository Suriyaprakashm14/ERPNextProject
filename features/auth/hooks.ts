"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { clearAuthError, signInThunk } from "./authSlice";
import { selectAuthError } from "./authSelectors";
import type { SignInPayload } from "./authTypes";
import { getSafeRedirectPath } from "@/lib/auth-config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useSignIn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const error = useAppSelector(selectAuthError);

  async function submit(credentials: SignInPayload) {
    const result = await dispatch(signInThunk(credentials)).unwrap();
    const nextPath = getSafeRedirectPath(searchParams.get("next"));

    startTransition(() => {
      router.replace(nextPath);
      router.refresh();
    });

    return result;
  }

  return {
    error,
    isPending,
    submit,
    clearError: () => dispatch(clearAuthError()),
  };
}
