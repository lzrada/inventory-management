"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrintTemplate = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="p-10 text-black bg-white">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold">UNIVERSITAS ISLAM BALITAR</h2>
          <p>KARTU UAS (Ujian Akhir Semester) - 2023 GANJIL</p>
        </div>
        <img src="/logo.png" alt="Logo Universitas" className="w-20" />
      </div>

      <div className="mt-4 border border-black p-4">
        <p>
          <strong>Nama Mahasiswa:</strong> MUHAMMAD LAZUARDI AL GHIFFARY
        </p>
        <p>
          <strong>NIM:</strong> 2210410045
        </p>
        <p>
          <strong>Program Studi:</strong> Teknik Informatika
        </p>
        <p>
          <strong>Semester:</strong> 3
        </p>
      </div>

      <table className="mt-4 w-full border-collapse border border-black">
        <thead className="bg-gray-300">
          <tr>
            <th className="border p-2">No</th>
            <th className="border p-2">Kode</th>
            <th className="border p-2">Nama Mata Kuliah</th>
            <th className="border p-2">Presensi</th>
            <th className="border p-2">SKS</th>
            <th className="border p-2">Paraf Dosen</th>
          </tr>
        </thead>
        <tbody>
          {[
            { kode: "KKK002101", nama: "Kewirausahaan Dasar", presensi: "Memenuhi", sks: 2 },
            { kode: "KKK002102", nama: "Teknologi Informasi", presensi: "Memenuhi", sks: 2 },
            { kode: "KKK042101", nama: "Pemrograman Web", presensi: "Memenuhi", sks: 3 },
            { kode: "KKK042102", nama: "Jaringan Komputer", presensi: "Memenuhi", sks: 3 },
          ].map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{item.kode}</td>
              <td className="border p-2">{item.nama}</td>
              <td className="border p-2">{item.presensi}</td>
              <td className="border p-2">{item.sks}</td>
              <td className="border p-2"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <p className="text-right">Blitar, 19 Desember 2023</p>
        <p className="text-right font-bold">SAIFUL NUR BUDIMAN, S.Kom., M.Kom</p>
        <p className="text-right">Ketua Prodi Teknik Informatika</p>
      </div>
    </div>
  );
});

export default function PrintPage() {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="p-10">
      <button onClick={handlePrint} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Cetak
      </button>
      <div className="hidden">
        <PrintTemplate ref={printRef} />
      </div>
    </div>
  );
}
