import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const AdminReservations = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<any>(null);
  const { toast } = useToast();

  const fetchReservations = async () => {
    let q = supabase
      .from("reservations")
      .select("*, clients(first_name, last_name, phone, email, cin_number), vehicles(model, color, price_per_day)")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      q = q.eq("booking_status", filter);
    }

    const { data } = await q;
    setReservations(data || []);
  };

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("reservations").update({ booking_status: status }).eq("id", id);
    toast({ title: `Réservation ${status === "confirmed" ? "confirmée" : "annulée"}` });
    fetchReservations();
  };

  const statusBadge = (status: string) => {
    if (status === "confirmed") return <Badge className="bg-green-500/20 text-green-400 border-0">Confirmé</Badge>;
    if (status === "cancelled") return <Badge className="bg-red-500/20 text-red-400 border-0">Annulé</Badge>;
    return <Badge className="bg-yellow-500/20 text-yellow-400 border-0">En attente</Badge>;
  };

  return (
    <AdminLayout>
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg">Réservations</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.clients?.first_name} {r.clients?.last_name}
                    </TableCell>
                    <TableCell>
                      {r.vehicles?.model} {r.vehicles?.color}
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.start_date} → {r.end_date}
                    </TableCell>
                    <TableCell>{r.total_amount ? `${r.total_amount}€` : "-"}</TableCell>
                    <TableCell>{statusBadge(r.booking_status)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => setDetail(r)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {r.booking_status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => updateStatus(r.id, "confirmed")}>
                            <Check className="h-4 w-4 text-green-400" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => updateStatus(r.id, "cancelled")}>
                            <X className="h-4 w-4 text-red-400" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {reservations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucune réservation
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{detail.clients?.first_name} {detail.clients?.last_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{detail.clients?.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{detail.clients?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CIN</p>
                  <p className="font-medium">{detail.clients?.cin_number || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Véhicule</p>
                  <p className="font-medium">{detail.vehicles?.model} {detail.vehicles?.color}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dates</p>
                  <p className="font-medium">{detail.start_date} → {detail.end_date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lieu de prise en charge</p>
                  <p className="font-medium">{detail.pickup_location || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Montant</p>
                  <p className="font-medium">{detail.total_amount ? `${detail.total_amount}€` : "-"}</p>
                </div>
              </div>
              {detail.comments && (
                <div>
                  <p className="text-muted-foreground">Commentaires</p>
                  <p>{detail.comments}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminReservations;
