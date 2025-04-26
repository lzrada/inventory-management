import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function DropdownAksi() {
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
            <Link href={"/management/kelas/vii/a"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kelas VII</li>
            </Link>
            <Link href={"/management/kelas/viii/a"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kelas VIII</li>
            </Link>
            <Link href={"/management/kelas/ix/a"}>
              <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kelas IX</li>
            </Link>
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}
