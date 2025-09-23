"use client"
import { NavbarDemo } from "@/components/navbar";
import { CardHoverEffectDemo } from "@/components/projectcard";
import Image from "next/image";

export default function Home() {
  return (
   <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300`}>
      {/* Fixed Navbar */}
      
      
      {/* Content with padding to account for fixed navbar */}
      <div className="pt-16"> {/* Adjust this value based on your navbar height */}
        <CardHoverEffectDemo />
      </div>
    </div>
  );
}
