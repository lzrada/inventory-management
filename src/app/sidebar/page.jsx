"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faEnvelope, faPrint, faRightFromBracket, faWarehouse, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const [isSarprasOpen, setIsSarprasOpen] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <div className="flex flex-col w-80 sticky top-0 left-0 bg-gray-800 h-screen overflow-y-hidden">
      <div className="text-white mt-2 mx-5 p-2 w-24 h-24">
        <img src="/Image/logo.png" alt="logo sekolah" />
      </div>
      <span className="text-xl font-bold mx-4 p-4 text-white">MTS MIFTAAHUL ULUM</span>

      <Link href="/dashboard" className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-2 mx-3 flex items-center">
        <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 mx-3" />
        <span> Dashboard</span>
      </Link>

      {/* Sarpras with Dropdown */}
      <div className="mx-3">
        <button className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-2 flex items-center w-full" onClick={() => setIsSarprasOpen(!isSarprasOpen)}>
          <FontAwesomeIcon icon={faWarehouse} className="w-5 h-5 mx-3" />
          Sarpras
          <FontAwesomeIcon icon={isSarprasOpen ? faChevronUp : faChevronDown} className="w-4 h-4 ml-auto" />
        </button>

        {/* Dropdown dengan Dynamic Height */}
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
          <Link href="/sarpras" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
            Ruang Guru
          </Link>
          <Link href="/sarpras" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
            Ruang lainnya
          </Link>
        </div>
      </div>

      <Link href="#" className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-2 mx-3 flex items-center">
        <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 mx-3" />
        Usulan
      </Link>
      <Link href="#" className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-2 mx-3 flex items-center">
        <FontAwesomeIcon icon={faPrint} className="w-5 h-5 mx-3" />
        Print
      </Link>

      <button
        className="text-white hover:bg-gray-900 hover:rounded-xl p-4 font-medium text-2xl my-3 mx-3 flex items-center"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/");
        }}
      >
        <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 mx-3" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
