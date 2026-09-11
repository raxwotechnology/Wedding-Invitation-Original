import { CoupleProvider } from "@/context/CoupleContext";
import { GuestProvider } from "@/context/GuestContext";
import AdminShell from "@/components/admin/AdminShell";

/**
 * Admin section layout — provides couple-name context, the shared guest store,
 * and the unified responsive shell (sidebar on desktop, top-bar + bottom tabs
 * on mobile).
 *
 * GuestProvider wraps AdminShell so BOTH /admin/guests AND /admin/rsvp read
 * from and write to the exact same Guest[] array — they can never desync.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CoupleProvider>
      <GuestProvider>
        <AdminShell>{children}</AdminShell>
      </GuestProvider>
    </CoupleProvider>
  );
}
