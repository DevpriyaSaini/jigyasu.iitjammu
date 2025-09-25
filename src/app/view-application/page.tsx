"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface Application {
  _id: string;
  studentname: string;
  degree: string;
  description: string;
  resume: string;
  email: string;
  createdAt: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`/api/applyjob?projectId=${projectId}`);
      setApplications(res.data.applications || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [projectId]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
    "Are you sure you want to delete this application? 🗑️"
  );
  if (!confirmDelete) return;
    try {
      await axios.delete(`/api/applyjob?_id=${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast.success("Application deleted successfully 🗑️");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to delete ❌");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 ">
      <h1 className="text-3xl mt-5 font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
        📑 Project Applications
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">⏳ Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">❌ No applications found.</p>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    👤 {app.studentname}
                  </h2>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">🎓 {app.degree}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">📧 {app.email}</p>

                  <p className="text-gray-700 dark:text-gray-300 mt-3">📝 {app.description}</p>

                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-blue-600 dark:text-blue-400 underline text-sm"
                  >
                    📂 View Resume
                  </a>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    📅 Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(app._id)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
