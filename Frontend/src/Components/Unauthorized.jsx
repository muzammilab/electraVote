import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden px-4">
      {/* Floating animated gradient blobs */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.4, opacity: 0.15 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-80 h-80 bg-cyan-500 rounded-full blur-3xl -top-20 -left-20"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.4, opacity: 0.15 }}
        transition={{ duration: 4, delay: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-80 h-80 bg-purple-500 rounded-full blur-3xl -bottom-20 -right-20"
      />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center"
      >
        {/* Icon with glow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1, 
            rotate: [0, -8, 8, -5, 5, 0] 
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut", 
            repeat: Infinity, 
            repeatDelay: 2 
          }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <Lock className="h-20 w-20 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]" />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-3">
          Unauthorized Access
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-400 mb-8 px-2">
          You don’t have permission to view this page.  
          Please return to a safe location.
        </p>

        {/* Back Button with pulse */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: [
              "0 0 10px rgba(34,211,238,0.4)",
              "0 0 25px rgba(34,211,238,0.8)",
              "0 0 10px rgba(34,211,238,0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 bg-cyan-500/90 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md w-full sm:w-auto cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" /> Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}
