import { Injectable, inject } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private firestore = inject(Firestore);
  private vehiclesCollection = collection(this.firestore, 'vehiculos');
  private imageAliases: Record<string, string> = {
    gt: 'assets/images/gt.jpg',
    'gt.jpg': 'assets/images/gt.jpg',
    sedan: 'assets/images/sedan.jpeg',
    'sedan.jpg': 'assets/images/sedan.jpeg',
    'sedan.jpeg': 'assets/images/sedan.jpeg',
    suv: 'assets/images/suv.jpg',
    'suv.jpg': 'assets/images/suv.jpg',
    'suv.jpeg': 'assets/images/suv.jpg',
    electrico: 'assets/images/electrico.jpg',
    'electrico.jpg': 'assets/images/electrico.jpg',
    'electrico.jpeg': 'assets/images/electrico.jpg'
  };

  private vehicles$ = collectionData(this.vehiclesCollection, { idField: 'id' }).pipe(
    map((documents) =>
      (documents as Partial<Vehicle>[]).map((vehicle) => this.normalizeVehicle(vehicle))
    ),
    shareReplay(1)
  );

  getVehicles(): Observable<Vehicle[]> {
    return this.vehicles$;
  }

  getVehicleById(id: string): Observable<Vehicle | null> {
    return this.vehicles$.pipe(
      map((vehicles) => vehicles.find((vehicle) => vehicle.id === id) ?? null)
    );
  }

  private normalizeVehicle(vehicle: Partial<Vehicle>): Vehicle {
    return {
      id: vehicle.id ?? '',
      nombre: vehicle.nombre ?? 'Vehiculo sin nombre',
      precio: vehicle.precio ?? '',
      tipo: vehicle.tipo ?? '',
      imagen: this.normalizeImagePath(this.extractImagePath(vehicle), vehicle.id ?? ''),
      descripcion: vehicle.descripcion ?? '',
      specs: this.extractSpecs(vehicle),
      caracteristicas: this.extractFeatures(vehicle)
    };
  }

  private extractImagePath(vehicle: Partial<Vehicle>): string {
    const rawVehicle = vehicle as Partial<Vehicle> & {
      image?: string;
      img?: string;
      foto?: string;
    };

    return rawVehicle.imagen ?? rawVehicle.image ?? rawVehicle.img ?? rawVehicle.foto ?? '';
  }

  private extractSpecs(vehicle: Partial<Vehicle>): Vehicle['specs'] {
    const rawVehicle = vehicle as Partial<Vehicle> & {
      especificaciones?: unknown;
      [key: string]: unknown;
    };

    const rawSpecs = rawVehicle.specs ?? rawVehicle.especificaciones;
    const specsArray = this.toArray(rawSpecs);
    const baseSpecs = specsArray
      .map((spec) => {
        const rawSpec = (spec ?? {}) as {
          titulo?: string;
          title?: string;
          nombre?: string;
          valor?: string;
          value?: string;
        };

        const titulo = rawSpec.titulo ?? rawSpec.title ?? rawSpec.nombre ?? '';
        const valor = rawSpec.valor ?? rawSpec.value ?? '';

        if (!titulo && !valor) {
          return null;
        }

        return { titulo, valor };
      })
      .filter((spec): spec is Vehicle['specs'][number] => spec !== null);

    const additionalSpecs = [
      this.buildNamedSpec(rawVehicle, 'Autonomía', ['Autonomía', 'Autonomia']),
      this.buildNamedSpec(rawVehicle, 'Año', ['Año', 'Ano']),
      this.buildNamedSpec(rawVehicle, 'Batería', ['Batería', 'Bateria']),
      this.buildNamedSpec(rawVehicle, 'Combustible', ['Combustible']),
      this.buildNamedSpec(rawVehicle, 'Potencia', ['Potencia']),
      this.buildNamedSpec(rawVehicle, '0-100 km-h', ['0-100 km-h', '0-100 km/h']),
      this.buildNamedSpec(rawVehicle, 'Motor', ['motor', 'Motor']),
      this.buildNamedSpec(rawVehicle, 'Velocidad Máx.', [
        'Velocidad Máx.',
        'Velocidad Max.',
        'Velocidad Max',
        'Velocidad máxima',
        'Velocidad maxima'
      ])
    ].filter((spec): spec is Vehicle['specs'][number] => spec !== null);

    const knownTitles = new Set(baseSpecs.map((spec) => spec.titulo.trim().toLowerCase()));

    additionalSpecs.forEach((spec) => {
      const normalizedTitle = spec.titulo.trim().toLowerCase();
      if (!knownTitles.has(normalizedTitle)) {
        baseSpecs.push(spec);
        knownTitles.add(normalizedTitle);
      }
    });

    return baseSpecs;
  }

  private extractFeatures(vehicle: Partial<Vehicle>): string[] {
    const rawVehicle = vehicle as Partial<Vehicle> & {
      caracteristicasDestacadas?: unknown;
      features?: unknown;
    };
    const rawFeatures =
      rawVehicle.caracteristicas ?? rawVehicle.caracteristicasDestacadas ?? rawVehicle.features;

    if (typeof rawFeatures === 'string') {
      return rawFeatures
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    return this.toArray(rawFeatures)
      .map((item) => `${item ?? ''}`.trim())
      .filter((item) => item.length > 0);
  }

  private buildNamedSpec(
    vehicle: Record<string, unknown>,
    title: string,
    keys: string[]
  ): Vehicle['specs'][number] | null {
    const value = keys
      .map((key) => vehicle[key])
      .find((candidate) => candidate !== undefined && candidate !== null && `${candidate}`.trim() !== '');

    if (value === undefined || value === null) {
      return null;
    }

    return {
      titulo: title,
      valor: `${value}`.trim()
    };
  }

  private toArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) {
      return value as T[];
    }

    if (value && typeof value === 'object') {
      return Object.values(value) as T[];
    }

    return [];
  }

  private normalizeImagePath(path: string, vehicleId: string): string {
    const normalizedSource = path.trim().replace(/\\/g, '/');
    const normalizedId = vehicleId.trim().toLowerCase();

    if (!normalizedSource) {
      return this.imageAliases[normalizedId] ?? 'assets/images/logo.jpeg';
    }

    const aliasKey = normalizedSource.toLowerCase().replace(/^assets\/images\//, '').replace(/^images\//, '');
    if (this.imageAliases[aliasKey]) {
      return this.imageAliases[aliasKey];
    }

    if (this.imageAliases[normalizedId]) {
      return this.imageAliases[normalizedId];
    }

    if (!normalizedSource) {
      return 'assets/images/logo.jpeg';
    }

    if (
      normalizedSource.startsWith('http://') ||
      normalizedSource.startsWith('https://') ||
      normalizedSource.startsWith('assets/')
    ) {
      return normalizedSource;
    }

    if (normalizedSource.startsWith('images/')) {
      return `assets/${normalizedSource.replace(/^\/+/, '')}`;
    }

    const normalizedPath = normalizedSource.replace(/^\/+/, '');
    return `assets/images/${normalizedPath.replace(/^images\//, '')}`;
  }
}
