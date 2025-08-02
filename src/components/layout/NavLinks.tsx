"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/slices/authSlice";
import { axiosInstance } from "@/api/axios";

export default function NavLinks() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(logoutUser());
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      <Link href="/" className="hover:text-emerald-500">Home</Link>
      <Link href="/events" className="hover:text-emerald-500">Events</Link>

      {user?.role === ROLES.USER && (
        <Link href="/bookings" className="hover:text-emerald-500">My Bookings</Link>
      )}

      {user?.role === ROLES.ADMIN && (
        <Link href="/admin" className="hover:text-emerald-500">Admin Dashboard</Link>
      )}

      {!user ? (
        <>
          <Link href="/login" className="hover:text-emerald-500">Login</Link>
          <Link href="/register" className="hover:text-emerald-500">Signup</Link>
        </>
      ) : (
        <button onClick={handleLogout} className="hover:text-emerald-500">
          Logout
        </button>
      )}
    </>
  );
}
