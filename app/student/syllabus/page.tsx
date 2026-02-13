"use client";

import { useEffect, useState } from "react";

interface Syllabus {
  id: number;
  displayName: string;
  fileName: string;
  uploadedAt: string;
  subject: {
    id: number;
    name: string;
  };
}

export default function StudentSyllabusPage() {
  const [materials, setMaterials] = useState<Syllabus[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/student/materials", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Backend Error:", errorText);
    throw new Error("Failed to fetch materials");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : [];
})
.then((data) => setMaterials(data))
.catch((err) => {
  console.error(err);
  setMaterials([]);
});
  }, []);

  const filteredMaterials = materials
    .filter((m) =>
      selectedSubject ? m.subject.id === selectedSubject : true
    )
    .filter((m) =>
      m.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const downloadMaterial = async (material: Syllabus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/student/materials/${material.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = material.fileName;
      link.click();
    } catch (error) {
      alert("Download failed");
      console.error(error);
    }
  };

  const previewMaterial = async (material: Syllabus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/student/materials/${material.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Preview failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setPreviewUrl(url);
      setPreviewTitle(material.displayName);
    } catch (error) {
      alert("Preview failed");
      console.error(error);
    }
  };

  return (
    <div className="bg-[#F6F8FC] min-h-screen p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold">Syllabus & Materials</h1>
          <p className="text-gray-500 mt-1">
            Access your curriculum and study guides.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 bg-white"
        />
      </div>

      <div className="flex gap-10">

        {/* SUBJECT FILTER */}
        <div className="bg-white rounded-2xl shadow-sm p-6 w-64 h-fit">
          <h3 className="text-gray-500 font-semibold mb-6 text-sm">
            FILTER SUBJECTS
          </h3>

          <div className="space-y-4">

            <button
              onClick={() => setSelectedSubject(null)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition
                ${
                  selectedSubject === null
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              All Subjects
            </button>

            {[...new Map(materials.map(m => [m.subject.id, m.subject])).values()]
              .map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition
                    ${
                      selectedSubject === subject.id
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                >
                  {subject.name}
                </button>
              ))}
          </div>
        </div>

        {/* MATERIAL GRID */}
        <div className="grid grid-cols-2 gap-8 flex-1">

          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium">
                  PDF
                </div>

                <span className="text-gray-400 text-sm">
                  {new Date(material.uploadedAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-lg font-semibold mb-2">
                {material.displayName}
              </h2>

              <p className="text-gray-500 text-sm mb-4">
                {material.subject.name}
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => previewMaterial(material)}
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Preview
                </button>

                <button
                  onClick={() => downloadMaterial(material)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[900px] h-[600px] rounded-2xl shadow-xl flex flex-col">

            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="font-semibold text-lg">{previewTitle}</h2>

              <button
                onClick={() => setPreviewUrl(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <iframe
              src={previewUrl}
              className="flex-1 rounded-b-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
