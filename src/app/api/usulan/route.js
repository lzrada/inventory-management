import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import db from "@/app/services/firebase";

//  Ambil semua data (GET)
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "usulan"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(items, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Gagal mengambil data", error: error.message }, { status: 500 });
  }
}

//  Tambah data (POST)
export async function POST(req) {
  try {
    const { pengusul, namaBarang, quantity, perkiraanTotal, perkiraanHarga, keperluan, status } = await req.json();
    if (!pengusul || !namaBarang || !quantity || !perkiraanTotal || !perkiraanHarga || !keperluan || !status) {
      return Response.json({ message: "Semua field harus diisi" }, { status: 400 });
    }

    //  Tambahkan data ke Firestore, biarkan Firestore membuat ID
    const docRef = await addDoc(collection(db, "usulan"), {
      pengusul,
      namaBarang,
      quantity,
      perkiraanTotal,
      perkiraanHarga,
      keperluan,
      status,
    });

    return Response.json({ id: docRef.id, pengusul, namaBarang, quantity, perkiraanTotal, perkiraanHarga, keperluan, status }, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Gagal menambahkan data", error: error.message }, { status: 500 });
  }
}

//  Update data (PUT)
export async function PUT(req) {
  try {
    const { id, pengusul, namaBarang, quantity, perkiraanTotal, perkiraanHarga, keperluan, status } = await req.json();
    if (!id || !pengusul || !namaBarang || !quantity || !perkiraanTotal || !perkiraanHarga || !keperluan || !status) {
      return Response.json({ message: "Semua field harus diisi" }, { status: 400 });
    }
    const itemDoc = doc(db, "usulan", id);
    await updateDoc(itemDoc, { pengusul, namaBarang, quantity, perkiraanTotal, perkiraanHarga, keperluan, status });
    return Response.json({ message: "Data berhasil diperbarui" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Gagal memperbarui data", error: error.message }, { status: 500 });
  }
}

//  Hapus data (DELETE)
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return Response.json({ message: "ID diperlukan" }, { status: 400 });

    const itemDoc = doc(db, "usulan", id);
    await deleteDoc(itemDoc);
    return Response.json({ message: "Data berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Gagal menghapus data", error: error.message }, { status: 500 });
  }
}
