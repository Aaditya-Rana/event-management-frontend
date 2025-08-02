"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { axiosInstance } from "@/api/axios";
import EventCard from "@/components/events/EventCard";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [eventsByCategory, setEventsByCategory] = useState<Record<string, any[]>>({});
  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoryRes = await axiosInstance.get("/categories");
        const fetchedCategories = categoryRes.data.data;
        setCategories(fetchedCategories);

        // Fetch events by category
        const eventsMap: Record<string, any[]> = {};
        await Promise.all(
          fetchedCategories.map(async (cat: any) => {
            const res = await axiosInstance.get(`/events?category=${cat._id}&limit=4`);
            eventsMap[cat.name] = res.data.data;
          })
        );
        setEventsByCategory(eventsMap);

        // Fetch latest events
        const latestRes = await axiosInstance.get(`/events?limit=4&sort=-createdAt`);
        setLatestEvents(latestRes.data.data);
      } catch (err) {
        console.error("Error loading home page", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-emerald-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Exciting Events Around You</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          From tech meetups to art exhibitions, find and attend events that inspire you.
        </p>
        <Link
          href="/events"
          className="bg-white text-emerald-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
        >
          Browse Events
        </Link>
      </section>

      {/* Latest Events */}
      <section className="bg-white py-12 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Latest Events</h2>

        {loading ? (
          <p className="text-center">Loading latest events...</p>
        ) : latestEvents.length === 0 ? (
          <p className="text-center text-gray-500">No recent events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {latestEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Events by Category (Cards only) */}
      <section className="bg-gray-50 py-12 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Explore by Category</h2>

        {loading ? (
          <p className="text-center">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/events/${encodeURIComponent(cat.name)}`}
                className="block bg-white shadow hover:shadow-lg rounded overflow-hidden transition"
              >
                <img
                  src={cat.thumbnailUrl || "/placeholder-category.jpg"} // fallback if no image
                  alt={cat.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
