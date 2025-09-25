"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student"); // 👈 Choose student/prof

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn(`${role}-credentials`, {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      // 🚫 Show error toast
      toast.error(res.error || "Login failed");
      return; // stay on login page
    }

    // ✅ Redirect based on role
    if (role === "student") {
      router.push("/project");
    } else if (role === "prof") {
      router.push("/uploaded-projects");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
     

      {/* Background Image */}
      <Image
        src="/iit.jammu.webp"
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
            src="/iit-jammu-01logo.webp"
            alt="IIT Jammu Logo"
            width={80}
            height={80}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-white">
            IIT Jammu Login Portal
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Sign in with your institute credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div>
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

          <div>
            <label className="text-sm text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="xyz@iitjammu.ac.in"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-4">
          Only for IIT Jammu students & professors
        </p>
        <Link
          className="text-center text-gray-300 text-2sm mt-4 ml-18"
          href="/register"
        >
          Don&apos;t have account?{" "}
          <span className="text-blue-500">Register here</span>
        </Link>
      </div>
    </div>
  );
}
