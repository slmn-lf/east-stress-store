"use client";

// import Image from "next/image";
import { navLinks } from "./navLinks";
import NavItem from "./NavItem";

export default function Navbar() {
  return (
    <nav
      className="hidden  md:flex justify-between items-center px-8 py-2 shadow-sm bg-neutral-800
     fixed top-0 left-0 right-0 z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/assets/logo.svg" alt="Logo" width={40} height={40} />
        <span className="text-3xl font-semibold text-white">East Stress</span>
      </div>

      {/* Nav Links */}
      <div className="flex items-center space-x-6 text-amber-300">
        {navLinks.map((link) => (
          <NavItem key={link.href} {...link} />
        ))}
      </div>
    </nav>
  );
}
