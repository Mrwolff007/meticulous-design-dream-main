import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Vehicle {
  id: string;
  model: string;
  color: string;
  price_per_day: number;
  fuel: string;
  transmission: string;
  seats: number;
  available: boolean;
  image_url: string | null;
}

interface VehicleCarousel3DProps {
  vehicles: Vehicle[];
}

export default function VehicleCarousel3D({ vehicles }: VehicleCarousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  const visibleCount = 5;
  const totalVehicles = Math.max(vehicles.length, visibleCount);

  const getTransform = (index: number) => {
    const distance = (index - activeIndex + totalVehicles) % totalVehicles;
    const adjustedDistance = distance > visibleCount / 2 ? distance - totalVehicles : distance;

    // Responsive spacing based on screen width
    const translateXBase = windowWidth < 640 ? 80 : windowWidth < 1024 ? 110 : 150;
    
    const perspective = 1200;
    const translateX = adjustedDistance * translateXBase;
    const rotateY = adjustedDistance * 30; // Angle de rotation
    const translateZ = Math.abs(adjustedDistance) > 2 ? -300 : -150 - Math.abs(adjustedDistance) * 75;
    const scale = Math.abs(adjustedDistance) > 2 ? 0.7 : 0.85 + (1 - Math.abs(adjustedDistance) * 0.15);
    const blur = Math.abs(adjustedDistance) * 0.8;
    const opacity = Math.abs(adjustedDistance) > 2 ? 0.5 : 0.7 + (1 - Math.abs(adjustedDistance) * 0.3);
    const zIndex = Math.abs(adjustedDistance) === 0 ? 100 : Math.max(0, 90 - Math.abs(adjustedDistance) * 10);

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${adjustedDistance === 0 ? 0 : rotateY}deg)`,
      opacity,
      filter: `blur(${blur}px)`,
      zIndex,
      perspective,
    };
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalVehicles) % totalVehicles);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalVehicles);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full py-12 md:py-16 lg:py-20">
      <div
        className="relative mx-auto w-full max-w-6xl px-4"
        style={{
          perspective: "1200px",
          WebkitPerspective: "1200px",
        }}
      >
        {/* Carousel Container */}
        <div 
          className="relative h-[380px] w-full sm:h-[400px] md:h-[480px] lg:h-[520px]"
          style={{ WebkitTransformStyle: "preserve-3d" }}
        >
          <div className="transform-gpu relative h-full w-full" style={{ WebkitTransformStyle: "preserve-3d" }}>
            {vehicles && vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => {
                const transform = getTransform(index);
                return (
                  <motion.div
                    key={vehicle.id}
                    className="absolute top-1/2 left-1/2 h-[200px] w-[220px] -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-2xl shadow-2xl sm:h-[240px] sm:w-[280px] md:h-[300px] md:w-[350px] lg:h-[350px] lg:w-[420px]"
                    style={{
                      transformOrigin: "center center",
                      transformStyle: "preserve-3d",
                      WebkitTransformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      willChange: "transform, opacity",
                      ...transform,
                    }}
                    whileHover={
                      Math.abs(((index - activeIndex + totalVehicles) % totalVehicles) - (visibleCount / 2)) < 0.5
                        ? { scale: 1.05 }
                        : {}
                    }
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="group relative h-full w-full">
                      <img
                        alt={`${vehicle.model} ${vehicle.color}`}
                        src={vehicle.image_url || "/placeholder.svg"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute right-0 bottom-0 left-0 p-3 text-white sm:p-4 md:p-5">
                        <h3 className="mb-1 text-base font-light tracking-wide sm:mb-2 sm:text-lg md:text-xl">
                          {vehicle.model}
                        </h3>
                        <p className="text-xs text-white/90 sm:text-sm">{vehicle.color}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-white/80 sm:gap-3 md:mt-2">
                          <span>{vehicle.fuel}</span>
                          <span>{vehicle.transmission}</span>
                          <span>{vehicle.seats}p</span>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          whileHover={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 md:mt-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium sm:text-sm">
                              <span className="text-base font-bold sm:text-lg">{vehicle.price_per_day}€</span>/j
                            </span>
                            <Button asChild size="sm" className="h-7 bg-accent text-accent-foreground hover:bg-accent/90 text-xs md:h-8">
                              <Link to={`/reservation?vehicle=${vehicle.id}`}>Réserver</Link>
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Chargement des véhicules...
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:scale-110 sm:left-4 sm:h-10 sm:w-10 md:left-6 md:h-12 md:w-12 focus:outline-none focus:ring-2 focus:ring-accent/50 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:scale-110 sm:right-4 sm:h-10 sm:w-10 md:right-6 md:h-12 md:w-12 focus:outline-none focus:ring-2 focus:ring-accent/50 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12 md:mt-14 lg:mt-16">
          {vehicles.map((_, i) => (
            <motion.button
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex ? "h-2 w-8 bg-accent shadow-lg shadow-accent/50" : "h-2 w-2 bg-accent/30 hover:bg-accent/60"
              }`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
