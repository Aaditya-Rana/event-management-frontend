"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { bookEvent } from "@/redux/slices/bookingSlice";
import { useState, useEffect } from "react";

interface EventCardProps {
  event: {
    _id: string;
    eventId: string;
    title: string;
    date: string;
    thumbnailUrl?: string;
    category?: { name: string };
  };
}

export default function EventCard({ event }: EventCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { status } = useAppSelector((state) => state.booking);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleBook = async () => {
    if (!user) {
      setMessage({ type: "error", text: "Please log in to book the event." });
      return;
    }

    try {
      await dispatch(bookEvent({ eventId: event._id, seats: 1 })).unwrap();
      setMessage({ type: "success", text: "Event booked successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err || "Booking failed." });
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-white rounded shadow hover:shadow-md transition overflow-hidden">
      <img
        src={event.thumbnailUrl || "/placeholder-event.jpg"}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{event.title}</h2>
        <p className="text-sm text-gray-600">
          {format(new Date(event.date), "PPPp")}
        </p>
        <p className="text-sm text-emerald-600">{event.category?.name}</p>

        <div className="flex justify-between items-center mt-2">
          <Link
            href={`/events/${event.eventId}`}
            className="text-sm text-emerald-600 hover:underline"
          >
            View →
          </Link>

          {user ? (
            <button
              onClick={handleBook}
              disabled={status === "loading"}
              className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              {status === "loading" ? "Booking..." : "Book"}
            </button>
          ) : (
            <span className="text-xs text-red-500 font-medium">
              Please log in to book
            </span>
          )}
        </div>

        {/* Message area */}
        {message && (
          <div
            className={`mt-2 text-xs px-3 py-2 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
