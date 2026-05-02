import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portofolio Dzamfbr - Web MPL ID",
  icons: {
    icon: "/images/Logo%20MPL%20ID.png",
    shortcut: "/images/Logo%20MPL%20ID.png",
    apple: "/images/Logo%20MPL%20ID.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
