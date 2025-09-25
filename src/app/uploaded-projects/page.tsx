'use client';

import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';

interface Project {
  _id: string;
  image: string;
  projectname: string;
  description: string;
  deadline?: string;
  postedby: string;

}

export default function Page() {
    const router=useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
 
  const fetchProjects = async () => {
    try {
      const res = await axios.patch('/api/upl-project'); // API to fetch projects
       console.log("res",res.data);
      setProjects(res.data);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects',error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
  const res = await axios.delete(`/api/applyjob/${id}`);
     
      
      if (res.status === 200) {
        setProjects(projects.filter((p) => p._id !== id));
        toast.success('Project deleted successfully');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || "Submission failed. Please try again.");
    } finally {
    }
  };

   const handlepush=()=>{
    router.push(`/view-application?projectId=${projects[0]?._id}`);
  } 


  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center py-10">Loading projects...</div>;

  return (
  <div className=" h-100% py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900" >
  <h1 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-gray-100 text-center">
    My Projects
  </h1>

  {projects.length === 0 ? (
    <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
      No projects found.
    </p>
  ) : (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project._id}
          className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-inner p-6 flex flex-col justify-between border border-gray-200 dark:border-gray-700"
        >
          {/* Image */}
          <div className="h-48 w-full overflow-hidden rounded-xl mb-4">
            <CldImage
              src={project.image as string}
              width={400}
              height={200}
              alt={project.projectname}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {project.projectname}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {project.description}
              </p>
              {project.deadline && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posted by: {project.postedby}
              </p>
            </div>

            {/* Delete Button */}
            <div className="mt-6 flex gap-10">
             
              <button
               onClick={handlepush}
                className="bg-blue-400 text-white px-4 py-2 rounded-xl font-medium shadow-sm border  transition-colors duration-150 "
              >
                View-Application
              </button>
               <button
                onClick={() => handleDelete(project._id)}
                className="bg-blue-400 text-white px-4 py-2 rounded-xl font-medium shadow-sm border  transition-colors duration-150 "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


  );
}
