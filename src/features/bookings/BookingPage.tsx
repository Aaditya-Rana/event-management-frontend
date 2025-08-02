"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMyBookings } from "@/redux/slices/bookingSlice";
import { format } from "date-fns";
import { axiosInstance } from "@/api/axios";
import { toast } from "react-toastify";

export default function MyBookingsPage() {
  const dispatch = useAppDispatch();
  const { bookings, status, error } = useAppSelector((state) => state.booking);

  const [page, setPage] = useState(1);
  const bookingsPerPage = 5;

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await axiosInstance.patch(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully!");
      dispatch(fetchMyBookings());
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const paginatedBookings = bookings.slice(
    (page - 1) * bookingsPerPage,
    page * bookingsPerPage
  );

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const isValidDate = (dateString: string | undefined | null) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">My Bookings</h1>

      {status === "loading" ? (
        <p className="text-center">Loading your bookings...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600 text-center">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-700">Event</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-700">Seats</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-700">Booked On</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {paginatedBookings.map((booking) => {
                const eventDate = booking.event?.date ? new Date(booking.event.date) : null;
                const eventTime = eventDate?.getTime() ?? 0;
                const nowTime = Date.now();

                const isCancelable = booking.status?.toUpperCase() === "CONFIRMED" && eventTime > nowTime;

                const bookingDateRaw = booking.bookedAt ?? booking.createdAt;
                const showBookingDate = isValidDate(bookingDateRaw)
                  ? format(new Date(bookingDateRaw!), "PPPp")
                  : "N/A";

                return (
                  <tr key={booking._id}>
                    <td className="px-4 py-3">{booking.event?.title || "N/A"}</td>
                    <td className="px-4 py-3">{booking.seats}</td>
                    <td className="px-4 py-3">{showBookingDate}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        {booking.status || "CONFIRMED"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isCancelable ? (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-sm text-red-600 hover:underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Not allowed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
