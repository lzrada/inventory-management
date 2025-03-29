"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Loading from "../loading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mulai loading
    setError(null); // Reset error

    try {
      const response = await fetch("/../api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const data = await response.json(); // Ambil data dari API

      if (data.token) {
        localStorage.setItem("token", data.token); // Simpan token
        // Jika login sebagai admin
        router.push("/dashboard");
      } else {
        setError("Failed to retrieve token. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      setUserData(decoded);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-900">
      {/* Background Image */}
      <Image src="/Image/bg.jpeg" fill={true} alt="Background" className="absolute inset-0 object-cover opacity-60" />

      {/* Overlay saat loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
          <Loading />
        </div>
      )}

      {/* Login Card */}
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <p className="text-gray-600 text-sm mb-4">Masuk untuk melanjutkan</p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
