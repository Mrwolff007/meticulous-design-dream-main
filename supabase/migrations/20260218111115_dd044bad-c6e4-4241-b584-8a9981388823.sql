
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles: only admins can read
CREATE POLICY "Admins can read roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  price_per_day NUMERIC NOT NULL DEFAULT 20,
  deposit NUMERIC NOT NULL DEFAULT 200,
  mileage TEXT NOT NULL DEFAULT 'Illimité',
  fuel TEXT NOT NULL DEFAULT 'Diesel',
  transmission TEXT NOT NULL DEFAULT 'Manuelle',
  seats INTEGER NOT NULL DEFAULT 5,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active',
  insurance_included BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Public can read vehicles
CREATE POLICY "Anyone can read vehicles" ON public.vehicles
  FOR SELECT USING (true);
-- Admins can manage vehicles
CREATE POLICY "Admins can insert vehicles" ON public.vehicles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update vehicles" ON public.vehicles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vehicles" ON public.vehicles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  cin_number TEXT,
  reliability_score INTEGER NOT NULL DEFAULT 5,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read clients" ON public.clients
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert clients" ON public.clients
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update clients" ON public.clients
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert clients" ON public.clients
  FOR INSERT WITH CHECK (true);

-- Reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_location TEXT,
  client_route TEXT,
  total_amount NUMERIC,
  deposit_amount NUMERIC,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  booking_status TEXT NOT NULL DEFAULT 'pending',
  cin_verified BOOLEAN NOT NULL DEFAULT false,
  cin_recto_url TEXT,
  cin_verso_url TEXT,
  options JSONB DEFAULT '{}',
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read reservations" ON public.reservations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reservations" ON public.reservations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

-- Storage bucket for CIN photos
INSERT INTO storage.buckets (id, name, public) VALUES ('cin-photos', 'cin-photos', false);
CREATE POLICY "Admins can read CIN photos" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'cin-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can upload CIN photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cin-photos');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed vehicles
INSERT INTO public.vehicles (model, color, price_per_day, deposit, fuel) VALUES
  ('Dacia Logan', 'Gris', 20, 200, 'Diesel'),
  ('Dacia Logan', 'Noir', 20, 200, 'Diesel'),
  ('Peugeot 208', 'Gris', 30, 300, 'Essence'),
  ('Peugeot 208', 'Noir', 30, 300, 'Essence'),
  ('Renault Clio 5', 'Gris', 25, 250, 'Essence'),
  ('Renault Clio 5', 'Gris', 25, 250, 'Essence'),
  ('Renault Clio 5', 'Noir', 25, 250, 'Essence');
