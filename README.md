# LuxeDriveWeb <img src="images/logo.jpeg" alt="Logo" width="90"/>

## Desarrolladores:
- Aridane Miranda Domínguez
- Samuel Díaz González
- Miguel Dario Tovar Navarro

## Descripción
LuxeDrive es una página web interactiva que simula la experiencia de un concesionario premium de vehículos de lujo. Permite a los usuarios explorar una colección de coches de alta gama, conocer sus características y consultar detalles individuales de cada modelo. La web está diseñada con un enfoque moderno, responsivo y atractivo, usando HTML, CSS y JavaScript puro.

### ----> Ejecutar desde WebStorm el index.html

## Carpeta "Documentos PDF"
DOCUMENTO DE REQUISITOS LUXEDRIVEWEB 41.4.pdf  ->   Documento formal de los requisitos del software.

Mockups_storyboard_41.4.pdf  -> Documento pdf con los mockups y storyboard

## Requisitos
<img width="550" height="425" alt="image" src="https://github.com/user-attachments/assets/99c4ec51-8cc0-45b9-9282-7e8312f28fab" />
<img width="550" height="301" alt="image" src="https://github.com/user-attachments/assets/6ba2aea7-ed25-4d5a-a389-2cc14fe52371" />


## Características principales de la web

CSS: Cada página tiene su propio archivo CSS además de base.css para estilos generales.

JS: Scripts por página (detalle.js, informacion.js, pagos.js) y un script general (script.js).

Templates HTML: Estructura modular con base, header y footer para reutilización, y páginas funcionales (detalle, informacion, pagos, index).

Flujo de la web:

index.html → home que carga los templates header, base (contiene los apartados  portada, contactos, colección y sobre nosotros) y footer.

detalle.html → pagina de detalles de un coche (dinámico por ID).

informacion.html → página de formulario de datos del comprador, validación de campos.

pagos.html → página de pago y resumen final, datos del coche cargados desde localStorage.:

<img width="367" height="621" alt="image" src="https://github.com/user-attachments/assets/4e9b43b9-53b3-4376-b382-4a2b6049d00a" />

