"use client";
import Sidebar from "@/app/sidebar/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion"; // Tambahkan AnimatePresence

const Usulan = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  const [items, setItems] = useState([]); // Data barang
  const [form, setForm] = useState({ id: "", pengusul: "", namaBarang: "", quantity: "", perkiraanTotal: "", perkiraanHarga: "", keperluan: "", status: "" }); // Form input
  const [isEditing, setIsEditing] = useState(false); // Status edit
  const [showForm, setShowForm] = useState(false); // State untuk mengontrol visibilitas form

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }, // Tambahkan animasi exit
  };

  // 🔹 Ambil data saat halaman dimuat
  useEffect(() => {
    fetchItems();
  }, []);

  // 🔸 Fungsi untuk mengambil data dari API
  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/usulan");
      setItems(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // 🔸 Fungsi untuk menangani input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    // Hitung perkiraan total harga jika harga satuan atau quantity berubah
    if (name === "perkiraanHarga" || name === "quantity") {
      const perkiraanHarga = parseFloat(updatedForm.perkiraanHarga) || 0;
      const quantity = parseFloat(updatedForm.quantity) || 0;
      updatedForm.perkiraanTotal = (perkiraanHarga * quantity).toString();
    }

    setForm(updatedForm);
  };

  // 🔹 Tambah data baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pengusul || !form.namaBarang || !form.perkiraanTotal || !form.quantity || !form.perkiraanHarga || !form.keperluan || !form.status) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      if (isEditing) {
        // Jika sedang edit, update data
        await axios.put("/api/usulan", form);
        Swal.fire("Success", "Data berhasil diperbarui!", "success");
      } else {
        // Jika bukan edit, tambah data baru
        await axios.post("/api/usulan", form);
        Swal.fire("Success", "Data berhasil ditambahkan!", "success");
      }
      fetchItems(); // Refresh data setelah update
      setForm({ id: "", pengusul: "", namaBarang: "", perkiraanHarga: "", perkiraanTotal: "", keperluan: "", status: "", quantity: "" });
      setIsEditing(false);
      setShowForm(false); // Sembunyikan form setelah submit
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      Swal.fire("Error", "Gagal menyimpan data!", "error");
    }
  };

  // 🔹 Hapus data
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
          await axios.delete("/api/usulan", { data: { id } });
          fetchItems(); // Refresh data
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

  // 🔹 Set form untuk mode edit
  const handleEdit = (item) => {
    if (showForm && isEditing) {
      setShowForm(false); // Sembunyikan form jika sedang edit
    } else {
      setForm(item);
      setIsEditing(true);
      setShowForm(true); // Tampilkan form saat edit
    }
  };

  // 🔹 Tampilkan form untuk menambah data baru
  const handleAddNew = () => {
    if (showForm && !isEditing) {
      setShowForm(false); // Sembunyikan form jika sudah terbuka dan bukan mode edit
    } else {
      setForm({ id: "", pengusul: "", namaBarang: "", quantity: "", perkiraanHarga: "", perkiraanTotal: "", keperluan: "", status: "" });
      setIsEditing(false);
      setShowForm(true); // Tampilkan form jika belum terbuka
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

  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex ">
        <div className="no-print">
          <Sidebar />
        </div>
        <div className="flex-col my-5 w-full ">
          <h2 className="flex justify-center text-3xl font-bold ">Data Usulan Barang</h2>
          <div className="flex justify-between">
            <div className="no-print">
              <button onClick={handlePrint} className=" flex ml-3 w-22 justify-center p-3 items-center h-8 rounded-md bg-indigo-600 text-white hover:bg-indigo-700  active:scale-90 transition-all duration-300 ease-in-out ">
                Print
              </button>
            </div>
            <div className="no-print">
              <button onClick={handleAddNew} className=" flex mr-5 w-22 justify-center p-3 items-center h-8 rounded-md bg-indigo-600 text-white hover:bg-indigo-700  active:scale-90 transition-all duration-300 ease-in-out ">
                add new
              </button>
            </div>
          </div>
          <div className="overflow-x-auto p-2 mt-2 w-full">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Pengusul</th>
                  <th className="border p-2">Nama Barang</th>
                  <th className="border p-2">quantity</th>
                  <th className="border p-2">Perkiraan harga satuan</th>
                  <th className="border p-2">Perkiraan jumlah harga</th>
                  <th className="border p-2">Keperluan</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2 no-print">Edit</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.pengusul}</td>
                    <td className="border p-2">{item.namaBarang}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">{item.perkiraanHarga}</td>
                    <td className="border p-2">{item.perkiraanTotal}</td>
                    <td className="border p-2">{item.keperluan}</td>
                    <td className="border p-2">{item.status}</td>
                    <td className="border p-2 flex gap-2 no-print ">
                      <button onClick={() => handleEdit(item)} className="px-3  transition-all ease-in-out duration-500 bg-indigo-600 hover:scale-105 hover:bg-indigo-700 text-white rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="px-3 transition-all ease-in-out duration-500 bg-red-500 hover:scale-105 hover:bg-red-600 text-white rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <AnimatePresence>
              {showForm && (
                <motion.div initial="hidden" animate="visible" exit="exit" variants={variants} transition={{ duration: 0.3, ease: "easeInOut" }}>
                  <div className="mt-6 ">
                    <h1 className=" flex justify-center text-2xl font-bold mb-4 ">Manajemen Barang</h1>
                    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg bg-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="pengusul" value={form.pengusul} onChange={handleChange} placeholder="Pengusul" className="p-2 border rounded" />
                        <input type="text" name="namaBarang" value={form.namaBarang} onChange={handleChange} placeholder="Nama barang" className="p-2 border rounded" />
                        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="p-2 border rounded" />
                        <input type="number" name="perkiraanHarga" value={form.perkiraanHarga} onChange={handleChange} placeholder="Perkiraan harga satuan" className="p-2 border rounded" />
                        <input type="text" name="keperluan" value={form.keperluan} onChange={handleChange} placeholder="keperluan" className="p-2 border rounded" />
                        <input type="text" name="status" value={form.status} onChange={handleChange} placeholder="status" className="p-2 border rounded" />
                      </div>
                      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                        {isEditing ? "Update" : "Tambah"}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};
export default Usulan;
