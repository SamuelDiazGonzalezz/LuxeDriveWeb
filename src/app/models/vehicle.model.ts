export interface VehicleSpec {
  titulo: string;
  valor: string;
}

export interface Vehicle {
  id: string;
  nombre: string;
  precio: string;
  tipo: string;
  imagen: string;
  descripcion: string;
  specs: VehicleSpec[];
  caracteristicas: string[];
}
