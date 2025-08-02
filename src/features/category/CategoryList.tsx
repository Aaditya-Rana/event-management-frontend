"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCategories,
  deleteCategory,
} from "@/redux/slices/categorySlice";
import { Category } from "@/types/category";

export default function CategoryList() {
  const dispatch = useAppDispatch();
  const { categories, status, error } = useAppSelector((state) => state.category);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await dispatch(deleteCategory(id)).unwrap();
    } catch (err) {
      alert(typeof err === "string" ? err : "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Categories</h2>

      {status === "loading" ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : categories.length === 0 ? (
        <div className="text-gray-500 text-center py-8 border border-dashed rounded-xl">
          No categories available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {categories.map((cat: Category) => (
                <tr key={cat._id}>
                  <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                  <td className="px-6 py-4">
                    <img
                      src={cat.thumbnailUrl}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      onError={(e) => ((e.target as HTMLImageElement).src = "/no-image.png")}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(cat._id)}
                      disabled={deletingId === cat._id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        deletingId === cat._id
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {deletingId === cat._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
