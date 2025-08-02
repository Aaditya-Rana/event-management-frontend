"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllBookings } from "@/redux/slices/bookingSlice";
import { format } from "date-fns";
import classNames from "classnames";

export default function AdminBookingList() {
  const dispatch = useAppDispatch();
  const { bookings, pagination, status } = useAppSelector((state) => state.booking);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllBookings(`?page=${page}`));
  }, [dispatch, page]);

  const loading = status === "loading";
  const pages = pagination?.totalPages || 1;

  const getStatusBadge = (status: string) => {
    const baseClass =
      "px-3 py-1 text-xs font-semibold rounded-full text-white capitalize";
    switch (status.toLowerCase()) {
      case "confirmed":
        return <span className={classNames(baseClass, "bg-green-500")}>Confirmed</span>;
      case "pending":
        return <span className={classNames(baseClass, "bg-yellow-500")}>Pending</span>;
      case "cancelled":
        return <span className={classNames(baseClass, "bg-red-500")}>Cancelled</span>;
      default:
        return <span className={classNames(baseClass, "bg-gray-400")}>{status}</span>;
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-emerald-600">📋 All Event Bookings</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 py-10 border rounded-lg bg-gray-50">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-emerald-100 text-emerald-800 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-5 py-3 border-b">User</th>
                <th className="px-5 py-3 border-b">Email</th>
                <th className="px-5 py-3 border-b">Event</th>
                <th className="px-5 py-3 border-b">Booked At</th>
                <th className="px-5 py-3 border-b">Seats</th>
                <th className="px-5 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking, idx) => (
                <tr
                  key={booking._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                >
                  <td className="px-5 py-4">{booking.user?.name || "N/A"}</td>
                  <td className="px-5 py-4">{booking.user?.email || "N/A"}</td>
                  <td className="px-5 py-4">{booking.event?.title || "N/A"}</td>
                  <td className="px-5 py-4">
                    {format(new Date(booking.bookedAt ?? booking.createdAt ?? ""), "PPPp")}
                  </td>
                  <td className="px-5 py-4">{booking.seats}</td>
                  <td className="px-5 py-4">{getStatusBadge(booking.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span className="text-sm font-medium">
            Page <strong>{page}</strong> of <strong>{pages}</strong>
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}
