"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { status, error, user } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 disabled:opacity-60"
      >
        {status === "loading" ? "Logging in..." : "Login"}
      </button>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </form>
  );
}
