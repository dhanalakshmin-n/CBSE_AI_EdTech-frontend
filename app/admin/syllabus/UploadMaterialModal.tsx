"use client";

import { useRef, useState } from "react";

interface Props {
  classLevel: number;
  subjects: any[];
  onClose: () => void;
}

export default function UploadMaterialModal({
  classLevel,
  subjects,
  onClose,
}: Props) {
  const [subjectId, setSubjectId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleUpload = async () => {
    if (!file || !subjectId || !displayName) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("classLevel", classLevel.toString());
    formData.append("subjectId", subjectId);
    formData.append("displayName", displayName);
    formData.append("file", file);

    const res = await fetch(
      "http://localhost:8080/api/admin/materials",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upload Study Material</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        {/* Subject Dropdown */}
        <select
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>

          {Array.isArray(subjects) &&
            subjects.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>

        {/* Display Name */}
        <input
          placeholder="Display Name (e.g. Chapter 1 Notes)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        {/* Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-500 transition mb-6"
        >
          <div className="text-blue-600 text-3xl mb-3">📄</div>

          {file ? (
            <p className="text-gray-700 font-medium">{file.name}</p>
          ) : (
            <>
              <p className="font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PDF, DOC, or PPT up to 10MB
              </p>
            </>
          )}
        </div>

        {/* Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm Upload
          </button>
        </div>
      </div>
    </div>
  );
}
