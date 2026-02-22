import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Car, User, MapPin, CheckCircle2, Loader2, Calendar, Fuel, Settings2, Users } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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

// Regex validations
const CIN_REGEX = /^[A-Z]{1,2}[0-9]{6,12}$/i; // CIN marocain
const PHONE_REGEX = /^(\+212|0)[6-7]\d{8}$/; // Marocain: 06/07/+212
const LICENSE_REGEX = /^[A-Z0-9]{8,15}$/; // Format permis

const reservationSchema = z.object({
  // Step 1: Vehicle
  vehicleId: z.string().min(1, "Veuillez choisir un véhicule"),

  // Step 2: Dates & Location
  startDate: z.date({ required_error: "Date d'arrivée requise" })
    .refine((date) => date > new Date(), "La date doit être future"),
  endDate: z.date({ required_error: "Date de retour requise" }),
  pickupLocation: z.string().trim().min(1, "Lieu de récupération requis").max(200),
  returnLocation: z.string().trim().min(1, "Lieu de retour requis").max(200),

  // Step 3: Personal Info
  firstName: z.string().trim().min(2, "Prénom requis").max(100),
  lastName: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim()
    .refine((val) => PHONE_REGEX.test(val), "Format: +212600000000 ou 0600000000"),
  address: z.string().trim().min(5, "Adresse requise").max(300),
  cin: z.string().trim()
    .refine((val) => CIN_REGEX.test(val), "Format CIN invalide"),
  licenseNumber: z.string().trim()
    .refine((val) => LICENSE_REGEX.test(val), "Permis invalide"),
  licenseExpiryDate: z.date({ required_error: "Date d'expiration requise" })
    .refine((date) => date > new Date(), "Le permis doit être valide"),

  // Step 4: Conditions
  tripDetails: z.string().trim().max(500).optional().nullable(),
  acceptTerms: z.boolean()
    .refine((val) => val === true, "Acceptez les conditions"),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const steps = [
  { id: 1, label: "Véhicule", icon: Car },
  { id: 2, label: "Dates & Lieu", icon: MapPin },
  { id: 3, label: "Infos", icon: User },
  { id: 4, label: "Confirmation", icon: CheckCircle2 },
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
  const [isComplete, setIsComplete] = useState(false);
  const [returnSame, setReturnSame] = useState(true);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      vehicleId: preselectedVehicle,
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phone: "",
      cin: "",
      licenseNumber: "",
      licenseExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
      pickupLocation: "",
      returnLocation: "",
      tripDetails: "",
      acceptTerms: false,
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
      case 2: return !!startDate && !!endDate && startDate < endDate;
      case 3: return form.formState.isValid;
      default: return true;
    }
  };

  const goToStep = (step: number) => {
    if (step < currentStep || canProceed(currentStep)) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    } else {
      toast.error("Complétez tous les champs requis.");
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

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    try {
      // Vérifier documents
      if (!cinRectoFile || !cinVersoFile || !licensePhotoFile) {
        toast.error("Veuillez uploader tous les documents requis.");
        setIsSubmitting(false);
        return;
      }

      // 1. Create client
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
          license_expiry: format(data.licenseExpiryDate!, "yyyy-MM-dd"),
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // 2. Upload documents
      let cinRectoUrl: string | null = null;
      let cinVersoUrl: string | null = null;
      let licensePhotoUrl: string | null = null;

      if (cinRectoFile) {
        cinRectoUrl = await uploadDocument(cinRectoFile, "cin_recto", client.id);
      }
      if (cinVersoFile) {
        cinVersoUrl = await uploadDocument(cinVersoFile, "cin_verso", client.id);
      }
      if (licensePhotoFile) {
        licensePhotoUrl = await uploadDocument(licensePhotoFile, "license_photo", client.id);
      }

      // 3. Create reservation
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

      // 4. Send WhatsApp
      const whatsappMessage = encodeURIComponent(
        `*RÉSERVATION KLK AUTO CAR*\n\n` +
        `${data.firstName} ${data.lastName}\n` +
        `${data.phone}\n` +
        `${selectedVehicle?.model}\n` +
        `${format(data.startDate, "dd/MM/yyyy")} → ${format(data.endDate, "dd/MM/yyyy")}\n` +
        `Total: ${totalPrice}€`
      );
      window.open(`https://wa.me/212619700592?text=${whatsappMessage}`, "_blank");

      setIsComplete(true);
      toast.success("Réservation envoyée !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <Layout>
        <section className="py-24 min-h-[70vh] flex items-center">
          <div className="container px-4 max-w-lg mx-auto text-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">Réservation confirmée !</h1>
            <p className="text-muted-foreground mb-8">Nous vous contacterons rapidement.</p>
            <Button asChild><Link to="/">Retour à l'accueil</Link></Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 min-h-screen">
        <div className="container px-4 max-w-4xl mx-auto">
          {/*  Header */}
          <div className="text-center mb-10">
            <p className="text-foreground/60 text-sm mb-2">Réservation</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold">Réservez votre véhicule</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12 overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center whitespace-nowrap">
                <button
                  onClick={() => step.id < currentStep && goToStep(step.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
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
                </button>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-8 md:w-12 h-[2px] mx-1",
                    step.id < currentStep ? "bg-accent/40" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait" custom={direction}>
                {/* Step 1: Vehicle */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicles.map((vehicle) => (
                        <Card
                          key={vehicle.id}
                          className={cn(
                            "cursor-pointer transition-all overflow-hidden group hover:shadow-lg",
                            selectedVehicleId === vehicle.id ? "border-2 border-accent" : ""
                          )}
                          onClick={() => form.setValue("vehicleId", vehicle.id)}
                        >
                          <div className="aspect-video bg-secondary overflow-hidden">
                            <img
                              src={vehicle.image_url || "/placeholder.svg"}
                              alt={vehicle.model}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-display font-semibold text-foreground mb-1">{vehicle.model}</h3>
                            <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{vehicle.fuel}</span>
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{vehicle.seats}p</span>
                            </div>
                            <div className="text-lg font-bold text-foreground">{vehicle.price_per_day}€/jour</div>
                          </CardContent>
                        </Card>
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
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField control={form.control} name="startDate" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date de début</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "dd/MM/yyyy", { locale: fr }) : "Sélectionnez une date"}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus className="p-3" />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="endDate" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date de fin</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "dd/MM/yyyy", { locale: fr }) : "Sélectionnez une date"}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("startDate") || new Date())} initialFocus className="p-3" />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField control={form.control} name="pickupLocation" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lieu récupération</FormLabel>
                            <FormControl>
                              <Input placeholder="Lieu de récupération" {...field} onChange={(e) => {
                                field.onChange(e);
                                if (returnSame) {
                                  const val = (e.target as HTMLInputElement).value;
                                  form.setValue("returnLocation", val);
                                  form.trigger("returnLocation");
                                }
                              }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="returnLocation" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lieu retour</FormLabel>
                            <FormControl>
                              <Input placeholder="Lieu de retour" {...field} disabled={returnSame} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="flex items-center gap-3">
                        <Checkbox checked={returnSame} onCheckedChange={(v) => {
                          const bool = !!v;
                          setReturnSame(bool);
                          if (bool) {
                            form.setValue("returnLocation", form.getValues("pickupLocation") || "");
                            form.trigger("returnLocation");
                          }
                        }} />
                        <span className="text-sm text-muted-foreground">Retour au même lieu</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Personal Info + Documents */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-muted-foreground text-sm mb-6">Vos informations personnelles et documents.</p>
                    <div className="space-y-6">
                      Les champs du formulaire...
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
                  >
                    <p className="text-muted-foreground text-sm mb-6">Confirmation des conditions.</p>
                    <div className="space-y-6">
                      Résumé et conditions...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(currentStep - 1)}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Précédent
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={() => goToStep(currentStep + 1)}
                    disabled={!canProceed(currentStep)}
                    className="gap-2 bg-accent"
                  >
                    Suivant <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 bg-accent"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {isSubmitting ? "Envoi..." : "Confirmer"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </section>
    </Layout>
  );
};

export default Reservation;
