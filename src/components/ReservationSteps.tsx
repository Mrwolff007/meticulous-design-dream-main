import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, Upload, CheckCircle2, Fuel, Settings2, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

interface ReservationFormValues {
  vehicleId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  pickupLocation: string;
  returnLocation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cin: string;
  licenseNumber: string;
  licenseExpiryDate: Date | undefined;
  tripDetails?: string | null;
  acceptTerms: boolean;
}

// ============== STEP 1: Choose Vehicle ==============
export const Step1Vehicle = ({
  form,
  vehicles,
  selectedVehicleId,
  totalPrice,
  totalDays,
  selectedVehicle,
}: {
  form: UseFormReturn<ReservationFormValues>;
  vehicles: Vehicle[];
  selectedVehicleId: string;
  totalPrice: number;
  totalDays: number;
  selectedVehicle?: Vehicle;
}) => (
  <div>
    <div className="mb-6">
      <p className="text-foreground/60 text-sm font-medium mb-1">Instructions</p>
      <p className="text-muted-foreground text-sm">
        Choisissez le véhicule qui convient à votre besoin. Cliquez sur une voiture pour la sélectionner.
      </p>
    </div>

    <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Choisissez votre véhicule</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.id}
          className={cn(
            "cursor-pointer transition-all duration-300 overflow-hidden group hover:shadow-lg",
            selectedVehicleId === vehicle.id
              ? "border-2 border-accent glow-accent bg-accent/5"
              : "border-border hover:border-foreground/20"
          )}
          onClick={() => form.setValue("vehicleId", vehicle.id)}
        >
          <div className="aspect-video bg-secondary relative overflow-hidden">
            <img
              src={vehicle.image_url || "/placeholder.svg"}
              alt={vehicle.model}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {selectedVehicleId === vehicle.id && (
              <div className="absolute top-3 left-3">
                <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Sélectionné
                </div>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display font-semibold text-foreground">{vehicle.model}</h3>
              <span className="text-sm text-muted-foreground">{vehicle.color}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Fuel className="h-3 w-3" />
                {vehicle.fuel}
              </span>
              <span className="flex items-center gap-1">
                <Settings2 className="h-3 w-3" />
                {vehicle.transmission}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {vehicle.seats}p
              </span>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="text-lg font-semibold text-foreground">{vehicle.price_per_day}€/jour</div>
              <div className="text-xs text-muted-foreground">Caution: {vehicle.deposit}€</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {selectedVehicle && (
      <Card className="bg-accent/10 border-accent/20 p-4">
        <p className="text-sm font-medium text-foreground mb-2">Résumé du véhicule</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Modèle:</span>
            <p className="font-semibold text-foreground">{selectedVehicle.model}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Prix/jour:</span>
            <p className="font-semibold text-foreground">{selectedVehicle.price_per_day}€</p>
          </div>
        </div>
      </Card>
    )}
  </div>
);

// ============== STEP 2: Dates & Location ==============
export const Step2DatesLocation = ({
  form,
  minDate,
  totalDays,
  totalPrice,
  selectedVehicle,
}: {
  form: UseFormReturn<ReservationFormValues>;
  minDate: Date;
  totalDays: number;
  totalPrice: number;
  selectedVehicle?: Vehicle;
}) => (
  <div>
    <div className="mb-6">
      <p className="text-foreground/60 text-sm font-medium mb-1">Instructions</p>
      <p className="text-muted-foreground text-sm">
        Spécifiez vos dates de location et les lieux de récupération/retour. Tous les champs sont obligatoires.
      </p>
    </div>

    <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Dates & Lieux</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Start Date */}
      <FormField
        control={form.control}
        name="startDate"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Date d'arrivée
              {fieldState.error && <span className="text-red-500">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "dd/MM/yyyy") : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < minDate}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* End Date */}
      <FormField
        control={form.control}
        name="endDate"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Date de retour
              {fieldState.error && <span className="text-red-500">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "dd/MM/yyyy") : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < form.watch("startDate") || date <= new Date()}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* Pickup & Return Location */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <FormField
        control={form.control}
        name="pickupLocation"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Lieu de récupération
              {fieldState.error && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Aéroport Marrakech, Centre-ville Casablanca"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="returnLocation"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Lieu de retour
              {fieldState.error && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Aéroport Marrakech, Centre-ville Casablanca"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* Price Summary */}
    {totalDays > 0 && selectedVehicle && (
      <Card className="bg-accent/10 border-accent/20 p-4">
        <p className="text-sm font-medium text-foreground mb-3">Résumé du prix</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{totalDays} jour(s) × {selectedVehicle.price_per_day}€</span>
            <span className="font-semibold">{totalPrice}€</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Caution</span>
            <span className="font-semibold">{selectedVehicle.deposit}€</span>
          </div>
          <div className="pt-2 border-t border-accent/30 flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-accent">{totalPrice + (selectedVehicle.deposit || 0)}€</span>
          </div>
        </div>
      </Card>
    )}
  </div>
);

// ============== STEP 3: Personal Info ==============
export const Step3PersonalInfo = ({
  form,
}: {
  form: UseFormReturn<ReservationFormValues>;
}) => (
  <div>
    <div className="mb-6">
      <p className="text-foreground/60 text-sm font-medium mb-1">Instructions</p>
      <p className="text-muted-foreground text-sm">
        Entrez vos informations personnelles. Assurez-vous que le numéro de téléphone est au format marocain (+212 ou 06-07).
      </p>
    </div>

    <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Vos informations</h2>

    <div className="space-y-6">
      {/* Name and Surname */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Prénom
                {fieldState.error && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mohamed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Nom
                {fieldState.error && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: Bennani" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Email
                {fieldState.error && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="votre@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Téléphone
                {fieldState.error && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Input placeholder="+212600000000 ou 0600000000" {...field} />
              </FormControl>
              {fieldState.error && (
                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
              )}
            </FormItem>
          )}
        />
      </div>

      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Adresse
              {fieldState.error && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Input placeholder="Ex: 123 Avenue Mohammed V, Casablanca" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CIN & License */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cin"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Numéro CIN
                {fieldState.error && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: AB123456789E" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Numéro Permis
                {fieldState.error && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: ABC12345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* License Expiry */}
      <FormField
        control={form.control}
        name="licenseExpiryDate"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Expiration du permis
              {fieldState.error && <span className="text-red-500">*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "dd/MM/yyyy") : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Notes */}
      <FormField
        control={form.control}
        name="tripDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes (optionnel)</FormLabel>
            <FormControl>
              <textarea
                placeholder="Informations supplémentaires sur votre voyage..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                rows={3}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  </div>
);

// ============== STEP 4: Documents ==============
export const Step4Documents = ({
  cinRectoFile,
  cinVersoFile,
  licensePhotoFile,
  setCinRectoFile,
  setCinVersoFile,
  setLicensePhotoFile,
}: {
  cinRectoFile: File | null;
  cinVersoFile: File | null;
  licensePhotoFile: File | null;
  setCinRectoFile: (file: File | null) => void;
  setCinVersoFile: (file: File | null) => void;
  setLicensePhotoFile: (file: File | null) => void;
}) => {
  const uploadFile = (
    setter: (file: File | null) => void,
    file: File | undefined,
    maxSizeMB: number = 5
  ) => {
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Le fichier ne doit pas dépasser ${maxSizeMB}MB`);
      return;
    }
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      alert("Format accepté: JPG, PNG, PDF");
      return;
    }
    setter(file);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-foreground/60 text-sm font-medium mb-1">Instructions</p>
        <p className="text-muted-foreground text-sm">
          Uploadez les photos claires de vos documents (JPG, PNG ou PDF). Taille max: 5MB par fichier.
        </p>
      </div>

      <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Documents & Vérification</h2>

      <div className="space-y-6">
        {/* CIN Recto */}
        <Card className="p-6 border-dashed border-2">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center py-6">
              <Upload className="h-12 w-12 text-accent mb-3" />
              <p className="font-semibold text-foreground">CIN - Recto</p>
              <p className="text-xs text-muted-foreground mt-1">Cliquez ou glissez vos fichiers ici (JPG, PNG)</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => uploadFile(setCinRectoFile, e.target.files?.[0])}
              className="hidden"
            />
          </label>
          {cinRectoFile && (
            <div className="mt-3 flex items-center gap-2 bg-green-50 p-2 rounded">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">{cinRectoFile.name}</span>
            </div>
          )}
        </Card>

        {/* CIN Verso */}
        <Card className="p-6 border-dashed border-2">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center py-6">
              <Upload className="h-12 w-12 text-accent mb-3" />
              <p className="font-semibold text-foreground">CIN - Verso</p>
              <p className="text-xs text-muted-foreground mt-1">Cliquez ou glissez vos fichiers ici (JPG, PNG)</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => uploadFile(setCinVersoFile, e.target.files?.[0])}
              className="hidden"
            />
          </label>
          {cinVersoFile && (
            <div className="mt-3 flex items-center gap-2 bg-green-50 p-2 rounded">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">{cinVersoFile.name}</span>
            </div>
          )}
        </Card>

        {/* License Photo */}
        <Card className="p-6 border-dashed border-2">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center py-6">
              <Upload className="h-12 w-12 text-accent mb-3" />
              <p className="font-semibold text-foreground">Permis de conduire</p>
              <p className="text-xs text-muted-foreground mt-1">Cliquez ou glissez vos fichiers ici (JPG, PNG)</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => uploadFile(setLicensePhotoFile, e.target.files?.[0])}
              className="hidden"
            />
          </label>
          {licensePhotoFile && (
            <div className="mt-3 flex items-center gap-2 bg-green-50 p-2 rounded">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">{licensePhotoFile.name}</span>
            </div>
          )}
        </Card>

        {/* Warning */}
        {!(cinRectoFile && cinVersoFile && licensePhotoFile) && (
          <Card className="bg-yellow-50 border-yellow-200 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 text-sm">Tous les documents sont obligatoires</p>
                <p className="text-xs text-yellow-800 mt-1">Vous ne pouvez pas continuer sans compléter l'upload de tous les documents.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// ============== STEP 5: Confirmation ==============
export const Step5Confirmation = ({
  form,
}: {
  form: UseFormReturn<ReservationFormValues>;
}) => (
  <div>
    <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Confirmation des conditions</h2>

    <div className="space-y-6">
      <Card className="bg-accent/5 p-6">
        <p className="font-semibold text-foreground mb-3">Conditions générales</p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex gap-2">
            <span>✓</span>
            <span>Je confirme que tous les informations fournies sont exactes et complètes.</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Je comprends et accepte les conditions de location de KLK AUTO CAR.</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Je m'engage à retourner le véhicule dans le même état à la date convenue.</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Je reconnais que la caution sera remboursée après inspection du véhicule.</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>L'assurance tous risques est incluse dans le prix de location.</span>
          </li>
        </ul>
      </Card>

      <FormField
        control={form.control}
        name="acceptTerms"
        render={({ field, fieldState }) => (
          <FormItem className="flex items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm cursor-pointer flex items-center gap-2">
                J'accepte les conditions générales
                {fieldState.error && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {form.watch("acceptTerms") && (
        <Card className="bg-green-50 border-green-200 p-4">
          <p className="text-sm text-green-800">Conditions acceptées. Vous pouvez maintenant confirmer votre réservation.</p>
        </Card>
      )}
    </div>
  </div>
);
