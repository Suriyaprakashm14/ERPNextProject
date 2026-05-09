"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { signOutThunk } from "@/features/auth/authSlice";
import { LOGIN_ROUTE } from "@/lib/auth-config";
import { useAppDispatch } from "@/store/hooks";

export default function SignOutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSignOut() {
    try {
      await dispatch(signOutThunk()).unwrap();
    } catch {
      return;
    }

    startTransition(() => {
      router.replace(LOGIN_ROUTE);
      router.refresh();
    });
  }

  return (
    <Button
      type="default"
      loading={isPending}
      onClick={() => {
        void handleSignOut();
      }}
    >
      Sign out
    </Button>
  );
}
