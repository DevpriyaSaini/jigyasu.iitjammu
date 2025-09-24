"use client";

import { useEffect, useState } from "react";
import { HoverEffect } from "./ui/ard-hover-effect"; // ✅ fixed typo: "ard" → "card"
import axios from "axios";

interface Project {
  _id: string;
  projectname: string;
  description: string;
  email:string;
  deadline?: string;
  image: string;
  postedby: string;
}

export function CardHoverEffectDemo() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/upl-project");
        setProjects(res.data); // backend returns array of projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading projects...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect
        items={projects.map((project) => ({
          id: project._id,
          title: project.projectname,
          description: project.description,
          email:project.email,
          link: "#", // optionally replace with project link
          image: project.image,
          postedby: project.postedby,
          deadline: project.deadline,
        }))}
      />
    </div>
  );
}
