"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useAppSelector } from "@/redux/hooks";
import { ROLES } from "@/lib/constants";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === ROLES.ADMIN;

  if (!user || !isAdmin) return <h1>Unauthorized</h1>;

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
    </div>
  );
}
