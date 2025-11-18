"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/layout/footer";
import BottomNav from "./components/Navbar/BottomNav";
import Navbar from "./components/Navbar/Navbar";

const disableNavbarFooterRoutes = ["/auth/login", "/admin"];

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Disable navbar/footer untuk admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && !disableNavbarFooterRoutes.includes(pathname) && (
        <Navbar />
      )}

      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>

        {!isAdminRoute && !disableNavbarFooterRoutes.includes(pathname) && (
          <Footer />
        )}
      </div>

      {/* Bottom nav is fixed on mobile */}
      {!isAdminRoute && !disableNavbarFooterRoutes.includes(pathname) && (
        <BottomNav />
      )}
    </>
  );
}
