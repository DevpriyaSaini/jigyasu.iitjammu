"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function SignupRedirectPage() {
  const router = useRouter();
  const [role, setRole] = useState("student"); // student or prof

  const handleRedirect = () => {
    if (role === "student") {
      router.push("/student-signup");
    } else {
      router.push("/professor-signup");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      {/* Background Image */}
      <Image
        src="/iit.jammu.webp" // Make sure this exists in /public
        alt="IIT Jammu"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <Image
            src="/iit-jammu-01logo.webp" // Make sure this exists in /public
            alt="IIT Jammu Logo"
            width={80}
            height={80}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-white">IIT Jammu Signup Portal</h1>
          <p className="text-gray-300 text-sm mt-1">
            Choose your role to create an account
          </p>
        </div>

        {/* Role selector */}
        <div className="mb-4">
          <label className="text-sm text-white">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 text-black border border-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="student">Student</option>
            <option value="prof">Professor</option>
          </select>
        </div>

        <button
          onClick={handleRedirect}
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-md"
        >
          submit
        </button>

        <p className="text-center text-gray-300 text-sm mt-4">
          Only for IIT Jammu students & professors
        </p>
        <Link
          className="text-center text-gray-300 text-sm mt-4 block"
          href="/login"
        >
          Already have an account?{" "}
          <span className="text-blue-500">Login here</span>
        </Link>
      </div>
    </div>
  );
}
