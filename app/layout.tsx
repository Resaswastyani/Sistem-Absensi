import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/context/auth-context'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-sans',
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Sistem Absensi STMIK El Rahma',
  description: 'Sistem manajemen absensi berbasis web untuk STMIK El Rahma Yogyakarta',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
