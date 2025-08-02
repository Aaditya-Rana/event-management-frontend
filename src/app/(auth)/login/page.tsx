import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold text-center text-emerald-600 mb-6">Login to EventEase</h2>
        <LoginForm />
      </div>
    </div>
  );
}
