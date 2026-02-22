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
    <div className="relative overflow-hidden py-8">
      <div
        className="relative h-[300px] w-full sm:h-[320px] md:h-[350px] lg:h-[400px]"
        style={{
          perspective: "1200px",
          WebkitPerspective: "1200px",
        }}
      >
        <div className="transform-gpu relative h-full w-full" style={{ WebkitTransformStyle: "preserve-3d" }}>
          {vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => {
              const transform = getTransform(index);
              return (
                <motion.div
                  key={vehicle.id}
                  className="absolute top-1/2 left-1/2 h-[250px] w-[280px] -translate-x-1/2 cursor-pointer overflow-hidden rounded-xl sm:h-[280px] sm:w-[320px] md:h-[350px] md:w-[400px] lg:h-[400px] lg:w-[500px]"
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
                    <div className="absolute right-0 bottom-0 left-0 p-3 text-white sm:p-4 md:p-6">
                      <h3 className="mb-1 text-lg font-light tracking-wide sm:mb-2 sm:text-xl md:text-2xl">
                        {vehicle.model}
                      </h3>
                      <p className="text-xs text-white/90 sm:text-sm">{vehicle.color}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-white/80">
                        <span>{vehicle.fuel}</span>
                        <span>{vehicle.transmission}</span>
                        <span>{vehicle.seats} places</span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        whileHover={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            <span className="text-lg font-bold">{vehicle.price_per_day}€</span>/jour
                          </span>
                          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
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

        {/* Indicators */}
        <div className="absolute right-0 -bottom-6 left-0 flex justify-center space-x-3 sm:-bottom-4">
          {vehicles.map((_, i) => (
            <motion.button
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:scale-110 sm:left-3 sm:h-11 sm:w-11 lg:left-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:scale-110 sm:right-3 sm:h-11 sm:w-11 lg:right-4 focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>
  );
}
