"use client";

import { ChevronLeft, ChevronRight, LayoutDashboard, PlusCircle, Pencil, CalendarCheck, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const sidebarItems = [
  {
    title: "Category",
    icon: LayoutDashboard,
    subItems: [
      { label: "Create", href: "/admin/category/create", icon: PlusCircle },
      { label: "Update", href: "/admin/category/update", icon: Pencil },
    ],
  },
  {
    title: "Event",
    icon: CalendarCheck,
    subItems: [
      { label: "Create", href: "/admin/event/create", icon: PlusCircle },
      { label: "Update", href: "/admin/event/update", icon: Pencil },
    ],
  },
  {
    title: "Bookings",
    icon: BookOpen,
    subItems: [
      { label: "All Bookings", href: "/admin/bookings", icon: BookOpen },
    ],
  },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    handleResize(); // on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  return (
    <aside
      className={`bg-emerald-700 text-white transition-all duration-300 ease-in-out overflow-y-auto h-full ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-emerald-600 h-full">
        {!collapsed && <h2 className="text-lg font-bold">Admin</h2>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="mt-4 px-2 h-full">
        {sidebarItems.map((item) => (
          <div key={item.title} className="mb-4">
            {!collapsed && (
              <p className="text-sm uppercase font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                <item.icon size={16} />
                {item.title}
              </p>
            )}
            <ul className="space-y-1">
              {item.subItems.map((sub) => (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-emerald-600 text-sm"
                  >
                    <sub.icon size={16} />
                    {!collapsed && sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
