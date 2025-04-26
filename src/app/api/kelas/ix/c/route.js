import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import db from "@/app/services/firebase";

// GET: Ambil semua data (dengan orderBy)
export async function GET() {
  try {
    const q = query(
      collection(db, "ix_c"),
      orderBy("createdAt", "asc") // atau "desc"
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(items, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Gagal mengambil data", error: error.message }, { status: 500 });
  }
}

// POST: Tambah data
export async function POST(req) {
  try {
    const { nama, quantity, kategori, layak, tidak_layak, Date } = await req.json();
    if (!nama || !quantity || !kategori) {
      return Response.json({ message: "Semua field harus diisi" }, { status: 400 });
    }

    // Tambahkan data ke Firestore, Firestore akan membuat ID secara otomatis
    // Sertakan createdAt agar bisa di-order
    const docRef = await addDoc(collection(db, "ix_c"), {
      nama,
      quantity,
      kategori,
      layak,
      tidak_layak,
      Date, // Anda masih bisa simpan Date buatan client (opsional)
      createdAt: serverTimestamp(), // Field untuk penanda waktu server
    });

    return Response.json(
      {
        id: docRef.id,
        nama,
        quantity,
        kategori,
        layak,
        tidak_layak,
        Date,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ message: "Gagal menambahkan data", error: error.message }, { status: 500 });
  }
}

// PUT: Update data
export async function PUT(req) {
  try {
    const { id, nama, quantity, kategori, layak, tidak_layak } = await req.json();
    if (!id || !nama || !quantity || !kategori) {
      return Response.json({ message: "Semua field harus diisi" }, { status: 400 });
    }
    const itemDoc = doc(db, "ix_c", id);
    // Tidak mengubah field 'Date' dan 'createdAt' agar tanggal pembuatan asli tetap tersimpan
    await updateDoc(itemDoc, { nama, quantity, kategori, layak, tidak_layak });
    return Response.json({ message: "Data berhasil diperbarui" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Gagal memperbarui data", error: error.message }, { status: 500 });
  }
}

// DELETE: Hapus data
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) return Response.json({ message: "ID diperlukan" }, { status: 400 });

    const itemDoc = doc(db, "ix_c", id);
    await deleteDoc(itemDoc);
    return Response.json({ message: "Data berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Gagal menghapus data", error: error.message }, { status: 500 });
  }
}
