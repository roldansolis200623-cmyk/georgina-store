# Carpeta de Imágenes - Georgina Store

## Estructura

```
public/
├── favicon.svg          # Icono de la pestaña del navegador
├── icons/
│   └── logo.svg         # Logo del sitio
└── images/
    ├── banners/         # Banners para el carrusel del inicio
    │   ├── banner-1.jpg
    │   ├── banner-2.jpg
    │   └── banner-3.jpg
    ├── products/        # Fotos de productos
    │   ├── producto-1.jpg
    │   ├── producto-2.jpg
    │   └── ...
    └── about/           # Fotos de la sección "Nosotros"
        ├── tienda.jpg
        ├── equipo.jpg
        └── ...
```

## Recomendaciones para las imágenes

### Banners
- Tamaño recomendado: 1920x600 px
- Formato: JPG o WebP
- Peso máximo: 500KB

### Productos
- Tamaño recomendado: 800x800 px (cuadrado)
- Formato: JPG, PNG o WebP
- Fondo: Blanco o transparente
- Peso máximo: 200KB

### About/Nosotros
- Tamaño recomendado: 1200x800 px
- Formato: JPG o WebP
- Peso máximo: 300KB

## Cómo agregar imágenes

1. Coloca las imágenes en la carpeta correspondiente
2. Usa nombres descriptivos sin espacios ni caracteres especiales
   - ✅ sofa-moderno-gris.jpg
   - ❌ Sofá Moderno (Gris).jpg

3. Para productos, actualiza el campo `image` en el panel admin con la ruta:
   - Ejemplo: `/images/products/sofa-moderno-gris.jpg`

4. Para banners, actualiza el componente Hero o Banner con las rutas correspondientes
