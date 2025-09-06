import { useState } from "react";
import { UserPlus, LogIn, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form fields
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 2));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name,
        dob: new Date(dob), // Convert from string to Date
        aadharCardNumber: aadhaar,
        address,
        phone,
        email,
        password,
      };

      const res = await axios.post(
        "http://localhost:3001/user/signup",
        payload
      );

      console.log(res.data);

      if (res.data.token) {
        toast.success("Voter Signup Successful ✅");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        navigate("/voter/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed");
      // alert(err.response?.data?.message || "Signup failed");
    }
  };

  const variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 p-6 text-white">
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
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="bg-white/10 p-3 rounded-full">
            <UserPlus className="h-8 w-8 text-cyan-300" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Create Account</h1>
          <p className="text-gray-300 text-sm mt-1 text-center">
            Sign up to participate in voting
          </p>
        </motion.div>

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence exitBeforeEnter>
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                {/* Step 1 - Personal Info */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-200">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="John Doe"
                  />

                  <label className="block text-sm font-medium text-gray-200">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                  <label className="block text-sm font-medium text-gray-200">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="XXXX-XXXX-XXXX"
                  />

                  <label className="block text-sm font-medium text-gray-200">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Your Address"
                  />

                  <label className="block text-sm font-medium text-gray-200">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="+91 9876543210"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                {/* Step 2 - Account Info */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="you@example.com"
                  />

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

                  <label className="block text-sm font-medium text-gray-200">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition"
              >
                <UserPlus className="h-5 w-5" /> Sign Up
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xs text-gray-400 mt-6 text-center"
        >
          By signing up, you agree to our Terms and Privacy Policy.
        </motion.p>

        {/* Already have account */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-center"
        >
          <Link
            to="/login"
            className="text-cyan-400 hover:underline text-sm flex items-center justify-center gap-1"
          >
            <LogIn className="h-4 w-4" />
            Already have an account? Login
          </Link>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
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

/* ONE STEP FORM
import { useState } from "react";
import { UserPlus, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate API
    if (password === confirmPassword) {
      navigate("/voter/dashboard");
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 p-6 text-white">
      {/* Animated card 
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10"
      >
        {/* Icon + Heading 
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="bg-white/10 p-3 rounded-full">
            <UserPlus className="h-8 w-8 text-cyan-300" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Create Account</h1>
          <p className="text-gray-300 text-sm mt-1">
            Sign up to participate in voting
          </p>
        </motion.div>

        {/* Form 
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Full Name", value: name, set: setName, type: "text", placeholder: "John Doe" },
            { label: "Email", value: email, set: setEmail, type: "email", placeholder: "you@example.com" },
            { label: "Password", value: password, set: setPassword, type: "password", placeholder: "••••••••" },
            { label: "Confirm Password", value: confirmPassword, set: setConfirmPassword, type: "password", placeholder: "••••••••" },
            { label: "Aadhaar Number", value: aadhaar, set: setAadhaar, type: "text", placeholder: "XXXX-XXXX-XXXX" },
            { label: "Date of Birth", value: dob, set: setDob, type: "date", placeholder: "" },
            { label: "Address", value: address, set: setAddress, type: "text", placeholder: "Your Address" },
            { label: "Phone", value: phone, set: setPhone, type: "tel", placeholder: "+91 9876543210" },
          ].map((field, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-200">{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder={field.placeholder}
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition"
          >
            <UserPlus className="h-5 w-5" />
            Sign Up
          </motion.button>
        </form>

        {/* Footer 
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="text-xs text-gray-400 mt-6 text-center"
        >
          By signing up, you agree to our Terms and Privacy Policy.
        </motion.p>

        {/* Already have account 
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-4 text-center"
        >
          <Link to="/login" className="text-cyan-400 hover:underline text-sm flex items-center justify-center gap-1">
            <LogIn className="h-4 w-4" />
            Already have an account? Login
          </Link>
        </motion.div>

        {/* Back to home 
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-4 text-center"
        >
          <Link
            to="/"
            className="text-cyan-400 hover:underline text-sm"
          >
            ← Back to Home
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
 */
