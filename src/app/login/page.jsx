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
  const router = useRouter();
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        localStorage.setItem("token", data.token); // Menyimpan token ke localStorage
        console.log("Token disimpan:", data.token); // Debugging token
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
      console.log("Token yang diterima:", token); // Log token untuk debugging
      const decoded = jwt.decode(token); // Decode token tanpa verifikasi secret
      setUserData(decoded); // Simpan data pengguna dari token
    } catch (error) {
      console.error("Token decoding failed:", error); // Debugging
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-900">
      {/* Background Image */}
      <Image src="/Image/bg.jpeg" fill={true} alt="Background" className="absolute inset-0 object-cover opacity-60" />

      {/* Login Card */}
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <p className="text-gray-600 text-sm mb-4">Masuk untuk melanjutkan</p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input type="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </form>

        {/* <p className="text-gray-500 text-sm mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Daftar
          </Link>
        </p> */}
      </div>
    </div>
  );
}
