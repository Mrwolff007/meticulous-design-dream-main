import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Car, User, MapPin, CheckCircle2, Loader2, Fuel, Users, Upload, AlertCircle, Calendar, Clock } from "lucide-react";
import { format, differenceInDays, setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import AppSpinner from "@/components/AppSpinner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  deposit: number;
  insurance_included: boolean;
}

// Villes/Aéroports pré-remplis
const PICKUP_LOCATIONS = [
  { name: "Marrakesh - Aéroport", value: "Marrakesh Menara Airport" },
  { name: "Casablanca - Aéroport", value: "Casablanca – Aéroport Mohammed V" },
  { name: "Bureau Direct", value: "KLK Auto Car - Bureau" },
];

const CIN_REGEX = /^[A-Z]{1,2}[0-9]{6,12}$/i;
const PHONE_REGEX = /^(\+212|0)[6-7]\d{8}$/;
const LICENSE_REGEX = /^[A-Z0-9]{8,15}$/;

const reservationSchema = z.object({
  vehicleId: z.string().min(1, "Choisissez un véhicule"),
  startDate: z.date({ required_error: "Date requise" }).refine((date) => date > new Date(), "Date future"),
  startHour: z.number().min(0).max(23),
  startMinute: z.number().min(0).max(59),
  endDate: z.date({ required_error: "Date requise" }),
  endHour: z.number().min(0).max(23),
  endMinute: z.number().min(0).max(59),
  pickupLocation: z.string().min(1, "Requis"),
  returnLocation: z.string().min(1, "Requis"),
  firstName: z.string().min(2, "Min 2 caractères"),
  lastName: z.string().min(2, "Min 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().refine((val) => PHONE_REGEX.test(val), "Format: +212600000000"),
  address: z.string().min(5, "Min 5 caractères"),
  cin: z.string().refine((val) => CIN_REGEX.test(val), "Format invalide"),
  licenseNumber: z.string().refine((val) => LICENSE_REGEX.test(val), "Format invalide"),
  licenseExpiryDate: z.date().refine((date) => date > new Date(), "Permis valide"),
  tripDetails: z.string().optional().nullable(),
  acceptTerms: z.boolean().refine((val) => val === true, "Acceptez"),
});

type FormValues = z.infer<typeof reservationSchema>;

const steps = [
  { id: 1, label: "Véhicule", icon: Car },
  { id: 2, label: "Dates", icon: Calendar },
  { id: 3, label: "Infos", icon: User },
  { id: 4, label: "Confirmer", icon: CheckCircle2 },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const preselectedVehicle = searchParams.get("vehicle") || "";
  const [currentStep, setCurrentStep] = useState(preselectedVehicle ? 2 : 1);
  const [direction, setDirection] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [cinRectoFile, setCinRectoFile] = useState<File | null>(null);
  const [cinVersoFile, setCinVersoFile] = useState<File | null>(null);
  const [licensePhotoFile, setLicensePhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [returnSame, setReturnSame] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      vehicleId: preselectedVehicle,
      pickupLocation: "",
      returnLocation: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      cin: "",
      licenseNumber: "",
      licenseExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
      tripDetails: "",
      acceptTerms: false,
      startHour: 10,
      startMinute: 0,
      endHour: 18,
      endMinute: 0,
    },
    mode: "onBlur",
  });

  const selectedVehicleId = form.watch("vehicleId");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId),
    [vehicles, selectedVehicleId]
  );

  const totalDays = useMemo(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate);
      return days > 0 ? days : 1;
    }
    return 0;
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => {
    if (selectedVehicle && totalDays > 0) {
      return selectedVehicle.price_per_day * totalDays;
    }
    return 0;
  }, [selectedVehicle, totalDays]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("available", true)
        .order("model");
      if (data) setVehicles(data as Vehicle[]);
    };
    fetchVehicles();
  }, []);

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1: return !!selectedVehicleId;
      case 2: return !!startDate && !!endDate && startDate < endDate && !!form.getValues("pickupLocation") && !!form.getValues("returnLocation");
      case 3: return !!cinRectoFile && !!cinVersoFile && !!licensePhotoFile;
      default: return true;
    }
  };

  const goToStep = (step: number) => {
    if (step < currentStep || canProceed(currentStep)) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Complétez tous les champs.");
    }
  };

  const uploadDocument = async (file: File, type: string, clientId: string) => {
    const ext = file.name.split(".").pop();
    const path = `${clientId}/${type}.${ext}`;
    const { error } = await supabase.storage.from("client-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("client-documents").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const onSubmit = async (data: FormValues) => {
    if (!cinRectoFile || !cinVersoFile || !licensePhotoFile) {
      toast.error("Uploadez tous les documents.");
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(10);
    try {
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          cin_number: data.cin,
          license_number: data.licenseNumber,
          license_expiry: format(data.licenseExpiryDate, "yyyy-MM-dd"),
        })
        .select()
        .single();

      if (clientError) throw clientError;
      setSubmitProgress(25);

      let cinRectoUrl: string | null = null;
      let cinVersoUrl: string | null = null;
      let licensePhotoUrl: string | null = null;

      if (cinRectoFile) cinRectoUrl = await uploadDocument(cinRectoFile, "cin_recto", client.id);
      if (cinVersoFile) cinVersoUrl = await uploadDocument(cinVersoFile, "cin_verso", client.id);
      if (licensePhotoFile) licensePhotoUrl = await uploadDocument(licensePhotoFile, "license_photo", client.id);
      
      setSubmitProgress(50);

      const { error: reservationError } = await supabase
        .from("reservations")
        .insert({
          client_id: client.id,
          vehicle_id: data.vehicleId,
          start_date: format(data.startDate, "yyyy-MM-dd"),
          end_date: format(data.endDate, "yyyy-MM-dd"),
          pickup_location: data.pickupLocation,
          return_location: data.returnLocation,
          total_amount: totalPrice,
          deposit_amount: selectedVehicle?.deposit || 0,
          cin_recto_url: cinRectoUrl,
          cin_verso_url: cinVersoUrl,
          license_photo_url: licensePhotoUrl,
          documents_verified: !!(cinRectoUrl && cinVersoUrl && licensePhotoUrl),
          comments: data.tripDetails || null,
        });

      if (reservationError) throw reservationError;
      setSubmitProgress(75);

      // 4. WhatsApp: Préparer le message professionnel détaillé
      const cinRectoPhotoUrl = cinRectoUrl ? `CIN Recto: ${cinRectoUrl}` : "";
      const cinVersoPhotoUrl = cinVersoUrl ? `CIN Verso: ${cinVersoUrl}` : "";
      const licensePhotoUrl_msg = licensePhotoUrl ? `Permis de conduire: ${licensePhotoUrl}` : "";

      const whatsappMessage = encodeURIComponent(
        `*RÉSERVATION KLK AUTO CAR*\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*INFORMATIONS CLIENT*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*Nom Complet:* ${data.firstName} ${data.lastName}\n` +
        `*Téléphone:* ${data.phone}\n` +
        `*Email:* ${data.email}\n` +
        `*Adresse:* ${data.address}\n` +
        `*CIN:* ${data.cin}\n` +
        `*Permis:* ${data.licenseNumber}\n` +
        `*Expiration Permis:* ${format(data.licenseExpiryDate, "dd/MM/yyyy")}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*DÉTAILS VÉHICULE*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Modèle: ${selectedVehicle?.model}\n` +
        `Couleur: ${selectedVehicle?.color}\n` +
        `Carburant: ${selectedVehicle?.fuel}\n` +
        `Transmission: ${selectedVehicle?.transmission}\n` +
        `Places: ${selectedVehicle?.seats}\n` +
        `Tarif journalier: ${selectedVehicle?.price_per_day}€\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*DATES & LIEUX*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*Prise en charge:*\n` +
        `   Lieu: ${data.pickupLocation}\n` +
        `   Date: ${format(data.startDate, "dd/MM/yyyy")}\n` +
        `   Heure: ${String(form.getValues("startHour")).padStart(2, "0")}:${String(form.getValues("startMinute")).padStart(2, "0")}\n\n` +
        `*Restitution:*\n` +
        `   Lieu: ${data.returnLocation}\n` +
        `   Date: ${format(data.endDate, "dd/MM/yyyy")}\n` +
        `   Heure: ${String(form.getValues("endHour")).padStart(2, "0")}:${String(form.getValues("endMinute")).padStart(2, "0")}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*TARIFICATION*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Durée: ${totalDays} jour(s)\n` +
        `Montant location: ${totalPrice}€\n` +
        `Caution: ${selectedVehicle?.deposit || 0}€ (remboursable)\n` +
        `*Total à payer: ${totalPrice}€*\n\n` +
        `${data.tripDetails ? `*Notes:* ${data.tripDetails}\n\n` : ""}` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*DOCUMENTS FOURNIS*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${cinRectoPhotoUrl}\n` +
        `${cinVersoPhotoUrl}\n` +
        `${licensePhotoUrl_msg}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*Conditions acceptées:* Oui\n` +
        `*Assurance:* ${selectedVehicle?.insurance_included ? "Incluse" : "À confirmer"}\n\n` +
        `Merci d'avoir choisi KLK AUTO CAR!\n` +
        `Nos équipes vous contactent sous peu.`
      );

      // Envoyer sur WhatsApp avec le numéro de l'entreprise (modifié selon demande)
      window.open(`https://wa.me/212619700592?text=${whatsappMessage}`, "_blank");
      setSubmitProgress(100);

      setIsComplete(true);
      setTimeout(() => {
        toast.success("Réservation envoyée !");
      }, 500);
    } catch (err) {
      toast.error("Erreur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <Layout>
        <section className="py-12 md:py-24 min-h-[70vh] flex items-center px-4">
          <div className="container mx-auto max-w-lg text-center">
            <CheckCircle2 className="h-16 md:h-20 w-16 md:w-20 text-green-500 mx-auto mb-4 md:mb-6" />
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2 md:mb-4">Réservation confirmée !</h1>
            <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8">Nous vous contacterons rapidement.</p>
            <Button asChild className="w-full md:w-auto"><Link to="/">Retour</Link></Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <>
      <AppSpinner isVisible={isSubmitting} progress={submitProgress} />
      <Layout>
      <section className="py-8 md:py-16 min-h-screen px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 md:mb-10">
            <h1 className="font-display text-2xl md:text-3xl lg:text-5xl font-bold">Réservez votre véhicule</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 md:mb-12 gap-2 md:gap-4 overflow-x-auto px-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flexshrink-0">
                <button
                  onClick={() => step.id < currentStep && goToStep(step.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all",
                    currentStep === step.id
                      ? "bg-accent text-accent-foreground"
                      : step.id < currentStep
                      ? "bg-accent/20 text-accent cursor-pointer"
                      : "bg-secondary text-muted-foreground"
                  )}
                  disabled={step.id > currentStep}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden text-xs">{step.id}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "h-0.5 w-4 md:w-8 mx-1 md:mx-2",
                    step.id < currentStep ? "bg-accent/40" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait" custom={direction}>
                {/* Step 1: Vehicle Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {vehicles.map((vehicle) => (
                        <motion.div
                          key={vehicle.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          animate={selectedVehicleId === vehicle.id ? { rotateY: 360 } : {}}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                        >
                          <Card
                            className={cn(
                              "cursor-pointer transition-all overflow-hidden h-full relative",
                              selectedVehicleId === vehicle.id
                                ? "border-2 border-accent ring-1 ring-accent/20 shadow-lg shadow-accent/30"
                                : "hover:border-accent/50"
                            )}
                            onClick={() => form.setValue("vehicleId", vehicle.id)}
                          >
                            <img
                              src={vehicle.image_url || "/placeholder.svg"}
                              alt={vehicle.model}
                              className="aspect-video object-cover w-full"
                            />
                            
                            {/* Bouton flottant animé à la sélection */}
                            {selectedVehicleId === vehicle.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 20, rotate: -15 }}
                                animate={{ opacity: 1, y: 0, rotate: 0 }}
                                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                                className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/20 to-black/40 backdrop-blur-sm"
                              >
                                <motion.div
                                  animate={{ y: [0, -8, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Button 
                                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm md:text-base px-6 md:px-8 py-2 md:py-3 shadow-lg"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      goToStep(2);
                                    }}
                                  >
                                    Réservez !
                                  </Button>
                                </motion.div>
                              </motion.div>
                            )}
                            
                            <CardContent className="p-3 md:p-4">
                              <h3 className="font-bold text-sm md:text-base text-foreground truncate">{vehicle.model}</h3>
                              <div className="flex gap-2 text-xs text-muted-foreground my-2">
                                <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{vehicle.fuel}</span>
                                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{vehicle.seats}p</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-sm md:text-base font-bold text-foreground">{vehicle.price_per_day}€<span className="text-xs text-muted-foreground">/j</span></div>
                                {selectedVehicleId === vehicle.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                    className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold"
                                  >
                                    ✓ Sélectionné
                                  </motion.div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Dates & Location */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {selectedVehicle && (
                      <Card className="bg-accent/5 border-accent/20 p-3 md:p-4">
                        <div className="flex gap-3">
                          <img src={selectedVehicle.image_url || "/placeholder.svg"} alt={selectedVehicle.model} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded" />
                          <div>
                            <p className="font-semibold text-sm md:text-base">{selectedVehicle.model}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">{selectedVehicle.price_per_day}€/jour</p>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Pickup Location - Preset ToggleGroup for accessibility */}
                    <div className="space-y-2">
                      <FormLabel className="text-xs md:text-sm font-semibold">Lieu de récupération</FormLabel>
                      <ToggleGroup
                        type="single"
                        className="grid grid-cols-1 md:grid-cols-3 gap-2"
                        value={form.getValues("pickupLocation") || undefined}
                        onValueChange={(val) => {
                          form.setValue("pickupLocation", val || "");
                          // If user wants same return location, keep it synced
                          if (returnSame) form.setValue("returnLocation", val || "");
                          form.trigger(["pickupLocation", "returnLocation"] as any);
                        }}
                        aria-label="Lieu de récupération"
                      >
                        {PICKUP_LOCATIONS.map((location) => (
                          <ToggleGroupItem
                            key={location.value}
                            value={location.value}
                            aria-label={location.name}
                            className="text-xs md:text-sm py-2 md:py-3 px-3 rounded-lg flex items-center gap-2 justify-center shadow-sm"
                          >
                            <span className="truncate">{location.name}</span>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={returnSame} onCheckedChange={(v) => {
                            const bool = !!v;
                            setReturnSame(bool);
                            if (bool) {
                              // sync now
                              form.setValue("returnLocation", form.getValues("pickupLocation") || "");
                              form.trigger("returnLocation");
                            }
                          }} />
                          <label className="text-xs md:text-sm text-muted-foreground">Retour au même lieu</label>
                        </div>
                        <FormMessage className="text-xs" />
                      </div>
                    </div>

                    {/* Pickup Date & Time */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm md:text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Prise en charge
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Date */}
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant="outline" className={cn("w-full pl-3 text-left font-normal text-xs md:text-sm", !field.value && "text-muted-foreground")}>
                                      {field.value ? format(field.value, "dd/MM", { locale: fr }) : "Date"}
                                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus className="p-3" />
                                </PopoverContent>
                              </Popover>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        {/* Hour */}
                        <FormField
                          control={form.control}
                          name="startHour"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <select
                                  {...field}
                                  value={field.value}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="w-full px-3 py-2 text-xs md:text-sm border border-input rounded-md bg-background hover:bg-secondary transition-colors cursor-pointer"
                                >
                                  {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>
                                      {String(i).padStart(2, "0")}h
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Minute */}
                        <FormField
                          control={form.control}
                          name="startMinute"
                          render={({ field }) => (
                            <FormItem>
                              <select
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="w-full px-3 py-2 text-xs md:text-sm border border-input rounded-md bg-background hover:bg-secondary transition-colors cursor-pointer"
                              >
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option key={i} value={i}>
                                    {String(i).padStart(2, "0")}m
                                  </option>
                                ))}
                              </select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Return Location */}
                    <FormField
                      control={form.control}
                      name="returnLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs md:text-sm font-semibold">Lieu de retour</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez le lieu de retour..."
                              className="text-sm"
                              {...field}
                              disabled={returnSame}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Return Date & Time */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm md:text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Restitution
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Date */}
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant="outline" className={cn("w-full pl-3 text-left font-normal text-xs md:text-sm", !field.value && "text-muted-foreground")}>
                                      {field.value ? format(field.value, "dd/MM", { locale: fr }) : "Date"}
                                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("startDate") || new Date())} initialFocus className="p-3" />
                                </PopoverContent>
                              </Popover>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        {/* Hour */}
                        <FormField
                          control={form.control}
                          name="endHour"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <select
                                  {...field}
                                  value={field.value}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="w-full px-3 py-2 text-xs md:text-sm border border-input rounded-md bg-background hover:bg-secondary transition-colors cursor-pointer"
                                >
                                  {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>
                                      {String(i).padStart(2, "0")}h
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Minute */}
                        <FormField
                          control={form.control}
                          name="endMinute"
                          render={({ field }) => (
                            <FormItem>
                              <select
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="w-full px-3 py-2 text-xs md:text-sm border border-input rounded-md bg-background hover:bg-secondary transition-colors cursor-pointer"
                              >
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option key={i} value={i}>
                                    {String(i).padStart(2, "0")}m
                                  </option>
                                ))}
                              </select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {totalDays > 0 && selectedVehicle && (
                      <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs md:text-sm text-muted-foreground">{totalDays}j × {selectedVehicle.price_per_day}€</span>
                          <span className="text-xl md:text-2xl font-bold text-accent">{totalPrice}€</span>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Personal Info & Documents */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4 md:space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs md:text-sm">Prénom</FormLabel><FormControl><Input className="text-sm" {...field} /></FormControl><FormMessage className="text-xs" /></FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs md:text-sm">Nom</FormLabel><FormControl><Input className="text-sm" {...field} /></FormControl><FormMessage className="text-xs" /></FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs md:text-sm">Email</FormLabel><FormControl><Input type="email" className="text-sm" {...field} /></FormControl><FormMessage className="text-xs" /></FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs md:text-sm">Téléphone</FormLabel><FormControl><Input className="text-sm" {...field} /></FormControl><FormMessage className="text-xs" /></FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel className="text-xs md:text-sm">Adresse</FormLabel><FormControl><Input className="text-sm" {...field} /></FormControl><FormMessage className="text-xs" /></FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <FormField control={form.control} name="cin" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs md:text-sm">CIN</FormLabel><FormControl><Input className="text-sm" {...field} /></FormControl><FormMessage className="text-xs" /></FormItem>
                      )} />
                      <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs md:text-sm">Permis</FormLabel><FormControl><Input className="text-sm" {...field} /></FormControl><FormMessage className="text-xs" /></FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="licenseExpiryDate" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs md:text-sm">Expiration du permis</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className={cn("w-full pl-3 text-left font-normal text-sm", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "dd/MM/yyyy", { locale: fr }) : "Sélectionnez une date"}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus className="p-3" />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />

                    {/* Documents Upload */}
                    <div className="space-y-3 pt-4 md:pt-6 border-t border-border">
                      <p className="font-semibold text-sm md:text-base">Documents (obligatoires)</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { file: cinRectoFile, setter: setCinRectoFile, label: "CIN Recto" },
                          { file: cinVersoFile, setter: setCinVersoFile, label: "CIN Verso" },
                          { file: licensePhotoFile, setter: setLicensePhotoFile, label: "Permis" },
                        ].map((item) => (
                          <div key={item.label} className="border-2 border-dashed border-border rounded-lg p-3 md:p-4 hover:border-accent transition-colors">
                            <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-2">
                              {item.file ? (
                                <>
                                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                                  <span className="text-xs text-center truncate text-green-700 font-medium">{item.file.name}</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-6 w-6 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground text-center">{item.label}</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => item.setter(e.target.files?.[0] || null)}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                      {!(cinRectoFile && cinVersoFile && licensePhotoFile) && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-yellow-700">Tous les documents sont obligatoires</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4 md:space-y-6"
                  >
                    <Card className="bg-accent/5 border-accent/20 p-4 md:p-6">
                      <h3 className="font-semibold text-sm md:text-base mb-3">Conditions générales</h3>
                      <ul className="text-xs md:text-sm text-muted-foreground space-y-1.5">
                        <li className="flex gap-2">✓ <span>Les informations sont exactes et complètes</span></li>
                        <li className="flex gap-2">✓ <span>J'accepte les conditions de location</span></li>
                        <li className="flex gap-2">✓ <span>La caution sera remboursée après inspection</span></li>
                        <li className="flex gap-2">✓ <span>L'assurance est incluse</span></li>
                      </ul>
                    </Card>

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-3">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} className="mt-1" />
                          </FormControl>
                          <label className="text-xs md:text-sm text-muted-foreground cursor-pointer">
                            J'accepte les <Link to="/conditions" className="underline text-accent">conditions</Link>
                          </label>
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-2 md:gap-4 mt-6 md:mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="w-full md:w-auto text-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Précédent</span>
                  <span className="md:hidden">Retour</span>
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={() => goToStep(currentStep + 1)}
                    disabled={!canProceed(currentStep)}
                    className="flex-1 md:flex-auto text-sm"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1 md:ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 md:flex-auto text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="hidden md:inline">Envoi...</span>
                        <span className="md:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirmer
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </section>
      </Layout>
    </>
  );
};

export default Reservation;
