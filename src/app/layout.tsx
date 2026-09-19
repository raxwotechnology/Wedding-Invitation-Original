import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import BackgroundMusic from "@/components/BackgroundMusic";

export const metadata: Metadata = {
  title: "Rashin & Rashmi Wedding",
  description: "Join us as we celebrate love, joy, and unforgettable moments together",
  icons: {
    icon: "/wedding-photos/photo-51.jpg",
    apple: "/wedding-photos/photo-51.jpg",
    shortcut: "/wedding-photos/photo-51.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FA2B56",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/wedding-photos/photo-51.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/wedding-photos/photo-51.jpg" />
        <link rel="shortcut icon" href="/wedding-photos/photo-51.jpg" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <BackgroundMusic />
      </body>
    </html>
  );
}
