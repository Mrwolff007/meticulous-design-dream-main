import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number; // -30 to 30, default 15
  fadeIn?: boolean;
}

const ParallaxSection = ({ children, className = "", speed = 15, fadeIn = true }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 2, -speed * 2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, ...(fadeIn ? { opacity } : {}) }}>
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;
