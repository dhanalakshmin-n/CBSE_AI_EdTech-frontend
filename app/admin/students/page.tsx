"use client";

import { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  email: string;
  studentClass: string;
  schoolName: string;
  createdAt: string;
}

export default function StudentOnboardingPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    const res = await fetch(
      "http://localhost:8080/api/admin/students",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= ADD STUDENT ================= */
  const handleAddStudent = async () => {
    if (!name || !email || !password || !studentClass || !schoolName) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch(
      "http://localhost:8080/api/admin/students",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          studentClass,
          schoolName,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to add student");
      return;
    }

    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setStudentClass("");
    setSchoolName("");

    fetchStudents();
  };

  /* ================= DELETE ================= */
  const deleteStudent = async (id: number) => {
    await fetch(
      `http://localhost:8080/api/admin/students/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchStudents();
  };

  return (
    <div className="bg-[#F6F8FC] min-h-screen">

      {/* PAGE HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">
          Student Onboarding
        </h1>
        <p className="text-gray-500 mt-1">
          Create student accounts and manage access credentials.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">

        {/* ================= LEFT FORM ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              👤
            </div>
            <h2 className="text-lg font-semibold">
              Add New Student
            </h2>
          </div>

          <div className="space-y-5">

            <div>
              <label className="text-sm text-gray-600">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
                className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@email.com"
                className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Class
              </label>
              <input
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Class 10"
                className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                School Name
              </label>
              <input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="School Name"
                className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleAddStudent}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium mt-4"
            >
              Create Student
            </button>

          </div>
        </div>

        {/* ================= RIGHT TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm">

          <div className="flex justify-between items-center px-8 py-6 border-b">
            <div>
              <h2 className="text-lg font-semibold">
                Onboarded Students
              </h2>
              <p className="text-sm text-gray-500">
                {students.length} students in system
              </p>
            </div>

            <input
              placeholder="Search students..."
              className="px-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <div className="divide-y">

            {students.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-5 items-center px-8 py-6"
              >
                <div>
                  <p className="font-medium">
                    {student.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student.email}
                  </p>
                </div>

                <div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {student.studentClass}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {student.schoolName}
                </div>

                <div className="text-sm text-gray-600">
                  {new Date(student.createdAt).toLocaleDateString()}
                </div>

                <div>
                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
