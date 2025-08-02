import { LayoutDashboard } from "lucide-react";

export default function AdminHomePage() {
  return (
    <section className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-xl text-center">
      <div className="flex flex-col items-center gap-4">
        <LayoutDashboard className="w-12 h-12 text-emerald-600" />
        <h1 className="text-3xl font-bold text-emerald-700">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600 max-w-xl">
          Manage bookings, view events, track user activity, and stay in control of your platform with real-time insights.
        </p>
      </div>
    </section>
  );
}
