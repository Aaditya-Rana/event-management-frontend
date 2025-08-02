"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axios";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { bookEvent } from "@/redux/slices/bookingSlice";

export default function EventDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { status } = useAppSelector((state) => state.booking);

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState(1);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEventDetails();
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      setMessage({ type: "error", text: "Please login to book this event." });
      return;
    }

    try {
      await dispatch(bookEvent({ eventId: event._id, seats })).unwrap();
      setMessage({ type: "success", text: "Event booked successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err || "Booking failed." });
    }
  };

  if (loading || !event) {
    return <div className="text-center py-10">Loading event details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow rounded overflow-hidden">
        <img
          src={event.thumbnailUrl}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-emerald-700">{event.title}</h1>
          <p className="text-gray-600">
            <strong>Date:</strong> {format(new Date(event.date), "PPPp")}
          </p>
          <p className="text-gray-600">
            <strong>Status:</strong> {event.status}
          </p>
          <p className="text-gray-600">
            <strong>Mode:</strong> {event.isOnline ? "Online" : "Offline"}
          </p>
          <p className="text-gray-700 mt-4">{event.description}</p>

          <div className="mt-8 border-t pt-6 space-y-4">
            {message && (
              <div
                className={`px-4 py-2 rounded text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {user ? (
              <>
                <h3 className="text-xl font-semibold">Book your seat</h3>
                <div className="flex gap-4 items-center">
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="border px-3 py-2 rounded w-24"
                  >
                    <option value={1}>1 Seat</option>
                    <option value={2}>2 Seats</option>
                  </select>
                  <button
                    onClick={handleBook}
                    disabled={status === "loading"}
                    className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                  >
                    {status === "loading" ? "Booking..." : "Book Now"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm mt-4">
                Please <strong>login</strong> to book this event.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
