export interface Vehicle {
  id: string;
  model: string;
  color: string;
  pricePerDay: number;
  deposit: number;
  mileage: string;
  fuel: string;
  transmission: string;
  seats: number;
  image: string;
  available: boolean;
}

export const vehicles: Vehicle[] = [
  {
    id: "dacia-gris",
    model: "Dacia Logan",
    color: "Gris",
    pricePerDay: 20,
    deposit: 200,
    mileage: "Illimité",
    fuel: "Diesel",
    transmission: "Manuelle",
    seats: 5,
    image: "/placeholder.svg",
    available: true,
  },
  {
    id: "dacia-noir",
    model: "Dacia Logan",
    color: "Noir",
    pricePerDay: 20,
    deposit: 200,
    mileage: "Illimité",
    fuel: "Diesel",
    transmission: "Manuelle",
    seats: 5,
    image: "/placeholder.svg",
    available: true,
  },
  {
    id: "peugeot-208-gris",
    model: "Peugeot 208",
    color: "Gris",
    pricePerDay: 30,
    deposit: 300,
    mileage: "Illimité",
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/placeholder.svg",
    available: true,
  },
  {
    id: "peugeot-208-noir",
    model: "Peugeot 208",
    color: "Noir",
    pricePerDay: 30,
    deposit: 300,
    mileage: "Illimité",
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/placeholder.svg",
    available: true,
  },
  {
    id: "clio5-gris-1",
    model: "Renault Clio 5",
    color: "Gris",
    pricePerDay: 25,
    deposit: 250,
    mileage: "Illimité",
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/placeholder.svg",
    available: true,
  },
  {
    id: "clio5-gris-2",
    model: "Renault Clio 5",
    color: "Gris",
    pricePerDay: 25,
    deposit: 250,
    mileage: "Illimité",
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/placeholder.svg",
    available: true,
  },
  {
    id: "clio5-noir",
    model: "Renault Clio 5",
    color: "Noir",
    pricePerDay: 25,
    deposit: 250,
    mileage: "Illimité",
    fuel: "Essence",
    transmission: "Manuelle",
    seats: 5,
    image: "/placeholder.svg",
    available: true,
  },
];
