"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faEnvelope, faRightFromBracket, faWarehouse, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const [isSarprasOpen, setIsSarprasOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [role, setRole] = useState(null);

  // Ambil role dari localStorage di client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  return (
    <div className="flex flex-col w-80 min-w-80 sticky top-0 left-0 bg-gray-800 h-screen overflow-y-hidden">
      <div className="flex items-center mt-4 mb-7">
        <div className="text-white mx-2 p-1 w-14 h-14">
          <img src="/Image/logo.png" alt="logo sekolah" />
        </div>
        <span className="text-xl font-bold mx-1 p-1 text-white">MTS MIFTAAHUL ULUM</span>
      </div>

      {/* Jika role bukan admin, gunakan justify-center */}
      <div className={`flex flex-col flex-1 ${role !== "admin" ? "justify-center -mt-10" : ""}`}>
        {/* Dashboard */}
        <Link href="/dashboard" className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-2 mx-3 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 mx-3" />
          <span> Dashboard</span>
        </Link>

        {/* Jika role adalah admin, tampilkan menu tambahan */}
        {role === "admin" && (
          <>
            {/* Sarpras dengan Dropdown */}
            <div className="mx-3">
              <button className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-2 flex items-center w-full" onClick={() => setIsSarprasOpen(!isSarprasOpen)}>
                <FontAwesomeIcon icon={faWarehouse} className="w-5 h-5 mx-3" />
                Sarpras
                <FontAwesomeIcon icon={isSarprasOpen ? faChevronUp : faChevronDown} className="w-4 h-4 ml-auto" />
              </button>

              {/* Dropdown */}
              <div
                ref={dropdownRef}
                className="ml-12 overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: isSarprasOpen ? `${dropdownRef.current?.scrollHeight}px` : "0px",
                  opacity: isSarprasOpen ? 1 : 0,
                }}
              >
                <Link href="/sarpras" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
                  Ruang Kelas
                </Link>
                <Link href="/sarpras/lainnya" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
                  Ruang Lainnya
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Usulan (tetap muncul untuk semua role) */}
        <Link href="/usulan" className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-2 mx-3 flex items-center">
          <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 mx-3" />
          Usulan
        </Link>

        {/* Logout */}
        <button
          className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-3 mx-3 flex items-center"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role"); // Hapus role juga saat logout
            router.push("/");
          }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 mx-3" />
          Logout
        </button>
      </div>

      <p className="absolute bottom-0 italic font-mono text-white m-4">&copy; MTS MIFTAAHUL ULUM</p>
    </div>
  );
};

export default Sidebar;
