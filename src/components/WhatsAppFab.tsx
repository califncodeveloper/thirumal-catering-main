import { motion } from "framer-motion";
import { waLink } from "../lib/contact";

export function WhatsAppFab() {
  return (
    <motion.a
      href={waLink("Hi Thirumal Catering, I'd like to enquire about your services.")}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.5)] grid place-items-center"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
      <svg viewBox="0 0 32 32" className="w-7 h-7 md:w-8 md:h-8 relative" fill="currentColor">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.372.69 4.577 1.876 6.44L4 29l7.79-1.828A11.94 11.94 0 0016 27c6.628 0 12-5.373 12-12S22.628 3 16.001 3zm0 21.6c-1.85 0-3.575-.51-5.05-1.395l-.36-.213-4.62 1.084 1.11-4.5-.234-.372A9.55 9.55 0 016.4 15c0-5.293 4.31-9.6 9.6-9.6s9.6 4.307 9.6 9.6-4.31 9.6-9.6 9.6zm5.28-7.187c-.29-.144-1.71-.842-1.974-.937-.265-.096-.458-.144-.65.145-.192.288-.744.937-.912 1.128-.168.192-.336.216-.625.072-.29-.145-1.22-.45-2.323-1.433-.858-.766-1.436-1.71-1.604-2-.168-.288-.018-.443.126-.586.13-.128.29-.336.434-.504.145-.168.192-.288.29-.48.096-.192.048-.36-.024-.504-.072-.144-.65-1.567-.892-2.146-.234-.564-.474-.487-.65-.497l-.554-.01c-.192 0-.505.072-.77.36-.264.288-1.01.986-1.01 2.4 0 1.416 1.033 2.784 1.178 2.977.144.192 2.035 3.106 4.933 4.352.69.298 1.226.475 1.645.607.69.22 1.32.19 1.816.115.554-.083 1.71-.7 1.95-1.376.24-.674.24-1.253.168-1.375-.072-.12-.264-.192-.554-.336z"/>
      </svg>
    </motion.a>
  );
}
