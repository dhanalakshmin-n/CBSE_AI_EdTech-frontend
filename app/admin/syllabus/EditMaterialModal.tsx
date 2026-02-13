"use client";

import { useState } from "react";

export default function EditMaterialModal({
  material,
  onClose,
  onUpdated,
}: any) {

  const [displayName, setDisplayName] = useState(material.displayName);

  const token = localStorage.getItem("token");

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/materials/${material.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ displayName }),
        }
      );

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      onUpdated();
      onClose();

    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-2xl p-8 shadow-xl">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            Edit Material
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-6"
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}
