"use client";

import { useEffect, useState } from "react";
import AddAdminModal from "./components/AddAdminModal";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showModal, setShowModal] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔹 Fetch Admins
  const fetchAdmins = async () => {
    const res = await fetch("http://localhost:8080/api/admin/admins", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setAdmins(data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 🔹 Delete Admin
  const deleteAdmin = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:8080/api/admin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchAdmins(); // refresh list
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold">Admin Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your team of content managers and editors.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md"
        >
          + Add New Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 px-8 py-4 bg-gray-50 text-gray-500 text-sm font-medium">
          <div>Email Address</div>
          <div>Role</div>
          <div>Created Date</div>
          <div>Actions</div>
        </div>

        {admins.map((admin) => (
          <div
            key={admin.id}
            className="grid grid-cols-4 px-8 py-5 border-t items-center"
          >
            {/* Email + Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                {admin.name?.charAt(0)}
              </div>
              <span>{admin.email}</span>
            </div>

            {/* Role */}
            <div>
              <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-medium">
                {admin.role}
              </span>
            </div>

            {/* Date */}
            <div className="text-gray-500 text-sm">
              {new Date(admin.createdAt).toLocaleDateString()}
            </div>

            {/* Delete */}
            <div>
              <button
                onClick={() => deleteAdmin(admin.id)}
                className="text-gray-400 hover:text-red-500 text-lg"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddAdminModal
          onClose={() => {
            setShowModal(false);
            fetchAdmins();
          }}
        />
      )}
    </div>
  );
}
