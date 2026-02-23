import { motion } from "framer-motion";

interface AppSpinnerProps {
  progress?: number; // 0-100
  isVisible?: boolean;
}

const AppSpinner = ({ progress = 45, isVisible = true }: AppSpinnerProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        {/* Logo Spinner */}
        <motion.div
          className="relative w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <img
            src="/images/logoklkautocar.png"
            alt="KLK AUTO CAR"
            className="w-full h-full object-contain drop-shadow-lg"
          />

          {/* Aura glow autour du logo */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent/30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-secondary/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/50">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          />
        </div>

        {/* Ambient glow effect */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            boxShadow: [
              "0 0 20px rgba(var(--accent), 0.1)",
              "0 0 40px rgba(var(--accent), 0.2)",
              "0 0 20px rgba(var(--accent), 0.1)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default AppSpinner;
