'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { toast } from 'sonner';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function AlumniForm() {
  const searchParams = useSearchParams();
  const projectname = searchParams.get('projectname') || '';
  const profemail = searchParams.get('profemail') || '';
  const projectId = searchParams.get('projectId') || '';

  const [formData, setFormData] = useState({
    studentname: '',
    degree: '',
    description: '',
    publicId: '', // This will hold the uploaded resume/image
  });

  const [errors, setErrors] = useState({
    studentname: '',
    degree: '',
    description: '',
    publicId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { studentname: '', degree: '', description: '', publicId: '' };

    if (!formData.studentname.trim()) {
      newErrors.studentname = 'Student name is required';
      isValid = false;
    }
    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    if (!formData.publicId) {
      newErrors.publicId = 'Resume/Image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!projectname || !profemail ||!projectId) {
      toast.error('Missing projectname or profemail in URL');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/applyjob', {
        studentname: formData.studentname,
        degree: formData.degree,
        description: formData.description,
        resume: formData.publicId,
        projectId,
        projectname, // from search params
        profemail,   // from search params
      });

      if (!response) throw new Error('Submission failed');

      setFormData({ studentname: '', degree: '', description: '', publicId: '' });
      setErrors({ studentname: '', degree: '', description: '', publicId: '' });
      toast('Submitted successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-16"
      >
        {/* Student Name */}
        <div>
          <label className="block mb-1 text-gray-800 dark:text-gray-100">Student Name *</label>
          <input
            type="text"
            value={formData.studentname}
            onChange={(e) => setFormData({ ...formData, studentname: e.target.value })}
            className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.studentname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.studentname && <p className="text-sm text-red-500">{errors.studentname}</p>}
        </div>

        {/* Degree Select */}
        <div>
          <label className="block mb-1 text-gray-800 dark:text-gray-100">Degree *</label>
          <select
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            className={`w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              errors.degree ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select Degree</option>
            <option value="B.Tech Chemical 1st Year">B.Tech Chemical 1st Year</option>
            <option value="B.Tech Chemical 2nd Year">B.Tech Chemical 2nd Year</option>
            <option value="B.Tech Chemical 3rd Year">B.Tech Chemical 3rd Year</option>
            <option value="B.Tech Chemical 4th Year">B.Tech Chemical 4th Year</option>
          </select>
          {errors.degree && <p className="text-sm text-red-500">{errors.degree}</p>}
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

        {/* Resume/Image Upload */}
        <div>
          <label className="block mb-1 text-gray-800 dark:text-gray-100">Resume / Image *</label>
          <ImageUpload
            onUploadComplete={(publicId) => {
              setFormData((prev) => ({ ...prev, publicId }));
              setErrors((prev) => ({ ...prev, publicId: '' }));
            }}
            onUploadError={(error) => setErrors((prev) => ({ ...prev, publicId: error }))}
            required
            error={errors.publicId}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
