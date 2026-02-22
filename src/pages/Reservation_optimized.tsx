import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Car, User, MapPin, CheckCircle2, Loader2, Fuel, Users, Upload, AlertCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

// Validations
const CIN_REGEX = /^[A-Z]{1,2}[0-9]{6,12}$/i;
const PHONE_REGEX = /^(\+212|0)[6-7]\d{8}$/;
const LICENSE_REGEX = /^[A-Z0-9]{8,15}$/;

const reservationSchema = z.object({
  vehicleId: z.string().min(1, "Choisissez un véhicule"),
  startDate: z.date({ required_error: "Date requise" }).refine((date) => date > new Date(), "Date future requise"),
  endDate: z.date({ required_error: "Date requise" }),
  pickupLocation: z.string().min(1, "Requis"),
  returnLocation: z.string().min(1, "Requis"),
  firstName: z.string().min(2, "Min 2 caractères"),
  lastName: z.string().min(2, "Min 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().refine((val) => PHONE_REGEX.test(val), "Format: +212600000000"),
  address: z.string().min(5, "Min 5 caractères"),
  cin: z.string().refine((val) => CIN_REGEX.test(val), "Format invalide"),
  licenseNumber: z.string().refine((val) => LICENSE_REGEX.test(val), "Format invalide"),
  licenseExpiryDate: z.date().refine((date) => date > new Date(), "Permis valide requis"),
  tripDetails: z.string().optional().nullable(),
  acceptTerms: z.boolean().refine((val) => val === true, "Acceptez les conditions"),
});

type FormValues = z.infer<typeof reservationSchema>;

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

      let cinRectoUrl: string | null = null;
      let cinVersoUrl: string | null = null;
      let licensePhotoUrl: string | null = null;

      if (cinRectoFile) cinRectoUrl = await uploadDocument(cinRectoFile, "cin_recto", client.id);
      if (cinVersoFile) cinVersoUrl = await uploadDocument(cinVersoFile, "cin_verso", client.id);
      if (licensePhotoFile) licensePhotoUrl = await uploadDocument(licensePhotoFile, "license_photo", client.id);

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

      const msg = encodeURIComponent(
        `*RÉSERVATION KLK AUTO CAR*\n\n` +
        `${data.firstName} ${data.lastName}\n${data.phone}\n` +
        `${selectedVehicle?.model}\n` +
        `${format(data.startDate, "dd/MM/yyyy")} → ${format(data.endDate, "dd/MM/yyyy")}\n` +
        `Total: ${totalPrice}€`
      );
      window.open(`https://wa.me/212619700592?text=${msg}`, "_blank");

      setIsComplete(true);
      toast.success("Réservation envoyée !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur.");
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
            <Button asChild><Link to="/">Retour</Link></Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 min-h-screen">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-5xl font-bold">Réservez votre véhicule</h1>
          </div>

          <div className="flex items-center justify-center mb-12 gap-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => step.id < currentStep && goToStep(step.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                    currentStep === step.id ? "bg-accent text-accent-foreground" : "bg-secondary"
                  )}
                  disabled={step.id > currentStep}
                >
                  <step.icon className="h-4 w-4" />
                </button>
                {i < steps.length - 1 && <div className="w-8 h-0.5 bg-border" />}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait" custom={direction}>
                {currentStep === 1 && (
                  <motion.div key="1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicles.map((vehicle) => (
                        <Card
                          key={vehicle.id}
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedVehicleId === vehicle.id ? "border-2 border-accent" : ""
                          )}
                          onClick={() => form.setValue("vehicleId", vehicle.id)}
                        >
                          <img src={vehicle.image_url || "/placeholder.svg"} alt={vehicle.model} className="aspect-video object-cover" />
                          <CardContent className="p-4">
                            <h3 className="font-bold text-foreground">{vehicle.model}</h3>
                            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                              <span><Fuel className="h-3 w-3 inline" /> {vehicle.fuel}</span>
                              <span><Users className="h-3 w-3 inline" /> {vehicle.seats}p</span>
                            </div>
                            <div className="text-lg font-bold mt-2">{vehicle.price_per_day}€/jour</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="pickupLocation" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu récupération</FormLabel>
                          <FormControl>
                            <Input placeholder="Lieu..." {...field} onChange={(e) => {
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
                            <Input placeholder="Lieu..." {...field} disabled={returnSame} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={returnSame} onCheckedChange={(v) => {
                          const bool = !!v;
                          setReturnSame(bool);
                          if (bool) {
                            form.setValue("returnLocation", form.getValues("pickupLocation") || "");
                            form.trigger("returnLocation");
                          }
                        }} />
                        <label className="text-xs md:text-sm text-muted-foreground">Retour au même lieu</label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel>Adresse</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="cin" render={({ field }) => (
                      <FormItem><FormLabel>CIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                      <FormItem><FormLabel>Permis</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    {/* Documents */}
                    <div className="space-y-3 pt-4">
                      <p className="font-semibold">Documents</p>
                      {[
                        { file: cinRectoFile, setter: setCinRectoFile, label: "CIN Recto" },
                        { file: cinVersoFile, setter: setCinVersoFile, label: "CIN Verso" },
                        { file: licensePhotoFile, setter: setLicensePhotoFile, label: "Permis" },
                      ].map((item) => (
                        <div key={item.label} className="border-dashed border-2 rounded p-4">
                          <label className="cursor-pointer flex items-center justify-center">
                            <span className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              {item.file ? item.file.name : item.label}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => item.setter(e.target.files?.[0] || null)}
                            />
                          </label>
                        </div>
                      ))}
                      {(!(cinRectoFile && cinVersoFile && licensePhotoFile)) && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded flex gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                          <p className="text-xs text-yellow-700">Tous les documents sont requis</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
                    <FormField control={form.control} name="acceptTerms" render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} /></FormControl>
                        <FormLabel>J'accepte les <Link to="/conditions" className="underline">conditions</Link></FormLabel>
                      </FormItem>
                    )} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 1}>
                  <ChevronLeft className="h-4 w-4" /> Précédent
                </Button>
                {currentStep < 4 ? (
                  <Button onClick={() => goToStep(currentStep + 1)} disabled={!canProceed(currentStep)}>
                    Suivant <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {isSubmitting ? "..." : "Confirmer"}
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
