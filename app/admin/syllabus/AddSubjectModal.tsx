"use client";

import { useState } from "react";

export default function AddSubjectModal({
  classLevel,
  onClose,
}: {
  classLevel: number;
  onClose: () => void;
}) {
  const [name, setName] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    await fetch("http://localhost:8080/api/admin/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        classLevel,
      }),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-2xl p-6 shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          Add New Subject (Class {classLevel})
        </h2>

        <input
          placeholder="Subject Name"
          className="w-full border rounded-xl px-4 py-3 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          Add Subject
        </button>
      </div>
    </div>
  );
}
