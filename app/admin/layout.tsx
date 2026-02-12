"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setAdminName(storedName);
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const isActive = (path: string) =>
    pathname.startsWith(path)
      ? "bg-blue-100 text-blue-600 font-medium"
      : "hover:bg-gray-100 text-gray-600";

  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col justify-between">

        <div>
          <div className="flex items-center gap-3 px-6 py-6 border-b">
            <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold">
              C
            </div>
            <h2 className="font-semibold text-lg">CBSE Admin</h2>
          </div>

          <nav className="mt-6 space-y-2 px-4">

            <button
              onClick={() => router.push("/admin")}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${isActive("/admin")}`}
            >
              👥 Admin Management
            </button>

            <button
              onClick={() => router.push("/admin/students")}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${isActive("/admin/students")}`}
            >
              👨‍🎓 Student Onboarding
            </button>

            <button
              onClick={() => router.push("/admin/syllabus")}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${isActive("/admin/syllabus")}`}
            >
              📚 Syllabus Management
            </button>

            <button
              onClick={() => router.push("/admin/quiz")}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${isActive("/admin/quiz")}`}
            >
              📝 Quiz Management
            </button>

          </nav>
        </div>

        <div className="p-6">
          <button
            onClick={logout}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1">

        {/* Top Navbar */}
        <div className="h-20 bg-white flex items-center justify-between px-10 border-b">

          <input
            type="text"
            placeholder="Quick search..."
            className="w-96 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center gap-6">
            <span className="text-gray-500 cursor-pointer">🔔</span>
            <span className="text-gray-500 cursor-pointer">⚙️</span>

            <div className="text-right">
              <p className="font-semibold">{adminName}</p>
              <p className="text-sm text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>

        <div className="p-10">{children}</div>
      </div>
    </div>
  );
}
