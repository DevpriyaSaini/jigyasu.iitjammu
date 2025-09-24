'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function ProjectForm() {
  const data=useSession().data||{role:""};
  console.log(data);
  
  
  const [formData, setFormData] = useState({
    projectname: '',
    description: '',
    publicId: '',
    deadline:'',
    profname: '', // Professor’s display name (input)
  });

  const [errors, setErrors] = useState({
    projectname: '',
    description: '',
    publicId: '',
     deadline:'',
    profname: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { projectname: '', description: '', publicId: '', profname: '', deadline:'' };

    if (!formData.projectname.trim()) {
      newErrors.projectname = 'Project name is required';
      isValid = false;
    }

    if (!formData.profname.trim()) {
      newErrors.profname = 'Professor name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.publicId) {
      newErrors.publicId = 'Image is required';
      isValid = false;
    }
    if (!formData.deadline.trim()) {
      newErrors.publicId = 'deadline is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const response = await axios.post("/api/upl-project", formData);

    // If successful, axios will not throw, so you can safely reset
    setFormData({
      projectname: "",
      description: "",
      publicId: "",
      deadline:"",
      profname: "",
    });
    setErrors({
      projectname: "",
      description: "",
      deadline:"",
      publicId: "",
      profname: "",
    });

    toast.success("Project submitted successfully!");
  } catch (error: any) {
    console.error("Error:", error);
    toast.error(
      error.response?.data?.error || "Submission failed. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-16"
      >
        {/* Project Name */}
        <div>
          <label className="block mb-1 text-gray-800 dark:text-gray-100">Project Name *</label>
          <input
            type="text"
            value={formData.projectname}
            onChange={(e) => setFormData({ ...formData, projectname: e.target.value })}
            className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.projectname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.projectname && <p className="text-sm text-red-500">{errors.projectname}</p>}
        </div>

        {/* Professor Name */}
        <div>
          <label className="block mb-1 text-gray-800 dark:text-gray-100">Professor Name *</label>
          <input
            type="text"
            value={formData.profname}
            onChange={(e) => setFormData({ ...formData, profname: e.target.value })}
            className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.profname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.profname && <p className="text-sm text-red-500">{errors.profname}</p>}
        </div>
        {/* deadline */}
        <div>
          <label className="block mb-1 text-gray-800 dark:text-gray-100">Deadline *</label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.deadline && <p className="text-sm text-red-500">{errors.deadline}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-gray-800 dark:text-gray-100">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            rows={4}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-1 text-gray-800 dark:text-gray-100">Image *</label>
          <ImageUpload
            onUploadComplete={(publicId) => {
              setFormData((prev) => ({ ...prev, publicId }));
              setErrors((prev) => ({ ...prev, publicId: '' }));
            }}
            onUploadError={(error) => {
              setErrors((prev) => ({ ...prev, publicId: error }));
            }}
            required
            error={errors.publicId}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
