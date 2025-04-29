"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faEnvelope, faRightFromBracket, faWarehouse, faChevronDown, faChevronUp, faDatabase, faFile } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isManajemenOpen, setIsManajemenOpen] = useState(false);
  const [isRekapOpen, setIsRekapOpen] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <div className="flex flex-col w-80 min-w-80 sticky top-0 left-0 bg-gray-800 h-screen overflow-y-hidden ">
      <div className="flex items-center mt-4 mb-7">
        <div className="text-white mx-2 p-1 w-14 h-14">
          <img src="/Image/logo.png" alt="logo sekolah" />
        </div>
        <span className="text-xl font-bold mx-1 p-1 text-white">MTS MIFTAAHUL ULUM</span>
      </div>

      <div className={`flex flex-col flex-1 `}>
        {/* Dashboard */}
        <Link href="/dashboard" className="text-white hover:bg-gray-900 hover:rounded-xl p-3 font-medium text-2xl my-2 mx-3 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 mx-3" />
          <span> Dashboard</span>
        </Link>

        <>
          {/* master data */}
          <div className="mx-3">
            <button className="text-white hover:bg-gray-900 hover:rounded-xl p-3 font-medium text-2xl my-2 flex items-center w-full" onClick={() => setIsMasterOpen(!isMasterOpen)}>
              <FontAwesomeIcon icon={faDatabase} className="w-5 h-5 mx-3" />
              Master Data
              <FontAwesomeIcon icon={isMasterOpen ? faChevronUp : faChevronDown} className="w-4 h-4 ml-auto" />
            </button>

            {/* Dropdown */}
            <div
              ref={dropdownRef}
              className="ml-12 overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: isMasterOpen ? `${dropdownRef.current?.scrollHeight}px` : "0px",
                opacity: isMasterOpen ? 1 : 0,
              }}
            >
              <Link href="/masterData/kelas/vii/a" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
                Ruang Kelas
              </Link>
              <Link href="/masterData/lainnya/guru" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
                Ruang Lainnya
              </Link>
            </div>
          </div>
          <div className="mx-3">
            <button className="text-white hover:bg-gray-900 hover:rounded-xl p-3 font-medium text-2xl my-2 flex items-center w-full" onClick={() => setIsManajemenOpen(!isManajemenOpen)}>
              <FontAwesomeIcon icon={faWarehouse} className="w-5 h-5 mx-3" />
              Manajement Data
              <FontAwesomeIcon icon={isManajemenOpen ? faChevronUp : faChevronDown} className="w-4 h-4 ml-auto" />
            </button>

            {/* Dropdown */}
            <div
              ref={dropdownRef}
              className="ml-12 overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: isManajemenOpen ? `${dropdownRef.current?.scrollHeight}px` : "0px",
                opacity: isManajemenOpen ? 1 : 0,
              }}
            >
              <Link href="/management/kelas/vii/a" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
                Ruang Kelas
              </Link>
              <Link href="/management/lainnya/bk" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
                Ruang Lainnya
              </Link>
            </div>
          </div>
        </>

        <Link href="/usulan" className="text-white hover:bg-gray-900 hover:rounded-xl p-3 font-medium text-2xl my-2 mx-3 flex items-center">
          <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 mx-3" />
          Usulan
        </Link>

        <div className="mx-3">
          <button className="text-white hover:bg-gray-900 hover:rounded-xl p-3 font-medium text-2xl my-2 flex items-center w-full" onClick={() => setIsRekapOpen(!isRekapOpen)}>
            <FontAwesomeIcon icon={faFile} className="w-5 h-5 mx-3" />
            Rekap Data
            <FontAwesomeIcon icon={isRekapOpen ? faChevronUp : faChevronDown} className="w-4 h-4 ml-auto" />
          </button>

          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className="ml-12 overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: isRekapOpen ? `${dropdownRef.current?.scrollHeight}px` : "0px",
              opacity: isRekapOpen ? 1 : 0,
            }}
          >
            <Link href="/rekap/kelas/vii/a" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
              Ruang Kelas
            </Link>
            <Link href="/rekap/lainnya/bk" className="block text-white hover:bg-gray-900 hover:rounded-xl p-2 text-lg">
              Ruang Lainnya
            </Link>
          </div>
        </div>

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

      <p
        className={`
    absolute bottom-0 italic font-mono text-white 
    transition-all  ease-in-out duration-300 
     opacity-75 m-4 
    ${isMasterOpen || isManajemenOpen || isRekapOpen ? "opacity-0 translate-y-2 hidden transition-all ease-in-out duration-300 pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"}
  `}
      >
        &copy; MTS MIFTAAHUL ULUM
      </p>
    </div>
  );
};

export default Sidebar;
