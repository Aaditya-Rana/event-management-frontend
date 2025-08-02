"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { createCategory } from "@/redux/slices/categorySlice";
import { X } from "lucide-react";
import compressImage from "@/lib/compressImage";

export default function CreateCategory() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleImageChange = async (file: File) => {
    try {
      const compressed = await compressImage(file, 600, 600);
      setImage(compressed);
    } catch (err) {
      console.error("Image compression failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const result = await dispatch(createCategory(formData));

      if (createCategory.fulfilled.match(result)) {
        setSuccessMessage("✅ Category created successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setName("");
        setImage(null);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-semibold text-emerald-700">Create Category</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded shadow text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {!previewUrl ? (
          <label className="w-full cursor-pointer border-2 border-dashed border-emerald-400 rounded-md flex items-center justify-center py-6 text-emerald-600 hover:bg-emerald-50 transition">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleImageChange(file);
              }}
              hidden
            />
            Click or drag to upload image
          </label>
        ) : (
          <div className="relative group w-full border rounded overflow-hidden shadow">
            <img
              src={previewUrl}
              alt="Selected"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
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
          className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>

        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      </form>
    </div>
  );
}
