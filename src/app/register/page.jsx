// "use client";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { registerWithEmailAndPassword } from "../services/firebase";
// import Image from "next/image";
// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     try {
//       const user = await registerWithEmailAndPassword(email, password);
//       console.log("Registered user:", user);
//       router.push("/login");
//       // Redirect to another page or show a success message
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="relative w-full h-screen flex items-center justify-center bg-gray-900">
//         {/* Background Image */}
//         <Image src="/Image/bg.jpeg" fill={true} alt="Background" className="absolute inset-0 object-cover opacity-60" />

//         {/* Login Card */}
//         <div className="relative z-10 bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
//           <h2 className="text-2xl font-bold text-gray-800">Login</h2>
//           <p className="text-gray-600 text-sm mb-4">Masuk untuk melanjutkan</p>

//           <form className="space-y-4" onSubmit={handleRegister}>
//             <input type="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
//             <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
//             {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//             <button type="submit" className="bg-transparent border-2 bg-blue-400 text-white w-full px-6 py-2 rounded-full font-medium shadow-md hover:bg-white hover:text-black transition-colors" disabled={isLoading}>
//               {isLoading ? (
//                 "Registering..."
//               ) : (
//                 <>
//                   <i className="fas fa-check mr-2"></i>CREATE ACCOUNT
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Register;
