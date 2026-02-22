import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navItems = [
  { label: "Accueil", path: "/" },
  { label: "Véhicules", path: "/vehicules" },
  { label: "Réservation", path: "/reservation" },
  { label: "À propos", path: "/a-propos" },
  { label: "Contact", path: "/contact" },
];

const Navbar = ({ transparent = false }: { transparent?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? scrolled
            ? "glass-navbar-scrolled"
            : "bg-transparent"
          : scrolled
          ? "glass-navbar-scrolled"
          : "glass-navbar"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-accent" />
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              KLK <span className="text-accent">AUTO</span> CAR
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium font-display tracking-wide transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-accent after:origin-left after:transition-transform after:duration-300 ${
                  location.pathname === item.path
                    ? "text-foreground after:scale-x-100"
                    : "text-muted-foreground hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent">
              <Link to="/reservation">Réserver</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-navbar-scrolled border-t border-border/20"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-display font-medium py-2 transition-colors hover:text-foreground ${
                    location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent w-full mt-2">
                <Link to="/reservation" onClick={() => setIsOpen(false)}>Réserver</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
