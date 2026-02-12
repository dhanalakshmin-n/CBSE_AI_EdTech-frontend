"use client";

import { useRouter, usePathname } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              🎓
            </div>
            <h2 className="font-semibold text-lg">Student Hub</h2>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-2 px-4">

            {/* Quizzes */}
            <button
              onClick={() => router.push("/student/quizzes")}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition
                ${
                  pathname.startsWith("/student/quizzes")
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              📘 Quizzes
            </button>

            {/* Syllabus */}
            <button
              onClick={() => router.push("/student/syllabus")}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition
                ${
                  pathname.startsWith("/student/syllabus")
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              📚 Syllabus / Materials
            </button>

          </nav>
        </div>

        {/* Logout */}
        <div className="p-6 border-t">
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

          {/* Search */}
          <input
            type="text"
            placeholder="Search study material..."
            className="w-96 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <span className="text-gray-500 cursor-pointer text-xl">🔔</span>
            <span className="text-gray-500 cursor-pointer text-xl">⚙️</span>

            <div className="text-right">
              <p className="font-semibold">Rahul Kumar</p>
              <p className="text-sm text-gray-500">Class 10</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-10">
          {children}
        </div>

      </div>
    </div>
  );
}
