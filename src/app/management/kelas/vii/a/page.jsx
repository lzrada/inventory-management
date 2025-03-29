"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Page = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: "",
    nama: "",
    quantity: "",
    kategori: "",
    layak: "",
    tidak_layak: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Ambil data saat halaman dimuat
  useEffect(() => {
    fetchItems();
  }, []);

  // ambil data dari API
  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/master/kelas/vii/a");
      setItems(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // handle change input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Jika field numeric, pastikan disimpan sebagai angka
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "layak" || name === "tidak_layak" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi field minimal
    if (!form.nama || !form.quantity || !form.kategori) {
      alert("Data tidak valid!");
      return;
    }

    // Hanya mode edit yang digunakan
    const totalValid = Number(form.layak) + Number(form.tidak_layak);
    if (totalValid > Number(form.quantity)) {
      Swal.fire({
        title: "Terjadi Kesalahan!",
        text: "Jumlah layak dan tidak layak tidak valid!",
        icon: "question",
      });
      return;
    }

    try {
      // Lakukan PUT (update) saja, karena tidak ada add new
      await axios.put("/api/master/kelas/vii/a", form);
      Swal.fire("Success", "Data berhasil diperbarui!", "success");

      fetchItems();
      setForm({ id: "", nama: "", quantity: "", kategori: "", layak: "", tidak_layak: "" });
      setIsEditing(false);
      setShowForm(false);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      Swal.fire("Error", "Gagal menyimpan data!", "error");
    }
  };

  // Set form untuk mode edit
  const handleEdit = (item) => {
    setForm(item);
    setIsEditing(true);
    setShowForm(true);
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

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="flex relative">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex flex-col p-4 flex-grow">
        <h2 className="text-3xl font-bold my-3 no-print">Input</h2>
        <p className="text-xl font-mono no-print">Pilih Data Ruang</p>

        <div className="flex justify-between no-print">
          <div className="relative flex-col text-left mt-3">
            <button onClick={toggleDropdown} className="inline-flex justify-center w-44 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100">
              Pilih Opsi
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute left-0 w-44 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg"
                >
                  <Link href={"/sarpras"}>
                    <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kelas VII</li>
                  </Link>
                  <Link href={"/sarpras/kelas/viii"}>
                    <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kelas VIII</li>
                  </Link>
                  <Link href={"/sarpras/kelas/ix"}>
                    <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kelas IX</li>
                  </Link>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          {/* Hapus tombol Add New */}
          {/* <button
            onClick={handleAddNew}
            className="bg-indigo-600 rounded-md w-24 h-11 text-sm border border-white p-2 items-center justify-center transition-all shadow-xl ease-in-out duration-500 text-white hover:bg-indigo-700 hover:scale-105"
          >
            Add New
          </button> */}
        </div>

        {/* Tabel Ruangan */}
        <h2 className="flex justify-center text-3xl font-bold my-3">Management Data Kelas VII A</h2>
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
                <th className="border p-2 no-print w-28">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border text-center">
                  <td className="border align-middle p-2">{index + 1}</td>
                  <td className="border align-middle p-2">{item.nama}</td>
                  <td className="border align-middle p-2">{item.kategori}</td>
                  <td className="border align-middle p-2">{item.quantity}</td>
                  <td className="border align-middle p-2">{item.layak}</td>
                  <td className="border align-middle p-2">{item.tidak_layak}</td>
                  <td className="border p-2 flex gap-2 no-print">
                    <button onClick={() => handleEdit(item)} className="px-7  flex items-center justify-center py-1 transition-all ease-in-out duration-500 bg-indigo-600 hover:scale-105 hover:bg-indigo-700 text-white rounded">
                      Edit
                    </button>
                    {/* Hapus tombol Delete */}
                    {/* <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 transition-all ease-in-out duration-500 bg-red-500 hover:scale-105 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal overlay untuk form Edit (tidak ada Add New) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="bg-gray-100 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h1 className="flex justify-center text-2xl font-bold mb-4">Manajemen Barang</h1>
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama">Nama</label>
                    {/* Read-only */}
                    <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Nama Barang" className="p-2 border rounded bg-gray-200 cursor-not-allowed" readOnly />
                  </div>
                  <div>
                    <label htmlFor="quantity">Quantity</label>
                    {/* Read-only */}
                    <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="p-2 border rounded bg-gray-200 cursor-not-allowed" readOnly />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="kategori" className="block mb-1 font-medium">
                    Kategori
                  </label>
                  {/* Read-only */}
                  <select name="kategori" value={form.kategori} onChange={handleChange} className="p-2 border rounded bg-gray-200 cursor-not-allowed w-[95%]" disabled>
                    <option value="">Pilih Kategori</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Peralatan">Peralatan</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>

                {/* Input layak dan tidak layak untuk diedit */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="layak">Layak</label>
                    <input type="number" name="layak" value={form.layak} onChange={handleChange} placeholder="Layak" className="p-2 border rounded" />
                  </div>
                  <div>
                    <label htmlFor="tidak_layak">Tidak Layak</label>
                    <input type="number" name="tidak_layak" value={form.tidak_layak} onChange={handleChange} placeholder="Tidak Layak" className="p-2 border rounded" />
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
