"use client";

import { Disclosure, DisclosureButton } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  return (
    <Disclosure as="nav" className="bg-white shadow sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-emerald-600">EventEase</h1>

            <div className="hidden md:flex gap-6 text-sm font-medium">
              <NavLinks />
            </div>

            <div className="md:hidden">
              <DisclosureButton className="text-gray-600 hover:text-emerald-500">
                {open ? <X size={24} /> : <Menu size={24} />}
              </DisclosureButton>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="mobile-nav"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden px-4 pb-4"
              >
                <div className="flex flex-col gap-2">
                  <NavLinks />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
