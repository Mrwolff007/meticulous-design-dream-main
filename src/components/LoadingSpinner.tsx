import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300); // Brief delay before fade
          return 100;
        }
        // Fast random increments to reach 100% quickly
        return prev + Math.random() * 40;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-background via-background to-secondary/20 backdrop-blur-sm flex items-center justify-center z-[9999]"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo Container with Glow */}
        <div className="relative inline-block">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl animate-pulse"></div>
          
          {/* Logo Image with rotation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <img
              src="/images/logoklkautocar.png"
              alt="KLK Auto Car Logo"
              className="h-20 w-20 md:h-24 md:w-24 rounded-full"
            />
          </motion.div>
        </div>

        {/* KLK Logo Text */}
        <div className="text-center">
          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">KLK</h3>
          <p className="text-base md:text-lg text-accent font-semibold tracking-wider">AUTO CAR</p>
        </div>

        {/* Progress Section */}
        <div className="w-64 md:w-72 space-y-3">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
            />
          </div>

          {/* Progress Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground font-medium"
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.p>
        </div>

        {/* Status Messages */}
        <motion.p
          key={Math.floor(progress / 25)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xs md:text-sm text-muted-foreground pt-4"
        >
          {progress < 25
            ? "Initialisation..."
            : progress < 50
            ? "Chargement des données..."
            : progress < 75
            ? "Préparation de l'interface..."
            : progress < 95
            ? "Finalisation..."
            : "Prêt!"}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
