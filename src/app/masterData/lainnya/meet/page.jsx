"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import DropdownLainnya from "@/app/components/master/DropdownLain";

const Page = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: "",
    nama: "",
    quantity: "",
    kategori: "",
    layak: "", // Default kosong dulu, nanti diisi otomatis
    tidak_layak: "", // Default kosong dulu, nanti diisi otomatis
    Date: "", // Field untuk menyimpan tanggal pembuatan
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [time, setTime] = useState(null);

  // Ambil data saat halaman dimuat
  useEffect(() => {
    fetchItems();
  }, []);

  // ambil data dari API
  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/lainnya/meet");
      setItems(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.quantity || !form.kategori) {
      alert("Semua field harus diisi!");
      return;
    }

    let payload = {
      ...form,
      layak: Number(form.quantity), // Otomatis set layak = quantity
      tidak_layak: 0, // Default 0
    };

    // Jika menambah data baru, set tanggal pembuatan
    if (!isEditing) {
      payload.Date = format(new Date(), "dd/MM/yyyy HH:mm:ss");
    }

    try {
      if (isEditing) {
        await axios.put("/api/lainnya/meet", payload);
        Swal.fire("Success", "Data berhasil diperbarui!", "success");
      } else {
        await axios.post("/api/lainnya/meet", payload);
        Swal.fire("Success", "Data berhasil ditambahkan!", "success");
      }
      fetchItems();
      setForm({ id: "", nama: "", quantity: "", kategori: "", layak: "", tidak_layak: "", Date: "" });
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
          await axios.delete("/api/lainnya/meet", { data: { id } });
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
    setForm({ id: "", nama: "", quantity: "", kategori: "", layak: "", tidak_layak: "", Date: "" });
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

  // Waktu sekarang
  useEffect(() => {
    setTime(new Date()); // Set waktu pertama kali di client
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
  }, []);

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
            <DropdownLainnya />
          </div>
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 rounded-md w-24 h-11 text-sm border border-white p-2 items-center justify-center transition-all shadow-xl ease-in-out duration-500 text-white hover:bg-indigo-700 hover:scale-105"
          >
            Add New
          </button>
        </div>

        {/* Tabel Ruangan */}
        <h2 className="flex justify-center text-3xl font-bold my-3">Data Master Ruang Meeting</h2>
        <div className="overflow-x-auto mt-6 w-full">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nama Barang</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Layak</th>
                <th className="border p-2">Tidak Layak</th>
                <th className="border p-2 w-28">Created At</th>
                <th className="border p-2 no-print w-28">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                // Jika item.createdAt ada (tipe Firestore Timestamp), ubah jadi string
                let createdAtString = "";
                if (item.createdAt && item.createdAt.toDate) {
                  createdAtString = format(item.createdAt.toDate(), "dd/MM/yyyy HH:mm:ss");
                }

                return (
                  <tr key={item.id} className="border text-center even:bg-gray-100">
                    <td className="border align-middle p-2">{index + 1}</td>
                    <td className="border align-middle p-2">{item.nama}</td>
                    <td className="border align-middle p-2">{item.quantity}</td>
                    <td className="border align-middle p-2">{item.kategori}</td>
                    <td className="border align-middle p-2">{item.layak}</td>
                    <td className="border align-middle p-2">{item.tidak_layak}</td>
                    <td className="border align-middle p-2">{createdAtString || item.Date}</td>
                    <td className="border p-4 flex gap-2 no-print">
                      <button onClick={() => handleEdit(item)} className="px-3 py-1 transition-all ease-in-out duration-500 bg-indigo-600 hover:scale-105 hover:bg-indigo-700 text-white rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1 transition-all ease-in-out duration-500 bg-red-500 hover:scale-105 hover:bg-red-600 text-white rounded">
                        Delete
                      </button>
                    </td>
                    {/* Menampilkan createdAt (atau Date jika Anda masih menggunakannya) */}
                  </tr>
                );
              })}
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
                  <div>
                    <label htmlFor="nama">Nama</label>
                    <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Nama Barang" className="p-2 border rounded" />
                  </div>
                  <div>
                    <label htmlFor="quantity"> Quantity</label>
                    <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="p-2 border rounded" />
                  </div>
                </div>
                <div className="mt-4">
                  <select name="kategori" value={form.kategori} onChange={handleChange} className="p-2 border rounded w-full">
                    <option value="">Pilih Kategori</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Peralatan">Peralatan</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    {isEditing ? "Update" : "Tambah"}
                  </button>
                </div>
                <div>Created At : {time ? format(time, "dd/MM/yyyy HH:mm:ss") : "Loading..."}</div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
