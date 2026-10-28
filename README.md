# Home Frog — versión 1

Sitio estático profesional para limpieza domiciliaria e industrial en La Serena y Coquimbo. No requiere instalar paquetes ni configurar una base de datos.

## Abrir y publicar

Abre `index.html` con Chrome, Edge o Firefox. Para una vista local servida, si tienes Python instalado, ejecuta `python -m http.server 4173` dentro de esta carpeta y abre http://127.0.0.1:4173/.

Para GitHub: crea un repositorio y sube **el contenido de `version 1`**, de modo que `index.html` quede en la raíz. Incluye `assets` y conserva los nombres y las rutas.

Para Vercel: importa ese repositorio, selecciona el preset **Other**, deja vacíos el comando de instalación y el comando de compilación, y usa `.` como directorio de salida. No hay variables de entorno ni claves API. `vercel.json` incluye cabeceras básicas y caché de imágenes. La entrega no publica ni cambia tu dominio ni tus cuentas.

SEO preparado para `https://www.homefrog.cl/`, el dominio enlazado por el perfil oficial. Al conectar otro dominio definitivo, cambia canonical, og:url, og:image y twitter:image en `index.html`, además de las URLs en `robots.txt` y `sitemap.xml`. El dominio antiguo no pudo abrirse durante la investigación; no se ha modificado ni conectado.

## Archivos principales

- `index.html`: contenidos, estructura, SEO y datos estructurados.
- `styles.css`: diseño, adaptación a pantallas y animaciones.
- `script.js`: comparador, lienzo de limpieza, precios, cotizador y WhatsApp.
- `assets/`: todas las imágenes utilizadas, sin subcarpetas.
- `brief-marca.md`: investigación, fuentes y decisiones comerciales.
- `prompts-imagenes.md`: textos de generación y procedencia de los recursos ilustrativos.

## Qué hace la página

- Comparación de una alfombra antes/después mediante deslizador, manejable con teclado.
- Modo de limpieza con mouse o dedo: borrar manchas sobre la imagen. Botón alternativo “Ver todo limpio”, reinicio y detección de cambio de pantalla.
- Precios por pestañas y cotizador según servicio, variante y cantidad.
- Mensaje de WhatsApp con servicio, tamaño, cantidad, sector y referencia de precio. El visitante revisa y envía el mensaje en WhatsApp; no se envía automáticamente.
- Menú móvil, preguntas desplegables, enlaces de llamada, correo y mapa.
- Animaciones al recorrer la página, cinta en movimiento, detalles de interacción y botón para pausar. Respeta la preferencia de movimiento reducido del dispositivo.

## Datos comerciales

Contacto principal: **+56 9 9268 9126**, coincidente en Instagram y Facebook. Correo: **homefrogltda@gmail.com**. Local publicado en flyer: **Stripcenter Serena Golf, local 9, La Serena**. El mapa muestra el sector buscado, no una coordenada exacta verificada del local.

Las imágenes entregadas también muestran +56 9 5800 0106 para lavandería/WhatsApp. Se priorizó el número actual de agenda repetido en las dos redes. No se afirma que el otro número esté inactivo.

Precios transcritos de los materiales proporcionados y promoción de alfombras contrastada en redes. Se muestran como referencias sujetas a evaluación, vigencia y confirmación. No se inventaron tarifas de sofás, lavandería ni limpieza profunda. La medida “hasta 2,50 metros” se conserva literalmente; no se reinterpretó como metros cuadrados.

## Fotos

Logo original del usuario, sin redibujar. Dos imágenes recreadas y mejoradas con IA a partir de capturas aportadas por el usuario: la limpieza de una silla y una persona limpiando los vidrios de una terraza. La imagen de tapices conserva la silla marfil, la estructura de madera oscura y el taladro amarillo/negro con cepillo circular; no se atribuye una marca no legible. La sala del comparador, su versión manchada, la limpieza del colchón y la lavandería son imágenes ilustrativas generadas con la herramienta integrada de imágenes. No representan clientes reales ni prometen un resultado específico. No se utilizaron retratos ni reseñas inventadas.

Los recursos están guardados localmente. Las imágenes mejoradas están en `assets/tapiz-limpieza-mejorada.webp` y `assets/limpieza-vidrios-mejorada.webp`. El sitio no depende del CDN de Instagram, de bibliotecas externas ni de fuentes descargadas. El mapa y los enlaces externos requieren conexión. Se incluyó un enlace de Google Maps alternativo al mapa embebido.

## Actualizar precios y contacto

Las tarifas de cálculo están en el objeto `catalog` de `script.js`. Al cambiarlas, actualiza también los precios iniciales y las tarjetas en `index.html`. El número de WhatsApp está en `phone` y los enlaces de llamada y contacto también están en HTML. Mantén consistentes ambos archivos. El formulario no almacena información y no usa cookies de analítica; el iframe de Google Maps es un recurso externo.

## Verificación

La comprobación final se registra en `brief-marca.md`. No hay pagos, reservas automáticas ni disponibilidad inventada: el cierre comercial se realiza con el equipo por WhatsApp.
