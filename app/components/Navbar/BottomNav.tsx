"use client";

import { navLinks } from "./navLinks";
import NavItem from "./NavItem";

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_6px_rgba(0,0,0,0.1)] border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-14">
        {navLinks.map((link) => (
          <NavItem key={link.href} {...link} />
        ))}
      </div>
    </nav>
  );
}
