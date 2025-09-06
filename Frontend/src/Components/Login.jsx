import { useState } from "react";
import { Lock, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { aadharCardNumber, password };

    const res = await axios.post("http://localhost:3001/user/login", payload);

    console.log(res.data);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      // Redirect based on role
      if (res.data.role === "admin") {
        toast.success("Admin Login Successful");
        // alert("Admin Login Successful ✅");
        navigate("/admin/dashboard");
      } else {
        toast.success("Voter Login Successful");
        // alert("Voter Login Successful ✅");
        navigate("/voter/dashboard");
      }
    } else {
      alert("Login Failed : " + (res.data.error || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 p-6 text-white">
      {/* Animated Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10"
      >
        {/* Icon + Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="bg-white/10 p-3 rounded-full">
            <Lock className="h-8 w-8 text-cyan-300" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Login to Vote</h1>
          <p className="text-gray-300 text-sm mt-1">
            Enter your credentials to continue
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-200">
              Voter ID
            </label>
            <input
              type="text"
              value={aadharCardNumber}
              onChange={(e) => setAadharCardNumber(e.target.value)}
              required
              maxLength={12}
              minLength={12}
              pattern="\d{12}" // ensures exactly 12 digits
              className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your 12 digit Id"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="••••••••"
            />
          </motion.div>

          <motion.button
            type="submit"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition"
          >
            <LogIn className="h-5 w-5" />
            Login
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-xs text-gray-400 mt-6 text-center"
        >
          By logging in, you agree to our Terms and Privacy Policy.
        </motion.p>

        {/* Already have account */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-center"
        >
          <Link
            to="/signup"
            className="text-cyan-400 hover:underline text-sm flex items-center justify-center gap-1"
          >
            <LogIn className="h-4 w-4" />
            New to ElectraVote? Signup
          </Link>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-4 text-center"
        >
          <Link to="/" className="text-cyan-400 hover:underline text-sm">
            ← Back to Home
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
