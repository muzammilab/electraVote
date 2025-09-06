import { LogOut, Menu, User, X, Home, BarChart2, UserCircle, Vote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function VoterNavbar({ name , email}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  
  const handleLogout = () => navigate("/logout");

  const navLinks = [
    { name: "Dashboard", icon: Home, to: "/voter/dashboard" },
    { name: "Vote", icon: Vote, to: "/voter/elections" },
    { name: "Results", icon: BarChart2, to: "/voter/elections/closed" },
    { name: "Profile", icon: UserCircle, to: "/voter/profile" },
  ];

  const isActive = (path) => location.pathname === path;
  const mobileIsActive = (path) => (pendingPath ? pendingPath === path : isActive(path));

  // timings (tweak if you like)
  const HIGHLIGHT_MS = 400; // time for highlight to glide to the new item
  const EXIT_MS = 280;      // time for drawer exit (fade/slide) to finish

  const handleMobileNavigate = (to) => {
    // 1) move the cyan highlight to the tapped item
    setPendingPath(to);

    // 2) after highlight anim finishes, close the drawer (triggers exit animation)
    setTimeout(() => {
      setMobileMenuOpen(false);

      // 3) after drawer exit finishes, navigate
      setTimeout(() => {
        navigate(to);
        setPendingPath(null);
      }, EXIT_MS);
    }, HIGHLIGHT_MS);
  };

  return (
    <>
      {/* Top Navbar (unchanged) */}
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
          className="md:hidden flex items-center text-gray-2 00"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Slide-Out Drawer with fade-out on close */}
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

            {/* Mobile Navigation (animated highlight) */}
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


/* Less Improved UI
import { LogOut, Menu, User, X, Home, BarChart2, UserCircle, Vote } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function VoterNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useState({ name: "John Doe", email: "john@example.com" });

  const handleLogout = () => navigate("/login");

  const navLinks = [
    { name: "Dashboard", icon: Home, to: "/voter/dashboard" },
    { name: "Results", icon: BarChart2, to: "/voter/results" },
    { name: "Profile", icon: UserCircle, to: "/voter/profile" },
    { name: "Vote", icon: Vote, to: "/voter/elections" },
  ];

  const [pendingPath, setPendingPath] = useState(null);

  const isActive = (path) => path === (pendingPath || location.pathname);
  // const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Navbar 
      <header className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-lg relative z-20">
        {/* User Name and Email 
        <div className="flex flex-col text-right">
          <span className="flex items-center gap-2 text-gray-200 font-semibold">
            <User className="h-6 w-6 text-cyan-400" /> {user.name}
          </span>
          <span className="text-xs text-gray-400">{user.email}</span>
        </div>

        {/* Desktop Menu 
        <div className="hidden md:flex items-center gap-4 relative">
          {navLinks.map((link, index) => (
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

        {/* Mobile Hamburger 
        <button
          className="md:hidden flex items-center text-gray-200"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Slide-Out Drawer 
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: mobileMenuOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-64 bg-white/5 backdrop-blur-lg shadow-lg z-30 p-6 flex flex-col gap-6"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-200 font-semibold text-lg">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Mobile Navigation Links 
          <div className="flex flex-col gap-3 mt-4 relative">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {isActive(link.to) && (
                  <motion.div
                    layoutId="mobile-active-bg"
                    className="absolute inset-0 bg-cyan-500/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <button
                  onClick={() => {
                    // Show animation highlight immediately
                    setPendingPath(link.to);

                    // After animation, navigate & close
                    setTimeout(() => {
                      navigate(link.to);
                      setPendingPath(null); // reset after nav
                      setMobileMenuOpen(false);
                    }, 400); // matches transition
                  }}
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
        </div>
      </motion.div>
    </>
  );
}
 */