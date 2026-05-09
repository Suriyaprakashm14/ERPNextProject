import type { ReactNode } from "react";

import AppShell from "@/components/layout/AppShell";
import { requireAuthenticatedUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireAuthenticatedUser();

  return (
    <AppShell
      user={{
        fullName: user.fullName,
        email: user.email,
      }}
    >
      {children}
    </AppShell>
  );
}
