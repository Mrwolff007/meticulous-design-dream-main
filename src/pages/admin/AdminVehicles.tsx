import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Upload, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  id: string;
  model: string;
  color: string;
  price_per_day: number;
  deposit: number;
  mileage: string;
  fuel: string;
  transmission: string;
  seats: number;
  available: boolean;
  image_url: string | null;
}

const emptyVehicle = {
  model: "",
  color: "",
  price_per_day: 20,
  deposit: 200,
  mileage: "Illimité",
  fuel: "Diesel",
  transmission: "Manuelle",
  seats: 5,
  available: true,
};

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyVehicle);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    const { data } = await supabase.from("vehicles").select("*").order("model");
    setVehicles((data as Vehicle[]) || []);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyVehicle);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({
      model: v.model,
      color: v.color,
      price_per_day: v.price_per_day,
      deposit: v.deposit,
      mileage: v.mileage,
      fuel: v.fuel,
      transmission: v.transmission,
      seats: v.seats,
      available: v.available,
    });
    setImageFile(null);
    setImagePreview(v.image_url || null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (vehicleId: string): Promise<string | null> => {
    if (!imageFile) return editing?.image_url || null;
    
    const ext = imageFile.name.split(".").pop();
    const path = `${vehicleId}.${ext}`;
    
    // Delete old image if exists
    await supabase.storage.from("vehicle-photos").remove([path]);
    
    const { error } = await supabase.storage
      .from("vehicle-photos")
      .upload(path, imageFile, { upsert: true });
    
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
      return null;
    }
    
    const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      if (editing) {
        const imageUrl = await uploadImage(editing.id);
        await supabase.from("vehicles").update({ ...form, image_url: imageUrl }).eq("id", editing.id);
        toast({ title: "Véhicule modifié" });
      } else {
        const { data: inserted } = await supabase.from("vehicles").insert(form).select().single();
        if (inserted) {
          const imageUrl = await uploadImage(inserted.id);
          if (imageUrl) {
            await supabase.from("vehicles").update({ image_url: imageUrl }).eq("id", inserted.id);
          }
        }
        toast({ title: "Véhicule ajouté" });
      }
      setDialogOpen(false);
      fetchVehicles();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("vehicles").delete().eq("id", id);
    toast({ title: "Véhicule supprimé" });
    fetchVehicles();
  };

  const toggleAvailability = async (v: Vehicle) => {
    await supabase.from("vehicles").update({ available: !v.available }).eq("id", v.id);
    fetchVehicles();
  };

  return (
    <AdminLayout>
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Gestion du parc</CardTitle>
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Prix/jour</TableHead>
                  <TableHead>Caution</TableHead>
                  <TableHead>Carburant</TableHead>
                  <TableHead>Dispo</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      {v.image_url ? (
                        <img src={v.image_url} alt={v.model} className="h-10 w-14 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-14 bg-accent rounded flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{v.model}</TableCell>
                    <TableCell>{v.color}</TableCell>
                    <TableCell>{v.price_per_day}€</TableCell>
                    <TableCell>{v.deposit}€</TableCell>
                    <TableCell>{v.fuel}</TableCell>
                    <TableCell>
                      <Switch checked={v.available} onCheckedChange={() => toggleAvailability(v)} />
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(v)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le véhicule" : "Ajouter un véhicule"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image upload */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Aperçu" className="h-32 w-full object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Cliquez pour ajouter une photo</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <Input placeholder="Modèle" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            <Input placeholder="Couleur" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Prix/jour" value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: +e.target.value })} />
              <Input type="number" placeholder="Caution" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: +e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select value={form.fuel} onValueChange={(v) => setForm({ ...form, fuel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Essence">Essence</SelectItem>
                </SelectContent>
              </Select>
              <Select value={form.transmission} onValueChange={(v) => setForm({ ...form, transmission: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manuelle">Manuelle</SelectItem>
                  <SelectItem value="Automatique">Automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input type="number" placeholder="Places" value={form.seats} onChange={(e) => setForm({ ...form, seats: +e.target.value })} />
            <Button className="w-full" onClick={handleSave} disabled={uploading}>
              {uploading ? "Envoi en cours..." : editing ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminVehicles;
