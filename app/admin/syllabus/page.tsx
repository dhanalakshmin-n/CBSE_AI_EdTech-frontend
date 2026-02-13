"use client";

import { useEffect, useState } from "react";
import AddSubjectModal from "./AddSubjectModal";
import UploadMaterialModal from "./UploadMaterialModal";
import EditMaterialModal from "./EditMaterialModal";


interface Subject {
  id: number;
  name: string;
  classLevel: number;
}

interface Material {
  id: number;
  displayName: string;
  fileName: string;
  uploadedAt: string;
  subject: Subject;
}

export default function AdminSyllabusPage() {
  const [selectedClass, setSelectedClass] = useState(10);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);


  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  useEffect(() => {
    fetchSubjects();
    fetchMaterials();
  }, [selectedClass]);

  const fetchSubjects = async () => {
    const res = await fetch(
      `http://localhost:8080/api/admin/subjects/${selectedClass}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setSubjects(data);
  };

  const fetchMaterials = async () => {
    const res = await fetch(
      `http://localhost:8080/api/admin/materials/class/${selectedClass}
`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setMaterials(data);
  };

  const deleteMaterial = async (id: number) => {
    await fetch(`http://localhost:8080/api/admin/materials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMaterials();
  };

  return (
    <div className="bg-[#F6F8FC] min-h-screen p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold">Syllabus Management</h1>
          <p className="text-gray-500 mt-1">
            Manage curriculum subjects and study materials.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowSubjectModal(true)}
            className="px-5 py-3 rounded-xl border bg-white hover:bg-gray-100"
          >
            + Add Subject
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Upload Material
          </button>
        </div>
      </div>

      <div className="flex gap-10">

        {/* CLASS SELECTOR */}
        <div className="bg-white rounded-2xl shadow-sm p-6 w-64">
          <h3 className="text-gray-500 font-semibold mb-6 text-sm">
            SELECT CLASS
          </h3>

          {[8,9,10,11,12].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`w-full text-left px-4 py-3 rounded-xl mb-3 transition
                ${
                  selectedClass === cls
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              Class {cls}
            </button>
          ))}
        </div>

        {/* MATERIAL TABLE */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">

          <h2 className="font-semibold text-lg mb-6">
            Class {selectedClass} Study Materials
          </h2>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left pb-3">Subject</th>
                <th className="text-left pb-3">File Name</th>
                <th className="text-left pb-3">Uploaded</th>
                <th className="text-right pb-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">{m.subject.name}</td>
                  <td className="py-4 text-blue-600">
                    {m.fileName}
                  </td>
                  <td className="py-4">
                    {new Date(m.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-right space-x-4">

  {/* EDIT BUTTON */}
  <button
    onClick={() => setEditingMaterial(m)}
    className="text-gray-500 hover:text-blue-600"
  >
    ✏️
  </button>

  {/* DELETE BUTTON */}
  <button
    onClick={() => deleteMaterial(m.id)}
    className="text-gray-500 hover:text-red-600"
  >
    🗑
  </button>

</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSubjectModal && (
        <AddSubjectModal
          classLevel={selectedClass}
          onClose={() => {
            setShowSubjectModal(false);
            fetchSubjects();
          }}
        />
      )}

      {showUploadModal && (
        <UploadMaterialModal
          classLevel={selectedClass}
          subjects={subjects}
          onClose={() => {
            setShowUploadModal(false);
            fetchMaterials();
          }}
        />
      )}

      {editingMaterial && (
  <EditMaterialModal
    material={editingMaterial}
    onClose={() => setEditingMaterial(null)}
    onUpdated={fetchMaterials}
  />
)}

    </div>
  );
}
