"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import Link from "next/link";
import DropdownRekap from "@/app/components/rekap/DropdownRekap";
import Image from "next/image";

const Page = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [showInventoryPrint, setShowInventoryPrint] = useState(false);
  const [items, setItems] = useState([]);

  // Ambil data saat halaman dimuat
  useEffect(() => {
    fetchItems();
  }, []);

  // fetching dta
  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/kelas/viii/a");
      setItems(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      console.log("Token yang diterima:", token);
      const decoded = jwt.decode(token);
      setUserData(decoded);
    } catch (error) {
      console.error("Token decoding failed:", error);
      localStorage.removeItem("token");
      router.push("/");
    }
  }, []);

  const handlePrint = async () => {
    await fetchItems();
    setShowInventoryPrint(true);
    setTimeout(() => {
      window.print();
      setShowInventoryPrint(false);
    }, 500);
  };
  return (
    <div className="flex relative">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex flex-col p-4 flex-grow">
        <h2 className="text-3xl font-bold my-3 no-print">Input</h2>
        <p className="text-xl font-mono no-print">Pilih Data Ruang</p>

        <div className="flex justify-between">
          <div className="flex justify-between no-print">
            <div className="relative flex-col text-left mt-3">
              <DropdownRekap />
              <div className="flex gap-3">
                <div className="w-11 h-11 border border-gray-400 rounded-xl mt-4">
                  <Link href="/rekap/kelas/viii/a" className="w-full h-full flex object-fill items-center justify-center">
                    A
                  </Link>
                </div>
                <div className="w-11 h-11 border border-gray-400 rounded-xl mt-4">
                  <Link href="/rekap/kelas/viii/b" className="w-full h-full flex object-fill items-center justify-center">
                    B
                  </Link>
                </div>
                <div className="w-11 h-11 border border-gray-400 rounded-xl mt-4">
                  <Link href="/rekap/kelas/viii/c" className="w-full h-full flex object-fill items-center justify-center">
                    C
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handlePrint} className="flex w-60 justify-center p-3 no-print items-center h-8 rounded-md bg-green-600 text-white hover:bg-green-700 active:scale-90 transition-all duration-300 ease-in-out">
            Print Data Usulan
          </button>
        </div>
        {/* Tabel Ruangan */}
        <h2 className="flex justify-center text-3xl font-bold my-3">Rekap Data Kelas VIII A</h2>
        <div className="overflow-x-auto mt-6 w-full">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nama Barang</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Layak</th>
                <th className="border p-2">Tidak Layak</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border text-center even:bg-gray-100">
                  <td className="border align-middle p-2">{index + 1}</td>
                  <td className="border align-middle p-2">{item.nama}</td>
                  <td className="border align-middle p-2">{item.kategori}</td>
                  <td className="border align-middle p-2">{item.quantity}</td>
                  <td className="border align-middle p-2">{item.layak}</td>
                  <td className="border align-middle p-2">{item.tidak_layak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showInventoryPrint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white mt-7 bg-opacity-50 backdrop-blur-sm inventory-print">
            <div className="bg-white w-full mx-auto border-2 border-gray-300 p-5">
              <Image className="absolute top-4 left-4 w-20" src="/image/logo.png" alt="Logo Sekolah" width={100} height={100} priority={true} />
              {/* Header Template bagiane print*/}
              <div className="text-center mb-4">
                <h1 className="text-xl font-bold uppercase">LAPORAN DATA REKAP BARANG</h1>
                <h2 className="text-lg font-semibold">MTS MIFTAHUL ULUUM</h2>
                <p className="text-md font-medium">Tahun Ajaran 2024/2025</p>
              </div>

              {/* Tabel semua data */}
              <table className="w-full border-collapse mb-4 text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Nama Barang</th>
                    <th className="border p-2">Kategori</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Layak</th>
                    <th className="border p-2">Tidak Layak</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="even:bg-gray-100">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{item.nama}</td>
                      <td className="border p-2 text-center">{item.kategori}</td>
                      <td className="border p-2 text-center">{item.quantity}</td>
                      <td className="border p-2 text-center">{item.layak}</td>
                      <td className="border p-2 text-center">{item.tidak_layak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Catatan */}
              <div className="text-sm mb-4">
                <p className="font-bold">Catatan:</p>
                <ul className="list-disc list-inside">
                  <li>Laporan ini memuat seluruh data usulan barang yang telah diinput.</li>
                  <li>Mohon periksa kembali data sebelum disetujui atau diproses lebih lanjut.</li>
                  <li>Pastikan semua data benar dan up-to-date.</li>
                </ul>
              </div>

              {/* Tanda Tangan dikasi ttd asli kenek*/}
              <div className="flex justify-between items-center text-sm mt-8">
                <div>
                  <p>Blitar, {new Date().toLocaleDateString("id-ID")}</p>
                  <p>Penanggung Jawab Inventory</p>
                  <div className="h-16"></div>
                  <p className="font-bold">{userData?.name || "Kepala Sekolah"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
