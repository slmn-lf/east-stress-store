import type { Metadata } from "next";

import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "East Stress Store",
  description: "pre order east stress merch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
