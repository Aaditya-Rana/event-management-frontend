"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) return;

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        required
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full px-4 py-2 border rounded-md"
      />
      <input
        name="email"
        type="email"
        required
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-md"
      />
      <input
        name="password"
        type="password"
        required
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full px-4 py-2 border rounded-md"
      />

      {error && (
        <p className="text-red-500 text-sm">
          {typeof error === "string" ? error : "Something went wrong"}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
      >
        {status === "loading" ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
