"use client";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Usulan = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  // State untuk data usulan
  const [items, setItems] = useState([]);
  // State form
  const [form, setForm] = useState({
    id: "",
    pengusul: "",
    namaBarang: "",
    quantity: "",
    perkiraanTotal: "",
    perkiraanHarga: "",
    keperluan: "",
    status: "",
  });
  // Kontrol form edit/tambah
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // State untuk menampilkan overlay template cetak
  const [showInventoryPrint, setShowInventoryPrint] = useState(false);

  // Ambil data saat halaman dimuat
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/usulan");
      setItems(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // Input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    // Hitung perkiraan total jika harga satuan atau quantity berubah
    if (name === "perkiraanHarga" || name === "quantity") {
      const perkiraanHarga = parseFloat(updatedForm.perkiraanHarga) || 0;
      const quantity = parseFloat(updatedForm.quantity) || 0;
      updatedForm.perkiraanTotal = (perkiraanHarga * quantity).toString();
    }

    setForm(updatedForm);
  };

  // Submit (tambah / update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pengusul || !form.namaBarang || !form.perkiraanTotal || !form.quantity || !form.perkiraanHarga || !form.keperluan || !form.status) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      if (isEditing) {
        // Update data
        await axios.put("/api/usulan", form);
        Swal.fire("Success", "Data berhasil diperbarui!", "success");
      } else {
        // Tambah data
        await axios.post("/api/usulan", form);
        Swal.fire("Success", "Data berhasil ditambahkan!", "success");
      }
      fetchItems();
      setForm({
        id: "",
        pengusul: "",
        namaBarang: "",
        quantity: "",
        perkiraanHarga: "",
        perkiraanTotal: "",
        keperluan: "",
        status: "",
      });
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
      text: "Data akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/usulan", { data: { id } });
          fetchItems();
          Swal.fire("Deleted!", "Data berhasil dihapus.", "success");
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          Swal.fire("Error!", "Gagal menghapus data.", "error");
        }
      }
    });
  };

  // Set form edit
  const handleEdit = (item) => {
    if (showForm && isEditing) {
      setShowForm(false);
    } else {
      setForm(item);
      setIsEditing(true);
      setShowForm(true);
    }
  };

  // Tampilkan form tambah
  const handleAddNew = () => {
    if (showForm && !isEditing) {
      setShowForm(false);
    } else {
      setForm({
        id: "",
        pengusul: "",
        namaBarang: "",
        quantity: "",
        perkiraanHarga: "",
        perkiraanTotal: "",
        keperluan: "",
        status: "",
      });
      setIsEditing(false);
      setShowForm(true);
    }
  };

  // Cek token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      setUserData(decoded);
    } catch (error) {
      console.error("Token decoding failed:", error);
      localStorage.removeItem("token");
      router.push("/");
    }
  }, []);

  // === Fungsi Print dengan Template ===
  const handlePrint = async () => {
    // Fetch data terbaru sebelum print
    await fetchItems();
    // Tampilkan overlay template cetak
    setShowInventoryPrint(true);
    // Beri jeda agar template tampil, lalu trigger window.print
    setTimeout(() => {
      window.print();
      // Setelah print, sembunyikan overlay template
      setShowInventoryPrint(false);
    }, 500);
  };
  // ==========================================================================

  return (
    <div>
      <div className="flex">
        {/* Sidebar (tidak ikut tercetak) */}
        <div className="no-print">
          <Sidebar />
        </div>

        {/* Bagian Tabel + Tombol + Form (tidak ikut tercetak) */}
        <div className="flex-col my-5 w-full no-print">
          <h2 className="flex justify-center text-3xl font-bold">Data Usulan Barang</h2>

          <div className="flex justify-between">
            <div className="flex gap-2 ml-3">
              {/* Satu tombol print yang meng-handle template dan fetch data */}
              <button onClick={handlePrint} className="flex w-60 justify-center p-3 items-center h-8 rounded-md bg-green-600 text-white hover:bg-green-700 active:scale-90 transition-all duration-300 ease-in-out">
                Print Data Usulan
              </button>
            </div>

            <div>
              <button onClick={handleAddNew} className="flex mr-5 w-22 justify-center p-3 items-center h-8 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 active:scale-90 transition-all duration-300 ease-in-out">
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
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Harga Satuan</th>
                  <th className="border p-2">Total Harga</th>
                  <th className="border p-2">Keperluan</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border even:bg-gray-100">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.pengusul}</td>
                    <td className="border p-2">{item.namaBarang}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">Rp. {item.perkiraanHarga}</td>
                    <td className="border p-2">Rp. {item.perkiraanTotal}</td>
                    <td className="border p-2">{item.keperluan}</td>
                    <td className="border p-2">{item.status}</td>
                    <td className="border p-2 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="px-2 py-1 transition-all ease-in-out duration-500 bg-indigo-600 hover:scale-105 hover:bg-indigo-700 text-white rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="py-1 px-2 transition-all ease-in-out duration-500 bg-red-500 hover:scale-105 hover:bg-red-600 text-white rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* FORM (Tambah/Edit) */}
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
                    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg bg-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="pengusul" value={form.pengusul} onChange={handleChange} placeholder="Pengusul" className="p-2 border rounded" />
                        <input type="text" name="namaBarang" value={form.namaBarang} onChange={handleChange} placeholder="Nama barang" className="p-2 border rounded" />
                        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="p-2 border rounded" />
                        <input type="number" name="perkiraanHarga" value={form.perkiraanHarga} onChange={handleChange} placeholder="Perkiraan harga satuan" className="p-2 border rounded" />
                        <input type="text" name="keperluan" value={form.keperluan} onChange={handleChange} placeholder="keperluan" className="p-2 border rounded" />
                        <input type="text" name="status" value={form.status} onChange={handleChange} placeholder="status" className="p-2 border rounded" />
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
        </div>
      </div>

      {/* 
        Template Print        
      */}
      {showInventoryPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm inventory-print">
          <div className="bg-white w-full mx-auto border p-2">
            <Image className="absolute top-3 left- w-20" src="/image/logo.png" alt="Logo Universitas" width={100} height={100} priority={true} />
            {/* Header Template */}
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold uppercase">LAPORAN DATA USULAN BARANG</h1>
              <h2 className="text-lg font-semibold">MTS MIFTAHUL ULUUM</h2>
              <p className="text-md font-medium">Tahun Ajaran 2024/2025 </p>
            </div>

            {/* Tabel semua data */}
            <table className="w-full border-collapse mb-4 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Pengusul</th>
                  <th className="border p-2">Nama Barang</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Harga Satuan</th>
                  <th className="border p-2">Total Harga</th>
                  <th className="border p-2">Keperluan</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">{item.pengusul}</td>
                    <td className="border p-2">{item.namaBarang}</td>
                    <td className="border p-2 text-center">{item.quantity}</td>
                    <td className="border p-2">Rp. {item.perkiraanHarga}</td>
                    <td className="border p-2">Rp. {item.perkiraanTotal}</td>
                    <td className="border p-2">{item.keperluan}</td>
                    <td className="border p-2">{item.status}</td>
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

            {/* Tanda Tangan */}
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
  );
};

export default Usulan;
