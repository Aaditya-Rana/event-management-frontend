"use client";

import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "@/api/axios";
import { debounce } from "lodash";
import EventCard from "@/components/events/EventCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { bookEvent } from "@/redux/slices/bookingSlice";
import { toast } from "react-toastify";

interface Category {
  _id: string;
  name: string;
}

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { status } = useAppSelector((state) => state.booking);

  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    isOnline: false,
    status: "",
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      queryParams.append("page", page.toString());
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.isOnline) queryParams.append("isOnline", "true");
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);

      const res = await axiosInstance.get(`/events?${queryParams.toString()}`);
      setEvents(res.data.data);
      setPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Error fetching events", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPage(1); // reset page
      }, 500),
    []
  );

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.data);
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };

  const handleBook = async (eventId: string) => {
    if (!user) {
      toast.warning("Please login to book events.");
      return;
    }

    try {
      await dispatch(bookEvent({ eventId, seats: 1 })).unwrap();
      toast.success("Booking successful!");
    } catch (err: any) {
      toast.error(err || "Booking failed.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [filters, page]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-emerald-600 mb-8">All Events</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          className="border px-3 py-2 rounded"
          onChange={(e) => debouncedSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={filters.category}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, category: e.target.value }));
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={filters.status}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, status: e.target.value as any }));
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <label className="flex items-center gap-2 text-sm col-span-1">
          <input
            type="checkbox"
            checked={filters.isOnline}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, isOnline: e.target.checked }));
              setPage(1);
            }}
          />
          Online
        </label>

        <input
          type="date"
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />
      </div>

      {/* Events */}
      {loading ? (
        <p className="text-center">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {page} of {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
