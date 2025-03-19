"use client";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar/page";
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
  const [form, setForm] = useState({ id: "", nama: "", quantity: "", layak: "", tidak_layak: "" });
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
      const res = await axios.get("/api/kelas/vii/a");
      setItems(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  //  input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.quantity || !form.layak || !form.tidak_layak) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      if (isEditing) {
        await axios.put("/api/kelas/vii/a", form);
        Swal.fire("Success", "Data berhasil diperbarui!", "success");
      } else {
        await axios.post("/api/kelas/vii/a", form);
        Swal.fire("Success", "Data berhasil ditambahkan!", "success");
      }
      fetchItems();
      setForm({ id: "", nama: "", quantity: "", layak: "", tidak_layak: "" });
      setIsEditing(false);
      setShowForm(false);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      Swal.fire("Error", "Gagal menyimpan data!", "error");
    }
  };

  // Hapus data
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/kelas/vii/a", { data: { id } });
          fetchItems();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the item.",
            icon: "error",
          });
        }
      }
    });
  };

  // Set form untuk mode edit
  const handleEdit = (item) => {
    setForm(item);
    setIsEditing(true);
    setShowForm(true);
  };

  // Tampilkan form untuk menambah data baru
  const handleAddNew = () => {
    setForm({ id: "", nama: "", quantity: "", layak: "", tidak_layak: "" });
    setIsEditing(false);
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

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };
  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      alert("Anda tidak memiliki akses ke halaman ini!");
      router.push("/keuangan-dashboard");
    }
  });

  return (
    <div className="flex relative">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex flex-col p-4 flex-grow">
        <h2 className="text-3xl font-bold my-3 no-print">Input</h2>
        <p className="text-xl font-mono no-print">Pilih Data Ruang</p>
        <div className="flex justify-between no-print">
          <div className="relative flex-col text-left mt-3 ">
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
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 rounded-md w-24 h-11 text-sm border border-white p-2 items-center justify-center transition-all shadow-xl ease-in-out duration-500 text-white hover:bg-indigo-700 hover:scale-105"
          >
            Add New
          </button>
        </div>
        {/* Ruang kelas */}
        <div className="gap-3 flex mt-4 no-print">
          <Link href={"/sarpras"} className="flex w-9 h-9 rounded-xl border border-gray-500 justify-center items-center cursor-pointer hover:bg-gray-100">
            A
          </Link>
          <Link href={"/sarpras/kelas/vii/b"} className="flex w-9 h-9 rounded-xl border border-gray-500 justify-center items-center cursor-pointer hover:bg-gray-100">
            B
          </Link>
        </div>
        {/* Tabel Ruangan */}
        <h2 className="flex justify-center text-3xl font-bold my-3">Data Kelas VII A</h2>
        <div className="overflow-x-auto mt-6 w-full">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nama Barang</th>
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
                  <td className="border align-middle p-2">{item.quantity}</td>
                  <td className="border align-middle p-2">{item.layak}</td>
                  <td className="border align-middle p-2">{item.tidak_layak}</td>
                  <td className="border  p-2 flex gap-2 no-print">
                    <button onClick={() => handleEdit(item)} className="px-3 py-1 transition-all ease-in-out duration-500 bg-indigo-600 hover:scale-105 hover:bg-indigo-700 text-white rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1 transition-all ease-in-out duration-500 bg-red-500 hover:scale-105 hover:bg-red-600 text-white rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal overlay untuk form Add New / Edit */}
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
                  <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Nama Barang" className="p-2 border rounded" />
                  <input type="text" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="p-2 border rounded" />
                  <input type="number" name="layak" value={form.layak} onChange={handleChange} placeholder="Layak" className="p-2 border rounded" />
                  <input type="number" name="tidak_layak" value={form.tidak_layak} onChange={handleChange} placeholder="Tidak Layak" className="p-2 border rounded" />
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    {isEditing ? "Update" : "Tambah"}
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
