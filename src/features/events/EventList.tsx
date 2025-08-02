"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchEvents, deleteEvent } from "@/redux/slices/eventSlice";
import Link from "next/link";
import { debounce } from "lodash";

export default function EventList() {
  const dispatch = useAppDispatch();
  const { events, pagination, status } = useAppSelector((state) => state.event);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = debounce((val: string) => {
    setSearchQuery(val.trim());
    setPage(1);
  }, 500);

  useEffect(() => {
    const query = `?page=${page}&search=${searchQuery}`;
    dispatch(fetchEvents(query));
  }, [dispatch, page, searchQuery]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await dispatch(deleteEvent(id));
      dispatch(fetchEvents(`?page=${page}&search=${searchQuery}`));
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-emerald-700">Manage Events</h2>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search events..."
          className="border px-4 py-2 rounded-lg w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearchChange(e.target.value);
          }}
        />
        <Link
          href="/admin/event/create"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          + Create Event
        </Link>
      </div>

      {status === "loading" ? (
        <p className="text-gray-600">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Title</th>
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{event.title}</td>
                  <td className="border px-4 py-2">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <Link
                      href={`/admin/event/update/${event.eventId}`}
                      title="Edit Event"
                      className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event.eventId)}
                      title="Delete Event"
                      className="inline-block bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page <strong>{pagination.page}</strong> of {pagination.pages}
          </span>
          <button
            disabled={page === pagination.pages}
            onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
