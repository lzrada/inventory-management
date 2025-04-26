import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function DropdownLainnya() {
  const toggleDropdown = () => setIsOpen(!isOpen);
  const [isOpen, setIsOpen] = useState(false);
  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
  return (
    <>
      <button onClick={toggleDropdown} className="inline-flex justify-center w-44 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100">
        Pilih Opsi
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute left-0 w-44 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg"
          >
            <Link href={"/masterData/lainnya/bk"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Ruang BK</li>
            </Link>
            <Link href={"/masterData/lainnya/guru"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Ruang Guru</li>
            </Link>
            <Link href={"/masterData/lainnya/labkom"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Ruang Labkom</li>
            </Link>
            <Link href={"/masterData/lainnya/meet"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Ruang Meet</li>
            </Link>
            <Link href={"/masterData/lainnya/musik"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Ruang Musik</li>
            </Link>
            <Link href={"/masterData/lainnya/perpus"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Ruang Perpus</li>
            </Link>
            <Link href={"/masterData/lainnya/uks"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Ruang UKS</li>
            </Link>
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}
