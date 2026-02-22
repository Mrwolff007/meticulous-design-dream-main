import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CalendarCheck, Users, DollarSign } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

interface Stats {
  totalVehicles: number;
  availableVehicles: number;
  totalReservations: number;
  pendingReservations: number;
  totalClients: number;
  totalRevenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalVehicles: 0,
    availableVehicles: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalClients: 0,
    totalRevenue: 0,
  });
  const [recentReservations, setRecentReservations] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [vehicles, reservations, clients] = await Promise.all([
        supabase.from("vehicles").select("id, available"),
        supabase.from("reservations").select("id, booking_status, total_amount, created_at, start_date, end_date"),
        supabase.from("clients").select("id"),
      ]);

      const vData = vehicles.data || [];
      const rData = reservations.data || [];
      const cData = clients.data || [];

      setStats({
        totalVehicles: vData.length,
        availableVehicles: vData.filter((v) => v.available).length,
        totalReservations: rData.length,
        pendingReservations: rData.filter((r) => r.booking_status === "pending").length,
        totalClients: cData.length,
        totalRevenue: rData
          .filter((r) => r.booking_status === "confirmed")
          .reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0),
      });

      // Recent reservations with client & vehicle info
      const { data: recent } = await supabase
        .from("reservations")
        .select("*, clients(first_name, last_name), vehicles(model, color)")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentReservations(recent || []);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Véhicules", value: `${stats.availableVehicles}/${stats.totalVehicles}`, sub: "disponibles", icon: Car, color: "text-blue-400" },
    { label: "Réservations", value: stats.totalReservations, sub: `${stats.pendingReservations} en attente`, icon: CalendarCheck, color: "text-yellow-400" },
    { label: "Clients", value: stats.totalClients, sub: "total", icon: Users, color: "text-green-400" },
    { label: "Revenus", value: `${stats.totalRevenue}€`, sub: "confirmés", icon: DollarSign, color: "text-primary" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </div>
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Réservations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentReservations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune réservation pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {recentReservations.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-md bg-accent/30">
                    <div>
                      <p className="text-sm font-medium">
                        {r.clients?.first_name} {r.clients?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.vehicles?.model} {r.vehicles?.color} • {r.start_date} → {r.end_date}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        r.booking_status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : r.booking_status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {r.booking_status === "confirmed" ? "Confirmé" : r.booking_status === "cancelled" ? "Annulé" : "En attente"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
