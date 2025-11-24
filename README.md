🍼 BabyWorld — Plataforma de Productos para Bebés

BabyWorld es una aplicación web orientada a la venta de productos para bebés.
Incluye catálogo, detalle de productos, carrito, autenticación de usuarios, panel para administradores y conexión completa con Xano como backend.

🚀 Instalación y Ejecución del Proyecto
1. Clonar el repositorio
git clone https://github.com/aylinne123/Full-Stack-II-Evaluacion3.git

2. Instalar dependencias

Dentro de la carpeta del proyecto:

npm install

3. Ejecutar el proyecto en modo desarrollo
npm run dev

4. Abrir la app

La app quedará disponible en:

http://localhost:5173

🛠️ Backend — Xano

Este proyecto utiliza Xano como backend sin servidor (no-code backend).
Características:

API REST completamente gestionada

Base de datos relacional integrada

Endpoints automáticos para CRUD de productos

Autenticación con JWT

Manejo de imágenes mediante File Storage

Lógica de negocio mediante funciones y scripts internos

Endpoint general de la API del grupo:

https://x8ki-letl-twmt.n7.xano.io/api:XPBVoXLp

👥 Usuarios de Prueba
Administrador

Email: ayl.lopes@duocuc.cl

Contraseña: Hola1234!

Cliente

No necesita credenciales predefinidas

Puede registrarse directamente desde la app

🔐 Autenticación (Xano)

Xano proporciona endpoints para registro e inicio de sesión.
Estos se consumen desde el frontend para gestionar usuarios y permisos.

Endpoints de Autenticación

Signup (registro):

https://x8ki-letl-twmt.n7.xano.io/api:os3AMWEA/auth/signup


Login (inicio de sesión):

https://x8ki-letl-twmt.n7.xano.io/api:os3AMWEA/auth/login

🌐 Rutas / Endpoints Principales del Proyecto
Productos (API general)

Base principal:

https://x8ki-letl-twmt.n7.xano.io/api:XPBVoXLp


Incluye rutas para:

Obtener todos los productos

Obtener un producto por ID

Crear producto (admin)

Actualizar producto (admin)

Eliminar producto (admin)

Cargar imágenes al Storage de Xano

Autenticación (API dedicada)

Como se mencionó arriba:

/auth/signup

/auth/login

📦 Funcionalidades del Proyecto

- Catálogo de productos dinámico

- Carrusel de imágenes por producto

- Carrito de compras

- Login, registro y logout

- Roles: Administrador y Cliente

- CRUD de productos desde panel admin

- Conexión completa con Xano

- Manejo de imágenes múltiples

- Diseño responsive
