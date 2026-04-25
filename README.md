# LuxeDrive Angular

Proyecto Angular que replica las funcionalidades del sitio original de LuxeDrive:

- Home con hero, sobre nosotros, colección y contacto
- Login y registro con persistencia local
- Detalle de vehículo
- Flujo de compra en dos pasos
- Protección de checkout mediante guard
- Carga dinámica de contenido desde JSON

## Arranque

```bash
npm install
ng serve
```

## Rutas

- `/` inicio
- `/login`
- `/register`
- `/vehiculos/:id`
- `/checkout/info`
- `/checkout/pago`

## Notas

- Las imágenes y los JSON viven en `src/assets`.
- `firebase.config.ts` se mantiene como base para una futura integración real, pero la app se entrega funcionando con la misma lógica del proyecto anterior.
- Si vienes de una instalación previa, es recomendable borrar `node_modules` y volver a ejecutar `npm install`.
