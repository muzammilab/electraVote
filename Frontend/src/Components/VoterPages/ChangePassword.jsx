import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoterNavbar from "./VoterNavbar";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    label: "Weak",
    color: "bg-red-500",
  });

  // Eye toggle state
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Password strength calculation
  useEffect(() => {
    const pwd = formData.newPassword;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Za-z]/.test(pwd) && /\d/.test(pwd)) score += 1;
    if (pwd.length >= 8 && /[!@#$%^&*]/.test(pwd)) score += 1;

    if (score === 0)
      setStrength({ score: 0, label: "Weak", color: "bg-red-500" });
    else if (score === 1)
      setStrength({ score: 33, label: "Weak", color: "bg-red-500" });
    else if (score === 2)
      setStrength({ score: 66, label: "Medium", color: "bg-yellow-400" });
    else setStrength({ score: 100, label: "Strong", color: "bg-green-500" });
  }, [formData.newPassword]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleShowPassword = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Call backend API to update password here
    setShowSuccess(true);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      <VoterNavbar />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/voter/dashboard")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full text-center"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
          Change Your <span className="text-pink-400">Password</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          Securely update your account password here.
        </p>
      </motion.section>

      {/* Form Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-start justify-center px-4 sm:px-6 pb-12"
      >
        <motion.div
          layout
          className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          <motion.form
            layout
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6"
          >
            {[
              {
                name: "currentPassword",
                label: "Current Password",
                icon: <Lock className="h-5 w-5 text-pink-400" />,
              },
              {
                name: "newPassword",
                label: "New Password",
                icon: <Lock className="h-5 w-5 text-cyan-400" />,
              },
              {
                name: "confirmPassword",
                label: "Confirm New Password",
                icon: <Lock className="h-5 w-5 text-purple-400" />,
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col relative">
                <label className="text-xs sm:text-sm text-gray-400 mb-1 flex items-center gap-1">
                  {field.icon} {field.label}
                </label>
                <input
                  type={showPassword[field.name] ? "text" : "password"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-xs sm:text-sm w-full pr-10"
                />
                <motion.div
                  className="absolute top-[33px] right-3 cursor-pointer text-gray-300"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleShowPassword(field.name)}
                >
                  {showPassword[field.name] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </motion.div>

                {/* Password strength bar under New Password field */}
                {field.name === "newPassword" && formData.newPassword && (
                  <>
                    <div className="mt-1 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${strength.score}%` }}
                        className={`${strength.color} h-2 rounded-full`}
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 20,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      {strength.label}
                    </p>
                  </>
                )}
              </div>
            ))}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-pink-500/40 transition"
            >
              <Lock className="h-4 w-4" /> Update Password
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>

      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 text-sm sm:text-base"
          >
            <CheckCircle2 className="h-5 w-5 text-white" />
            Password updated successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
