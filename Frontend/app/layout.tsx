"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/src/context/AuthProvider"
import { SplashScreen } from "@/components/splash-screen"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <meta name="theme-color" content="#ff6b00" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lalitha Mega Mall" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`font-sans antialiased bg-background text-foreground h-full`}>
        <Provider store={store}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <AuthProvider>
              <SplashScreen />
              {children}
              <Toaster />
              <Analytics />
            </AuthProvider>
          </ThemeProvider>
        </Provider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker Registration
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js').catch(() => {});
              }
              
              // Suppress browser extension errors
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('message channel closed')) {
                  e.preventDefault();
                  return false;
                }
              });
              
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && e.reason.message.includes('message channel closed')) {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
