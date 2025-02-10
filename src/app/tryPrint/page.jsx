"use client"; // Tambahkan ini agar Next.js tahu ini hanya berjalan di client

const Page = () => {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      // Pastikan window ada
      window.print();
    }
  };

  return (
    <div>
      <button onClick={handlePrint} className="m-5 px-4 py-2 bg-blue-500 text-white rounded">
        CEK DISINI AJA
      </button>
    </div>
  );
};

export default Page;
