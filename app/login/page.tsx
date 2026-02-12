"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);

    if (data.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/student/quizzes");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white p-16 flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-8">🎓 CBSE AI EdTech</h2>

          <h1 className="text-4xl font-bold leading-tight mb-6">
            Your AI-Powered <br />
            Journey Starts Here.
          </h1>

          <p className="text-lg opacity-90">
            Access personalized CBSE curriculum, interactive quizzes,
            and AI-driven study materials tailored for Classes 8–12.
          </p>
        </div>

        <div className="flex gap-4">
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            Secure SSL
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            AI Protected
          </span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-8">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
          
          {/* Role Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setRole("STUDENT")}
              className={`flex-1 py-2 rounded-full ${
                role === "STUDENT"
                  ? "bg-white shadow font-semibold"
                  : "text-gray-500"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("ADMIN")}
              className={`flex-1 py-2 rounded-full ${
                role === "ADMIN"
                  ? "bg-white shadow font-semibold"
                  : "text-gray-500"
              }`}
            >
              Admin
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-gray-500 mb-6">
            Sign in to your {role.toLowerCase()} account to continue.
          </p>

          {/* Email */}
          <input
            type="email"
            placeholder="name@email.com"
            className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login →
          </button>

          <p className="text-sm text-gray-400 mt-6 text-center">
            Don't have credentials? Contact your school administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
