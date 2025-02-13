"use client";
import { faFile, faLandmark, faCalendar } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../sidebar/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import db from "@/app/services/firebase";
import { format } from "date-fns";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [usulanCount, setUsulanCount] = useState(0);
  const router = useRouter();

  // State untuk waktu
  const [time, setTime] = useState(null); // Awalnya null, baru di-set di client

  // Effect untuk memperbarui waktu setiap detik
  useEffect(() => {
    setTime(new Date()); // Set waktu pertama kali di client
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
  }, []);

  // Effect untuk memeriksa token dan mengambil data pengguna
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwt.decode(token); // Decode token tanpa verifikasi secret
      setUserData(decoded); // Simpan data pengguna dari token
    } catch (error) {
      console.error("Token decoding failed:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  // Effect untuk mengambil jumlah usulan dari Firestore
  useEffect(() => {
    const fetchUsulanCount = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usulan"));
        setUsulanCount(querySnapshot.size); // Menghitung jumlah dokumen di Firestore
      } catch (error) {
        console.error("Gagal mengambil jumlah usulan:", error);
      }
    };

    fetchUsulanCount();
  }, []);

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="grid grid-cols-3 mt-6 gap-14 mx-16">
          <div className="w-60 h-44 bg-red-500 shadow-2xl rounded">
            <div className="flex justify-center items-center mt-3">
              <FontAwesomeIcon icon={faLandmark} className="w-10 h-10" />
            </div>
            <div className="flex justify-center items-center p-4 font-thin italic">jumlah ruangan tersedia sebanyak : {/* ambil dari backend */} </div>
          </div>
          <div className="w-60 h-44 bg-yellow-400 shadow-2xl rounded">
            <div className="flex justify-center items-center mt-3">
              <FontAwesomeIcon icon={faFile} className="w-10 h-10 " />
            </div>
            <div className="flex justify-center items-center p-4 font-thin italic">jumlah usulan tersedia sebanyak : {usulanCount} </div>
          </div>
          <div className="w-60 h-44 bg-green-500 shadow-2xl rounded">
            <div className="flex justify-center items-center mt-3">
              <FontAwesomeIcon icon={faCalendar} className="w-10 h-10 " />
            </div>
            <div className="flex justify-center items-center p-4 font-thin italic">tanggal dan waktu sekarang : {time ? format(time, "dd/MM/yyyy HH:mm:ss") : "Loading..."}</div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2  transform -translate-x-2.5 -translate-y-1/2 -z-10">
          <Image src={"/Image/logo.png"} width={300} height={300} alt="logo tengah" className="opacity-20 " />
        </div>

        <div className="fixed bottom-0 -z-10 bg-[#1D1616] w-full h-8 text-white">
          <marquee behavior="" direction="left">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo excepturi velit, amet quod ratione, fugiat, dolorum dicta recusandae cupiditate quo molestias quaerat quasi et quam. Omnis mollitia sunt vel consectetur!
          </marquee>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
