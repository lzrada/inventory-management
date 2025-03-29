"use client";
import { faFile, faLandmark, faCalendar } from "@fortawesome/free-solid-svg-icons"; //icons
import Sidebar from "@/app/components/Sidebar"; //component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; //icons
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
  const [totalDocCount, setTotalDocCount] = useState(0);
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

  useEffect(() => {
    const fetchTotalDocCount = async () => {
      try {
        // Tentukan daftar koleksi yang ada di database Anda
        const collectionsToCount = ["usulan", "vii_a", "vii_b", "viii_a", "viii_b", "viii_c", "ix_a", "ix_b", "ix_c"]; // Tambahkan nama koleksi lain jika ada
        let totalCount = 0;
        for (const collName of collectionsToCount) {
          const querySnapshot = await getDocs(collection(db, collName));
          totalCount += querySnapshot.size;
        }
        setTotalDocCount(totalCount);
      } catch (error) {
        console.error("Gagal mengambil total dokumen:", error);
      }
    };

    fetchTotalDocCount();
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
            <div className="flex justify-center items-center p-4 font-thin italic">jumlah seluruh data barang sebanyak : {totalDocCount || "Loading..."} Data</div>
          </div>
          <div className="w-60 h-44 bg-yellow-400 shadow-2xl rounded">
            <div className="flex justify-center items-center mt-3">
              <FontAwesomeIcon icon={faFile} className="w-10 h-10 " />
            </div>
            <div className="flex justify-center items-center p-4 font-thin italic">jumlah usulan tersedia sebanyak : {usulanCount || "Loading..."} Data </div>
          </div>
          <div className="w-60 h-44 bg-green-500 shadow-2xl rounded">
            <div className="flex justify-center items-center mt-3">
              <FontAwesomeIcon icon={faCalendar} className="w-10 h-10 " />
            </div>
            <div className="flex justify-center items-center p-4 font-thin italic">tanggal dan waktu sekarang : {time ? format(time, "dd/MM/yyyy HH:mm:ss") : "Loading..."} WIB</div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2  transform -translate-x-2.5 -translate-y-1/2 -z-10">
          <Image src={"/Image/logo.png"} width={300} height={300} alt="logo tengah" className="opacity-20 " />
        </div>

        <div className="fixed bottom-0 -z-10 bg-[#1D1616] w-full h-8 text-white">
          <marquee behavior="" direction="left" className="text-green-300 font-serif">
            Visi : "Terwujudnya Madrasah yang melahirkan sumberdaya manusia berahklak terpuji,berkebangsaan,berkemandirian,Modern,dan berkeumatan dengan prinsip aswaja"
          </marquee>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
