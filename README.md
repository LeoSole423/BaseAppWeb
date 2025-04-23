# Sistema de Autenticación Web

Este proyecto es una aplicación web con sistema de autenticación completa (registro e inicio de sesión), desarrollado con React (frontend) y Flask (backend), utilizando MySQL como base de datos. Toda la aplicación está dockerizada para facilitar su despliegue e implementa un tema oscuro para mejor experiencia de usuario.

## Estructura del Proyecto

```
proyecto/
├── backend/                 # Código del servidor
│   ├── app.py               # Aplicación principal de Flask con endpoints de autenticación
│   ├── requirements.txt     # Dependencias de Python
│   └── Dockerfile           # Configuración para contenedor Docker
├── frontend/                # Aplicación web React
│   ├── src/                 # Código fuente
│   │   ├── components/      # Componentes React
│   │   │   ├── LoginForm.tsx    # Componente de inicio de sesión 
│   │   │   └── RegisterForm.tsx # Componente de registro de usuarios
│   │   ├── App.tsx          # Componente principal de la aplicación
│   │   ├── App.css          # Estilos para la aplicación y tema oscuro
│   │   └── main.tsx         # Punto de entrada de la aplicación
│   ├── package.json         # Dependencias y scripts de Node
│   ├── index.html           # Plantilla HTML principal con configuración de tema
│   ├── vite.config.ts       # Configuración de Vite
│   ├── tsconfig.json        # Configuración de TypeScript 
│   ├── tsconfig.node.json   # Configuración de TypeScript para Node
│   └── Dockerfile           # Configuración para contenedor Docker
└── docker-compose.yml       # Configuración de Docker Compose
```

## Descripción de los Archivos Principales

- **backend/app.py**: API REST con endpoints para autenticación, registro de usuarios y perfil de usuario.
- **backend/Dockerfile**: Configuración para construir la imagen Docker del backend.
- **frontend/src/App.tsx**: Componente principal que maneja el estado de la aplicación y la lógica de autenticación.
- **frontend/src/components/LoginForm.tsx**: Formulario de inicio de sesión con validación.
- **frontend/src/components/RegisterForm.tsx**: Formulario de registro de usuarios con validación.
- **frontend/src/App.css**: Estilos CSS para la aplicación, incluye configuración de tema oscuro.
- **frontend/index.html**: Configuración base HTML con metadatos y configuración inicial del tema oscuro.
- **frontend/Dockerfile**: Configuración para construir la imagen Docker del frontend con Nginx.
- **docker-compose.yml**: Orquestación de contenedores para el backend, frontend y base de datos MySQL.

## Tema Oscuro

La aplicación implementa un tema oscuro completo con las siguientes características:

- Fondo oscuro en todas las páginas y componentes
- Contraste optimizado para mejor legibilidad
- Colores adaptados para reducir la fatiga visual
- Compatible con las preferencias de tema del sistema
- Estilos consistentes en formularios, tarjetas y botones

La implementación utiliza:
- Atributo `data-bs-theme="dark"` de Bootstrap 5
- Estilos CSS personalizados con alta especificidad
- JavaScript para garantizar la aplicación del tema

## Inicialización del Proyecto

Para iniciar el proyecto, asegúrate de tener Docker y Docker Compose instalados y sigue estos pasos:

1. Clona el repositorio
2. Navega a la carpeta raíz del proyecto
3. Ejecuta el siguiente comando para iniciar todos los servicios:

```bash
docker-compose up --build
```

Este comando construirá las imágenes necesarias y luego iniciará:
- El servidor backend en http://localhost:5001
- La aplicación frontend en http://localhost:3000
- La base de datos MySQL en el puerto 3306

## Acceso a la Aplicación Web

Una vez que los contenedores estén en funcionamiento:

1. Abre tu navegador web
2. Accede a http://localhost:3000 para ver la aplicación
3. Regístrate como nuevo usuario o inicia sesión con un usuario existente

## Funcionalidades Principales

- **Registro de Usuarios**: Permite a los nuevos usuarios crear una cuenta
- **Inicio de Sesión**: Autenticación segura con token JWT
- **Perfil de Usuario**: Visualización de la información del usuario autenticado
- **Cierre de Sesión**: Opción para terminar la sesión actual
- **Tema Oscuro**: Interfaz con modo oscuro para mejor experiencia visual

## Opciones de Desarrollo

- Para reiniciar los servicios después de cambios: `docker-compose restart`
- Para detener todos los servicios: `docker-compose down`
- Para reconstruir después de cambios importantes: `docker-compose up --build`

## Arquitectura de la Aplicación

- **Frontend**: Aplicación React con TypeScript servida por Nginx
- **Backend**: API REST desarrollada con Flask
- **Base de datos**: MySQL para almacenamiento persistente

## Variables de Entorno

### Backend (configuradas en docker-compose.yml)
- MYSQL_HOST
- MYSQL_USER
- MYSQL_PASSWORD
- MYSQL_DB
- JWT_SECRET_KEY

### Frontend (configuradas en docker-compose.yml)
- VITE_API_URL

## Endpoints API

- POST /api/register - Registro de nuevos usuarios
- POST /api/login - Inicio de sesión y obtención de token JWT
- GET /api/user - Obtener información del usuario autenticado (requiere token JWT) 