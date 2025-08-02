import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white shadow rounded-xl">
        <h2 className="text-2xl font-bold text-center text-emerald-600 mb-6">Create Your Account</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
