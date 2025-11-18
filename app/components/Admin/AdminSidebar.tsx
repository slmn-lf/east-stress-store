"use client";

import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { logoutAction } from "../../actions/auth";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/dashboard/products", icon: Package },
  {
    label: "Pre-Orders",
    href: "/admin/dashboard/preorders",
    icon: ShoppingCart,
  },
  {
    label: "CMS",
    icon: Settings2,
    children: [
      { label: "Hero", href: "/admin/dashboard/cmsprofile/hero" },
      { label: "About", href: "/admin/dashboard/cmsprofile/about" },
      { label: "Contact", href: "/admin/dashboard/cmsprofile/contact" },
    ],
  },
];

export default function AdminSidebar() {
  const { isOpen, toggleSidebar, closeSidebar, isCollapsed, toggleCollapse } =
    useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-linear-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Header - Desktop Only */}
        <div
          className={`hidden md:flex p-6 pt-6 items-center justify-between ${isCollapsed ? "flex-col gap-4" : ""}`}
        >
          {!isCollapsed && (
            <div>
              <h1 className="text-2xl font-bold">East Stress</h1>
            </div>
          )}
          {/* Collapse Button - Desktop Only */}
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center w-8 h-8 hover:bg-blue-500 rounded-lg transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`md:mt-8 space-y-2 pt-16 md:pt-0 ${isCollapsed ? "px-2" : "px-4"}`}
        >
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isExpanded = expandedItems.includes(item.label);
            const hasChildren = "children" in item && item.children;

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors duration-200 ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <IconComponent size={20} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {hasChildren && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    onClick={closeSidebar}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors duration-200 ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <IconComponent size={20} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {hasChildren && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {hasChildren && isExpanded && !isCollapsed && (
                  <div className="ml-4 space-y-1 mt-1">
                    {item.children.map(
                      (child: { label: string; href: string }) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeSidebar}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200 text-sm"
                        >
                          <span className="w-1 h-1 bg-white rounded-full"></span>
                          <span>{child.label}</span>
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Profile & Logout - Mobile Only */}
        <div className={`md:hidden absolute bottom-6 left-4 right-4 space-y-2`}>
          <Link
            href="/admin/dashboard/profile"
            onClick={closeSidebar}
            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors duration-200 text-sm"
          >
            <User size={18} />
            <span>Profile</span>
          </Link>
          <Link
            href="/admin/dashboard/profile"
            onClick={closeSidebar}
            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors duration-200 text-sm"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Footer - Desktop Only */}
        <div
          className={`hidden md:block absolute bottom-6 ${isCollapsed ? "left-2 right-2" : "left-4 right-4"}`}
        >
          <p
            className={`text-xs text-blue-100 ${isCollapsed ? "text-center" : ""}`}
          >
            © 2025 East Stress
          </p>
        </div>
      </aside>

      {/* Spacer untuk desktop - Dynamic width */}
      <div
        className={`hidden md:block transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
      />
    </>
  );
}
