import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import db from "@/app/services/firebase";

//  Ambil semua data (GET)
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "meet"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(items, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Gagal mengambil data", error: error.message }, { status: 500 });
  }
}

//  Tambah data (POST)
export async function POST(req) {
  try {
    const { nama, quantity, layak, tidak_layak } = await req.json();
    if (!nama || !quantity || !layak || !tidak_layak) {
      return Response.json({ message: "Semua field harus diisi" }, { status: 400 });
    }

    //  Tambahkan data ke Firestore, biarkan Firestore membuat ID
    const docRef = await addDoc(collection(db, "meet"), {
      nama,
      quantity,
      layak,
      tidak_layak,
    });

    return Response.json({ id: docRef.id, nama, quantity, layak, tidak_layak }, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Gagal menambahkan data", error: error.message }, { status: 500 });
  }
}

//  Update data (PUT)
export async function PUT(req) {
  try {
    const { id, nama, quantity, layak, tidak_layak } = await req.json();
    if (!id || !nama || !quantity || !layak || !tidak_layak) {
      return Response.json({ message: "Semua field harus diisi" }, { status: 400 });
    }
    const itemDoc = doc(db, "meet", id);
    await updateDoc(itemDoc, { nama, quantity, layak, tidak_layak });
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

    const itemDoc = doc(db, "meet", id);
    await deleteDoc(itemDoc);
    return Response.json({ message: "Data berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Gagal menghapus data", error: error.message }, { status: 500 });
  }
}
