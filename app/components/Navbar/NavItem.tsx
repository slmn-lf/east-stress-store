"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

type NavItemProps = {
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

export default function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClass =
    "flex flex-col items-center justify-center gap-1 px-3 py-2 text-sm transition-colors";
  const activeClass = "text-blue-600 font-semibold";
  const inactiveClass = "text-gray-600 hover:text-blue-600";

  return (
    <Link
      href={href}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}
