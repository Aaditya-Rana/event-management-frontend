"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { updateEvent } from "@/redux/slices/eventSlice";
import { axiosInstance } from "@/api/axios";
import { X } from "lucide-react";
import compressImage from "@/lib/compressImage";
import { Event } from "@/types/event";

export default function UpdateEventPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const { categories } = useAppSelector((state) => state.category);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    isOnline: false,
    capacity: 0,
    category: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    fetchEventDetails();
  }, [dispatch]);

  const fetchEventDetails = async () => {
    try {
      const res = await axiosInstance.get(`/events/${eventId}`);
      const event: Event = res.data.data;

      setForm({
        title: event.title,
        description: event.description || "",
        location: event.location || "",
        date: event.date?.slice(0, 16),
        isOnline: event.isOnline || false,
        capacity: event.capacity || 0,
        category: event.category || "",
      });

      if (event.thumbnailUrl) {
        setImagePreview(event.thumbnailUrl);
      }
    } catch (err) {
      alert("Failed to load event.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.name === "capacity"
        ? +target.value
        : target.value;

    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 800);
        setImage(compressed);
        setImagePreview(URL.createObjectURL(compressed));
      } catch (err) {
        console.error("Image compression failed", err);
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, String(value))
    );
    if (image) formData.append("image", image);

    setIsSubmitting(true);
    try {
      await dispatch(updateEvent({ id: eventId, formData })).unwrap();
      setSuccessMessage("✅ Event updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        router.push("/admin/event/update");
      }, 2000);
    } catch {
      alert("Failed to update event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-emerald-600">Update Event</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded shadow text-sm mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Event Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          placeholder="Location"
          className="w-full border p-2 rounded"
        />

        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <div className="flex items-center gap-2">
          <label htmlFor="isOnline">Online Event:</label>
          <input
            name="isOnline"
            type="checkbox"
            checked={form.isOnline}
            onChange={handleChange}
          />
        </div>

        <input
          name="capacity"
          type="number"
          value={form.capacity}
          onChange={handleChange}
          required
          placeholder="Capacity"
          className="w-full border p-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {!imagePreview ? (
          <label className="w-full cursor-pointer border-2 border-dashed border-emerald-400 rounded-md flex items-center justify-center py-6 text-emerald-600 hover:bg-emerald-50 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            Click or drag to upload image
          </label>
        ) : (
          <div className="relative group w-full border rounded overflow-hidden shadow">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-50 transition"
              title="Remove Image"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white w-full ${
            isSubmitting
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isSubmitting ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
}
