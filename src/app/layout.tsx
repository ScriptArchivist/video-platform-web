import './globals.css';
import { AppQueryProvider } from './providers/QueryProvider';
import { ToastProvider } from '@/shared/ui/toast/ToastProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppQueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}