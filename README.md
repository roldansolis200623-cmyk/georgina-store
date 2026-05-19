# 🛍️ Georgina Store

> E-commerce moderno con panel de administración, carrito de compras, favoritos e integración con WhatsApp.

---

## 🚀 ¿Qué es este proyecto?

Georgina Store es una tienda online completa desarrollada para un cliente real. Cuenta con catálogo de productos, búsqueda y filtros avanzados, carrito de compras, sistema de favoritos, reseñas y un panel de administración para gestionar el inventario. Incluye modo oscuro/claro y animaciones fluidas.

---

## ✨ Funcionalidades

- 🗂️ **Catálogo** — Grid de productos con filtros por categoría, precio y ordenamiento
- 🔍 **Búsqueda** — Modal de búsqueda en tiempo real
- 🛒 **Carrito** — Drawer lateral con gestión de cantidades
- ❤️ **Favoritos** — Guardado de productos favoritos
- ⭐ **Reseñas** — Sistema de valoraciones con estrellas
- 🛠️ **Panel Admin** — CRUD de productos, estadísticas y gestión de inventario
- 💬 **WhatsApp** — Botón flotante para contacto directo con el negocio
- 🌙 **Tema oscuro/claro** — Toggle de tema persistente
- 🎉 **Animaciones** — Transiciones con Framer Motion
- 📱 **Responsive** — Diseño adaptado a móvil y escritorio

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Base de Datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Estado global | Zustand |
| Formularios | React Hook Form + Zod |
| Animaciones | Framer Motion |
| Íconos | Lucide React |
| Notificaciones | Sonner |

---

## 📁 Estructura del proyecto

```
georgina-store/
├── src/
│   ├── app/                  # Rutas (Next.js App Router)
│   │   ├── page.tsx          # Home
│   │   ├── producto/[id]/    # Página de producto
│   │   └── contacto/         # Página de contacto
│   ├── components/
│   │   ├── catalog/          # ProductCard, Filtros, Grid, Modal
│   │   ├── admin/            # Panel de administración
│   │   ├── cart/             # Carrito de compras
│   │   ├── favorites/        # Favoritos
│   │   ├── auth/             # Login / Registro
│   │   ├── layout/           # Header, Footer, WhatsApp, Hero
│   │   └── ui/               # Componentes reutilizables
│   └── lib/
│       └── utils/            # Helpers y utilidades
└── public/
    └── images/               # Banners, productos, about
```

---

## ⚙️ Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_WHATSAPP_NUMBER=51XXXXXXXXX
```

---

## 🏃 Cómo correr el proyecto localmente

```bash
# Clonar el repo
git clone https://github.com/roldansolis200623-cmyk/georgina-store.git
cd georgina-store

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# (editar .env.local con tus credenciales de Supabase)

# Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 👨‍💻 Autor

**Juan Gabriel Roldán Solís**  
Desarrollador Full Stack | Ingeniería de Sistemas — CIBERTEC  
📧 roldansolis200623@gmail.com
