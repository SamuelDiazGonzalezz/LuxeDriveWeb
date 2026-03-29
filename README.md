# LuxeDriveWeb <img src="images/logo.jpeg" alt="Logo" width="90"/>

## Desarrolladores:
- Aridane Miranda Domínguez
- Samuel Díaz González
- Miguel Dario Tovar Navarro

## Descripción
LuxeDrive es una página web interactiva que simula la experiencia de un concesionario premium de vehículos de lujo. Permite a los usuarios explorar una colección de coches de alta gama, conocer sus características y consultar detalles individuales de cada modelo. La web está diseñada con un enfoque moderno, responsivo y atractivo, usando HTML, CSS y JavaScript puro.

### ----> Ejecutar desde WebStorm el index.html de la rama sprint2
## ----> Documentos PDF/FIGMA-MOCKUPS-SPRINT2.pdf con todos los mockups de figma del sprint2

## Enlace a los mockups en Figma 
-> [https://www.figma.com/design/EEC0lcJoLLpwTF892JCFj2/El-equipo-de-miguel.tovar101-team-library?node-id=0-1&t=T3q0igQogViRcPRk-1](https://www.figma.com/design/EEC0lcJoLLpwTF892JCFj2/El-equipo-de-miguel.tovar101-team-library?node-id=0-1&t=4h9R8C8I6HcmXmTZ-1)


## Características principales de la web

<img width="272" height="643" alt="image" src="https://github.com/user-attachments/assets/eb6883cd-3c95-4bdd-9642-39f74b23d1e2" />

JSON: coches.json (contiene los datos de los coches en venta que son cargados dinámicamente en el detalle.js) y users.json que contiene los usuarios que se han registrado.

<img width="980" height="545" alt="image" src="https://github.com/user-attachments/assets/4434411a-3372-47b2-90b5-adfd9c08962e" />


CSS: Cada página tiene su propio archivo CSS además de base.css para estilos generales, en el sprint 2 añadimos a los css la implementacion de un diseño responsive para móvil y tablet.

<img width="944" height="536" alt="image" src="https://github.com/user-attachments/assets/a04162cc-784f-4b0a-a1e0-62a1558a9f0d" />


JS: Scripts por página (detalle.js, informacion.js, pagos.js, login.js) y un script general (script.js).

<img width="928" height="533" alt="image" src="https://github.com/user-attachments/assets/eb958563-87dc-472e-9b68-29fa25429e78" />

Carga dinánica de los datos del json coches.json en el detalles.js

<img width="484" height="540" alt="image" src="https://github.com/user-attachments/assets/885cd3a1-e336-454e-a69f-ff2340c1c658" />



Templates HTML: Estructura modular con base, header y footer para reutilización, y páginas funcionales (detalle, informacion, pagos, index, login, registrarse).

Flujo de la web:

index.html → home que carga los templates header.html, base.html (contiene los apartados  portada, contactos, colección y sobre nosotros) y footer.html.

## Formularios SPRINT 2:
login.html → página para iniciar sesión el usuario.

<img width="878" height="629" alt="image" src="https://github.com/user-attachments/assets/ff89678e-79e5-4bbd-9a87-f9f12ada6f0e" />

registrarse.html → página para crear una cuenta de usuario.

<img width="810" height="759" alt="image" src="https://github.com/user-attachments/assets/332223dd-ddd2-4d1d-b9b3-52ad62e04b7e" />



detalle.html → página de detalles de un coche (dinámico por ID) y cargando el template del footer.html.

informacion.html → página de formulario de datos del comprador, validación de campos.

<img width="1124" height="851" alt="image" src="https://github.com/user-attachments/assets/fcd6768d-20b6-4f1b-b90b-8eb9d5ceabad" />


pagos.html → página de pago y resumen final, datos del coche cargados desde localStorage pasados del informacion.html.:




## Trello sprint 2

<img width="1137" height="351" alt="image" src="https://github.com/user-attachments/assets/010764ec-10df-443a-9b0a-a15278379e43" />


## Storyboard

<img width="860" height="481" alt="image" src="https://github.com/user-attachments/assets/eaddd0e3-def6-4880-9c54-c645dc134d36" />

