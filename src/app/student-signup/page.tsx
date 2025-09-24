"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { div } from "motion/react-client";


export default function StudentSignupPage() {
  const router = useRouter();
  const [studentname, setStudentname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Axios automatically parses JSON, no need for res.json()
      const res = await axios.post("/api/student-sign-up", {
        studentname,
        email,
        password,
      });

      if (res.data.success) {
        router.push(`/verify?email=${email}&role=student&studentname=${studentname}`);// redirect on success
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err: any) {
      console.error(err);
      // Axios errors may have response object
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      <Image
        src="/iit.jammu.webp"
        alt="IIT Jammu"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <Image
            src="/iit-jammu-01logo.webp"
            alt="IIT Jammu Logo"
            width={80}
            height={80}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-white">Student Sign-Up</h1>
          <p className="text-gray-300 text-sm mt-1">
            Sign up with your institute credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white">Full Name</label>
            <input
              type="text"
              value={studentname}
              onChange={(e) => setStudentname(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="text-sm text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="2024xxxx@iitjammu.ac.in"
            />
          </div>

          <div>
            <label className="text-sm text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="********"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-4">
          Only for IIT Jammu students
        </p>

        <Link href="/login" className="text-center text-gray-300 text-sm mt-4 block">
          Already have an account? <span className="text-blue-500">Login here</span>
        </Link>
      </div>
    </div>
  );
}
