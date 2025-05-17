# Manual de Referencia HTML

## Índice
1. [Introducción a HTML](#introducción-a-html)
2. [Estructura básica](#estructura-básica)
3. [Elementos HTML comunes](#elementos-html-comunes)
4. [Formularios](#formularios)
5. [Tablas](#tablas)
6. [Semántica HTML5](#semántica-html5)
7. [Buenas prácticas](#buenas-prácticas)
8. [Recursos adicionales](#recursos-adicionales)

## Introducción a HTML

HTML (HyperText Markup Language) es el lenguaje estándar para crear páginas web. Define la estructura y el contenido de una página mediante una serie de elementos que le dicen al navegador cómo mostrar el contenido.

### ¿Qué son las etiquetas HTML?

Las etiquetas HTML son fragmentos de código que definen elementos dentro de una página web:

```html
<etiqueta>Contenido</etiqueta>
```

Las etiquetas pueden tener atributos que proporcionan información adicional:

```html
<etiqueta atributo="valor">Contenido</etiqueta>
```

## Estructura básica

Un documento HTML básico tiene la siguiente estructura:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Título de la página</title>
    <link rel="stylesheet" href="estilos.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header>
        <h1>Encabezado principal</h1>
    </header>
    
    <main>
        <p>Contenido principal de la página</p>
    </main>
    
    <footer>
        <p>Pie de página</p>
    </footer>
</body>
</html>
```

### Explicación de la estructura:

- `<!DOCTYPE html>`: Define el tipo de documento como HTML5
- `<html>`: Elemento raíz que envuelve todo el contenido
- `<head>`: Contiene metadatos como título, enlaces a CSS, configuraciones
- `<meta charset="UTF-8">`: Define la codificación de caracteres
- `<meta name="viewport">`: Configuración para dispositivos móviles
- `<title>`: Título de la página que se muestra en la pestaña del navegador
- `<body>`: Contiene todo el contenido visible de la página
- `<header>`, `<main>`, `<footer>`: Secciones semánticas del documento

## Elementos HTML comunes

### Encabezados

```html
<h1>Encabezado de nivel 1 (más importante)</h1>
<h2>Encabezado de nivel 2</h2>
<h3>Encabezado de nivel 3</h3>
<h4>Encabezado de nivel 4</h4>
<h5>Encabezado de nivel 5</h5>
<h6>Encabezado de nivel 6 (menos importante)</h6>
```

### Párrafos y formateo de texto

```html
<p>Este es un párrafo de texto.</p>
<p>Otro párrafo con <strong>texto en negrita</strong> y <em>texto en cursiva</em>.</p>
<p>También puedes usar <b>negrita</b> y <i>cursiva</i> (menos semánticos).</p>
<p>Para saltos de línea usa <br> la etiqueta br.</p>
<hr> <!-- Línea horizontal -->
```

### Enlaces

```html
<!-- Enlace básico -->
<a href="https://example.com">Texto del enlace</a>

<!-- Enlace que se abre en nueva pestaña -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
    Abrir en nueva pestaña
</a>

<!-- Enlace a correo electrónico -->
<a href="mailto:correo@example.com">Enviar email</a>

<!-- Enlace a teléfono -->
<a href="tel:+123456789">Llamar</a>

<!-- Enlace a un ID dentro de la página -->
<a href="#seccion-1">Ir a sección 1</a>
```

### Imágenes

```html
<!-- Imagen básica -->
<img src="ruta/imagen.jpg" alt="Descripción accesible de la imagen">

<!-- Imagen con dimensiones específicas -->
<img src="ruta/imagen.jpg" alt="Descripción" width="300" height="200">

<!-- Imagen con texto al pasar el cursor -->
<img src="ruta/imagen.jpg" alt="Descripción" title="Texto al pasar cursor">
```

### Listas

```html
<!-- Lista ordenada (numerada) -->
<ol>
    <li>Primer elemento</li>
    <li>Segundo elemento</li>
    <li>Tercer elemento</li>
</ol>

<!-- Lista desordenada (con viñetas) -->
<ul>
    <li>Elemento</li>
    <li>Otro elemento</li>
    <li>Y otro más</li>
</ul>

<!-- Lista de definiciones -->
<dl>
    <dt>Término</dt>
    <dd>Definición del término</dd>
    <dt>Otro término</dt>
    <dd>Definición del otro término</dd>
</dl>
```

## Formularios

Los formularios permiten recopilar información del usuario:

```html
<form action="/procesar" method="post">
    <!-- Campo de texto simple -->
    <div>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
    </div>
    
    <!-- Campo de email -->
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <!-- Campo de contraseña -->
    <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required>
    </div>
    
    <!-- Casilla de verificación -->
    <div>
        <input type="checkbox" id="acepto" name="acepto" required>
        <label for="acepto">Acepto los términos y condiciones</label>
    </div>
    
    <!-- Botones de radio -->
    <div>
        <p>Selecciona una opción:</p>
        <input type="radio" id="opcion1" name="opcion" value="1">
        <label for="opcion1">Opción 1</label><br>
        
        <input type="radio" id="opcion2" name="opcion" value="2">
        <label for="opcion2">Opción 2</label>
    </div>
    
    <!-- Lista desplegable -->
    <div>
        <label for="pais">País:</label>
        <select id="pais" name="pais">
            <option value="">Selecciona un país</option>
            <option value="es">España</option>
            <option value="mx">México</option>
            <option value="co">Colombia</option>
        </select>
    </div>
    
    <!-- Área de texto -->
    <div>
        <label for="mensaje">Mensaje:</label>
        <textarea id="mensaje" name="mensaje" rows="4" cols="40"></textarea>
    </div>
    
    <!-- Botones de envío y reinicio -->
    <div>
        <button type="submit">Enviar</button>
        <button type="reset">Limpiar</button>
    </div>
</form>
```

### Tipos de input comunes

- `text`: Campo de texto simple
- `email`: Campo para correo electrónico
- `password`: Campo para contraseñas (oculta los caracteres)
- `number`: Campo para números
- `date`: Selector de fecha
- `time`: Selector de hora
- `file`: Selector de archivos
- `checkbox`: Casilla de verificación
- `radio`: Botón de opción única
- `color`: Selector de color
- `range`: Control deslizante
- `tel`: Campo para número de teléfono
- `url`: Campo para URL
- `search`: Campo de búsqueda

## Tablas

Las tablas sirven para mostrar datos tabulares:

```html
<table border="1">
    <caption>Título de la tabla</caption>
    
    <thead>
        <tr>
            <th>Encabezado 1</th>
            <th>Encabezado 2</th>
            <th>Encabezado 3</th>
        </tr>
    </thead>
    
    <tbody>
        <tr>
            <td>Fila 1, Celda 1</td>
            <td>Fila 1, Celda 2</td>
            <td>Fila 1, Celda 3</td>
        </tr>
        <tr>
            <td>Fila 2, Celda 1</td>
            <td>Fila 2, Celda 2</td>
            <td>Fila 2, Celda 3</td>
        </tr>
    </tbody>
    
    <tfoot>
        <tr>
            <td colspan="3">Pie de tabla</td>
        </tr>
    </tfoot>
</table>
```

## Semántica HTML5

HTML5 introdujo elementos semánticos que dan significado a la estructura:

```html
<header>Cabecera de la página o sección</header>
<nav>Menú de navegación</nav>
<main>Contenido principal</main>
<article>Contenido independiente y completo</article>
<section>Sección temática del documento</section>
<aside>Contenido relacionado indirectamente</aside>
<footer>Pie de página o sección</footer>
<figure>
    <img src="imagen.jpg" alt="Descripción">
    <figcaption>Leyenda de la figura</figcaption>
</figure>
<time datetime="2023-05-16">16 de mayo de 2023</time>
<details>
    <summary>Título desplegable</summary>
    Contenido que se despliega al hacer clic
</details>
```

## Buenas prácticas

1. **Usa HTML semántico**: Elige las etiquetas que mejor describan el contenido, como `<article>`, `<section>`, `<nav>`, etc.

2. **Accesibilidad**:
   - Añade siempre el atributo `alt` a las imágenes
   - Usa `<label>` para los campos de formulario
   - Asegúrate de que la página sea navegable por teclado
   - Usa atributos ARIA cuando sea necesario

3. **Estructura clara**:
   - Usa sangría para hacer el código más legible
   - Mantén una jerarquía lógica de encabezados (h1, h2, h3...)
   - Divide el contenido en secciones lógicas

4. **Validación**: 
   - Valida tu HTML con herramientas como el [Validador del W3C](https://validator.w3.org/)
   - Asegúrate de cerrar todas las etiquetas correctamente

5. **Optimización**:
   - Incluye los atributos `width` y `height` en las imágenes para evitar saltos en la carga
   - Usa el atributo `loading="lazy"` para imágenes que no estén en la parte visible inicial

## Recursos adicionales

- [MDN Web Docs - HTML](https://developer.mozilla.org/es/docs/Web/HTML)
- [W3Schools - HTML Tutorial](https://www.w3schools.com/html/)
- [HTML5 Doctor](http://html5doctor.com/) - Para entender mejor los elementos semánticos
- [Can I use](https://caniuse.com/) - Para verificar la compatibilidad de características HTML 