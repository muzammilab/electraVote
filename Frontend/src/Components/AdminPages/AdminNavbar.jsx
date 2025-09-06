import { LogOut, Menu, User, X, Home, Users, ClipboardList, BarChart2, Settings, PlusCircle, Calendar, Users2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminNavbar({ name , email }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const handleLogout = () => navigate("/logout");

  const navLinks = [
    { name: "Dashboard", icon: Home, to: "/admin/dashboard" },
    { name: "Elections", icon: Calendar, to: "/admin/elections" },
    { name: "Candidates", icon: Users2, to: "/admin/candidates/list" },
    { name: "Add Election", icon: PlusCircle, to: "/admin/add-election" },
    { name: "Voters", icon: Users, to: "/admin/voters" },
    { name: "Results", icon: BarChart2, to: "/admin/elections/closed" },
  ];

  const isActive = (path) => location.pathname === path;
  const mobileIsActive = (path) => (pendingPath ? pendingPath === path : isActive(path));

  const HIGHLIGHT_MS = 400;
  const EXIT_MS = 280;

  const handleMobileNavigate = (to) => {
    setPendingPath(to);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setTimeout(() => {
        navigate(to);
        setPendingPath(null);
      }, EXIT_MS);
    }, HIGHLIGHT_MS);
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-lg relative z-20">
        <div className="flex flex-col text-right">
          <span className="flex items-center gap-2 text-gray-200 font-semibold">
            <User className="h-6 w-6 text-cyan-400" /> {name}
          </span>
          <span className="text-xs text-gray-400">{email}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 relative">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              {isActive(link.to) && (
                <motion.div
                  layoutId="active-bg"
                  className="absolute inset-0 bg-cyan-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Link
                to={link.to}
                className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-gray-200 hover:text-white font-semibold transition"
              >
                <link.icon className="h-5 w-5 text-cyan-400" /> {link.name}
              </Link>
            </div>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md hover:shadow-red-500/40 cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center text-gray-200"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Slide-Out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="fixed top-0 right-0 h-full w-64 bg-white/5 backdrop-blur-lg shadow-lg z-30 p-6 flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-200 font-semibold text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-200">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-4 relative">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {mobileIsActive(link.to) && (
                    <motion.div
                      layoutId="mobile-active-bg"
                      className="absolute inset-0 bg-cyan-500/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <button
                    onClick={() => handleMobileNavigate(link.to)}
                    className="w-full text-left relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl text-gray-200 hover:text-white font-semibold text-lg transition"
                  >
                    <link.icon className="h-5 w-5 text-cyan-400" /> {link.name}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md hover:shadow-red-500/40 cursor-pointer mt-auto"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
