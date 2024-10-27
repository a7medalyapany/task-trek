"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface AuthFormProps {
  onSubmit: (
    formData: FormData
  ) => Promise<{ errors?: Record<string, string> } | null>;
  formType: "login" | "register";
}

export default function AuthForm({ onSubmit, formType }: AuthFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await onSubmit(formData);
    if (result && result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
        {formType === "login" ? "Login" : "Register"} to TaskTrek
      </h2>

      {formType === "register" && (
        <input
          name="name"
          placeholder="Name"
          required
          className="w-full p-2 border rounded"
        />
      )}
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
        name="email"
        placeholder="Email"
        required
        className="w-full p-2 border rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          className="w-full p-2 border rounded pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
        >
          {showPassword ? (
            <EyeOffIcon strokeWidth="1.5" />
          ) : (
            <EyeIcon strokeWidth="1.5" />
          )}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password}</p>
      )}

      <button
        type="submit"
        className="w-full p-2 mt-4 bg-blue-500 text-white rounded"
      >
        {formType === "login" ? "Login" : "Sign Up"}
      </button>
      {errors.general && (
        <p className="text-red-500 text-sm text-center mt-2">
          {errors.general}
        </p>
      )}

      <p className="text-center text-sm mt-4">
        {formType === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
