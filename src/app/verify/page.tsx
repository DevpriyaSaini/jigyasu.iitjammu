"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import axios, { AxiosError } from "axios";

export default function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract from query string
  const email = searchParams.get("email");
  const role = (searchParams.get("role") as "student" | "prof") || "student";
  const studentname = searchParams.get("studentname");
  const profname = searchParams.get("profname");
  console.log({ email, role, studentname, profname });
  

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Pick API endpoint dynamically
      const endpoint =
        role === "student" ? "/api/student-sign-up" : "/api/prof-sign-up";

      // ✅ Choose correct name field
      const payload =
        role === "student"
          ? { studentname, email, otp }
          : { profname, email, otp };

      console.log("Verifying with:", payload, endpoint);

      const res = await axios.put(endpoint, payload);
      setMessage(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      console.error("Verification error:", axiosErr);

      setError(
        axiosErr.response?.data?.message || "Verification failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      {/* Background image */}
      <Image
        src="/iit.jammu.webp"
        alt="IIT Jammu"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Verification Card */}
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
            Verify {role === "student" ? "Student" : "Professor"} Email
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Please enter the OTP sent to your email
          </p>
        </div>

        {!email ? (
          <p className="text-red-400 text-center">
            Required details are missing in the verification link.
          </p>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-sm text-white">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP"
                className="w-full px-4 py-2 mt-1 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-gray-300/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {message && (
              <p className="text-green-400 text-sm text-center">{message}</p>
            )}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-md disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-300 text-sm mt-4">
          Check your inbox for the OTP
        </p>
      </div>
    </div>
  );
}
