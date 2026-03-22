import { AuthGuard } from '@/shared/ui/AuthGuard';
import { AppShell } from '@/shared/ui/AppShell';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}