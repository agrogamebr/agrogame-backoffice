
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers';
import { AuthProvider } from '@/contexts/AuthContext';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { ToastProvider, ToastContainer } from '@/components/ui/Toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read user info from cookies server-side
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get('user_info');
  let initialUser = null;

  if (userInfoCookie) {
    try {
      initialUser = JSON.parse(userInfoCookie.value);
    } catch (e) {
      console.error('Failed to parse user cookie', e);
    }
  }

  return (
    <html lang="pt-BR">
      <head>
        <title>AgroGame Backoffice</title>
        <meta name="description" content="Sistema de gestão AgroGame" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <AuthProvider initialUser={initialUser}>
            <AppLayoutWrapper>{children}</AppLayoutWrapper>
          </AuthProvider>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}

// Client Component wrapper for conditional rendering of Header/Sidebar
// We need this because accessing hook usePathname in RootLayout (Server Component) is tricky inside the body directly if we keep RootLayout as Server Component for cookies.
// Alternatively, we can move the conditional logic to a new client component.

