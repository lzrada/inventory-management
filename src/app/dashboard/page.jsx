"use client";
import { faFile, faLandmark } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../sidebar/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

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
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="grid grid-cols-3 mt-6 gap-14 mx-16">
          <div className="w-60 h-44 bg-red-500 shadow-2xl rounded">
            <div className="flex justify-center items-center mt-3">
              <FontAwesomeIcon icon={faLandmark} className="w-10 h-10 " />
            </div>
            <div className="flex justify-center items-center p-4 font-thin italic">jumlah ruangan tersedia sebanyak : {/* ambil dari backend */} </div>
          </div>
          <div className="w-60 h-44 bg-yellow-400 shadow-2xl rounded">
            <div className="flex justify-center items-center mt-3">
              <FontAwesomeIcon icon={faFile} className="w-10 h-10 " />
            </div>
            <div className="flex justify-center items-center p-4 font-thin italic">jumlah ulasan tersedia sebanyak : {/* ambil dari backend */} </div>
          </div>
          <div className="w-60 h-44 bg-green-500 shadow-2xl rounded"></div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
