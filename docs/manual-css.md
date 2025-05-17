# Manual de Referencia CSS

## Índice
1. [Introducción a CSS](#introducción-a-css)
2. [Sintaxis y selectores](#sintaxis-y-selectores)
3. [Modelo de caja](#modelo-de-caja)
4. [Posicionamiento](#posicionamiento)
5. [Flexbox y Grid](#flexbox-y-grid)
6. [Responsive Design](#responsive-design)
7. [Transformaciones y animaciones](#transformaciones-y-animaciones)
8. [Variables CSS](#variables-css)
9. [Buenas prácticas](#buenas-prácticas)
10. [Recursos adicionales](#recursos-adicionales)

## Introducción a CSS

CSS (Cascading Style Sheets) es el lenguaje utilizado para dar estilo y presentación a documentos HTML. Define cómo se muestran los elementos HTML en la pantalla, en papel, o en otros medios.

### Formas de incluir CSS

1. **CSS Inline** (directamente en el elemento):
```html
<p style="color: blue; font-size: 16px;">Este texto es azul</p>
```

2. **CSS Interno** (en la sección `<head>` del documento):
```html
<head>
    <style>
        p {
            color: blue;
            font-size: 16px;
        }
    </style>
</head>
```

3. **CSS Externo** (en un archivo separado) - Recomendado:
```html
<head>
    <link rel="stylesheet" href="estilos.css">
</head>
```

Archivo `estilos.css`:
```css
p {
    color: blue;
    font-size: 16px;
}
```

## Sintaxis y selectores

La sintaxis básica de CSS consiste en un selector y una declaración:

```css
selector {
    propiedad: valor;
    otra-propiedad: otro-valor;
}
```

### Selectores básicos

```css
/* Selector de elemento - aplica a todos los párrafos */
p {
    color: blue;
}

/* Selector de ID - aplica al elemento con id="identificador" */
#identificador {
    color: red;
}

/* Selector de clase - aplica a todos los elementos con class="nombre-clase" */
.nombre-clase {
    color: green;
}

/* Selector de atributo - aplica a elementos con cierto atributo */
[type="text"] {
    border: 1px solid gray;
}

/* Combinador descendiente - aplica a elementos <a> dentro de <nav> */
nav a {
    text-decoration: none;
}

/* Selector de hijo directo - aplica a <li> que son hijos directos de <ul> */
ul > li {
    list-style-type: square;
}

/* Selector de hermano adyacente - aplica a <p> justo después de <h2> */
h2 + p {
    font-weight: bold;
}

/* Selector universal - aplica a todos los elementos */
* {
    box-sizing: border-box;
}
```

### Pseudo-clases y pseudo-elementos

```css
/* Pseudo-clases - estados especiales de elementos */
a:hover {
    color: red; /* Cambia el color al pasar el cursor */
}

a:visited {
    color: purple; /* Color para enlaces visitados */
}

button:active {
    background-color: darkblue; /* Color cuando se hace clic */
}

input:focus {
    border-color: blue; /* Color del borde al enfocar */
}

li:first-child {
    font-weight: bold; /* El primer elemento <li> */
}

li:nth-child(odd) {
    background-color: #f2f2f2; /* Elementos <li> impares */
}

/* Pseudo-elementos - partes específicas de elementos */
p::first-letter {
    font-size: 2em; /* Primera letra del párrafo */
}

p::before {
    content: "»"; /* Añade contenido antes del párrafo */
}

p::after {
    content: "«"; /* Añade contenido después del párrafo */
}

::selection {
    background-color: yellow; /* Color al seleccionar texto */
}
```

### Especificidad

La especificidad determina qué regla CSS se aplica cuando hay conflictos. De menor a mayor especificidad:

1. Selector de elemento: `p` (especificidad: 1)
2. Selector de clase: `.clase` (especificidad: 10)
3. Selector de ID: `#id` (especificidad: 100)
4. Estilo inline: `style="..."` (especificidad: 1000)
5. !important: `color: red !important;` (mayor especificidad, evitar usar)

## Modelo de caja

Cada elemento HTML se representa como una caja rectangular:

```css
div {
    /* Contenido */
    width: 300px;
    height: 200px;
    
    /* Relleno interno */
    padding: 20px; /* Todos los lados */
    padding: 10px 20px; /* vertical horizontal */
    padding: 10px 20px 15px 25px; /* arriba derecha abajo izquierda */
    
    /* Borde */
    border: 1px solid black; /* ancho estilo color */
    border-radius: 5px; /* esquinas redondeadas */
    
    /* Margen externo */
    margin: 10px; /* Todos los lados */
    margin: 0 auto; /* centrar horizontalmente */
    
    /* Comportamiento de la caja */
    box-sizing: border-box; /* width incluye padding y border */
}
```

## Posicionamiento

```css
/* Posicionamiento estático (default) */
div {
    position: static;
}

/* Posicionamiento relativo (relativo a su posición normal) */
.relativo {
    position: relative;
    top: 10px;
    left: 20px;
}

/* Posicionamiento absoluto (relativo al ancestro posicionado más cercano) */
.absoluto {
    position: absolute;
    top: 0;
    right: 0;
}

/* Posicionamiento fijo (relativo a la ventana del navegador) */
.fijo {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

/* Posicionamiento pegajoso (actúa como relative hasta alcanzar un umbral) */
.pegajoso {
    position: sticky;
    top: 0;
}

/* Control de z-index (orden de apilamiento) */
.encima {
    z-index: 10; /* Valores mayores aparecen encima */
}
```

## Flexbox y Grid

### Flexbox

Diseñado para layouts unidimensionales:

```css
/* Contenedor flex */
.contenedor {
    display: flex;
    
    /* Dirección */
    flex-direction: row; /* horizontal (default) */
    /* también: column, row-reverse, column-reverse */
    
    /* Ajuste de línea */
    flex-wrap: wrap; /* permite múltiples líneas */
    /* también: nowrap, wrap-reverse */
    
    /* Atajo para direction y wrap */
    flex-flow: row wrap;
    
    /* Alineación horizontal */
    justify-content: space-between;
    /* también: flex-start, flex-end, center, space-around, space-evenly */
    
    /* Alineación vertical */
    align-items: center;
    /* también: flex-start, flex-end, stretch, baseline */
    
    /* Alineación de múltiples líneas */
    align-content: space-between;
    /* también: flex-start, flex-end, center, space-around, stretch */
}

/* Elementos flex */
.item {
    /* Orden de aparición */
    order: 2;
    
    /* Capacidad de crecer */
    flex-grow: 1;
    
    /* Capacidad de reducirse */
    flex-shrink: 0;
    
    /* Tamaño base */
    flex-basis: 200px;
    
    /* Atajo para grow, shrink y basis */
    flex: 1 0 200px;
    
    /* Alineación individual (anula align-items) */
    align-self: flex-end;
}
```

### Grid

Para layouts bidimensionales:

```css
/* Contenedor grid */
.contenedor {
    display: grid;
    
    /* Definir columnas */
    grid-template-columns: 1fr 2fr 1fr; /* 3 columnas con proporciones */
    grid-template-columns: repeat(3, 1fr); /* 3 columnas iguales */
    grid-template-columns: minmax(100px, 1fr) 2fr; /* con tamaño mínimo */
    
    /* Definir filas */
    grid-template-rows: 100px auto 100px;
    
    /* Espacio entre celdas */
    gap: 20px; /* Espacio en filas y columnas */
    column-gap: 20px; /* Solo entre columnas */
    row-gap: 10px; /* Solo entre filas */
    
    /* Alineación horizontal de todos los elementos */
    justify-items: center;
    /* también: start, end, stretch */
    
    /* Alineación vertical de todos los elementos */
    align-items: center;
    /* también: start, end, stretch */
    
    /* Alineación horizontal del grid entero */
    justify-content: center;
    /* también: start, end, space-between, space-around, space-evenly */
    
    /* Alineación vertical del grid entero */
    align-content: center;
    /* también: start, end, space-between, space-around, space-evenly */
}

/* Elementos grid */
.item {
    /* Posicionar elemento específicamente */
    grid-column: 1 / 3; /* Desde línea 1 hasta línea 3 (abarca 2 columnas) */
    grid-column: 1 / span 2; /* Comienza en 1 y abarca 2 columnas */
    
    grid-row: 2 / 4; /* Desde línea 2 hasta línea 4 (abarca 2 filas) */
    
    /* Atajo para column y row */
    grid-area: 2 / 1 / 4 / 3; /* fila-inicio / col-inicio / fila-fin / col-fin */
    
    /* Alineación horizontal individual */
    justify-self: end;
    /* también: start, center, stretch */
    
    /* Alineación vertical individual */
    align-self: start;
    /* también: end, center, stretch */
}
```

## Responsive Design

Diseño adaptable a diferentes tamaños de pantalla:

```css
/* Media queries */
@media (max-width: 768px) {
    /* Estilos para pantallas de hasta 768px de ancho */
    .contenedor {
        flex-direction: column;
    }
}

@media (min-width: 768px) and (max-width: 1024px) {
    /* Estilos para pantallas entre 768px y 1024px */
}

@media (orientation: portrait) {
    /* Estilos para orientación vertical */
}

/* Unidades relativas */
html {
    font-size: 16px; /* Base para unidades rem */
}

.elemento {
    width: 100%; /* Porcentaje del elemento padre */
    max-width: 1200px; /* Límite máximo */
    font-size: 1.5rem; /* Relativo al tamaño base del html */
    padding: 2em; /* Relativo al tamaño de fuente del elemento */
    height: 50vh; /* 50% de la altura de la ventana */
}

/* Imágenes responsive */
img {
    max-width: 100%;
    height: auto;
}
```

## Transformaciones y animaciones

### Transformaciones

```css
.elemento {
    /* Ejemplos de transformaciones */
    transform: translateX(20px); /* Mover en X */
    transform: translateY(-10px); /* Mover en Y */
    transform: scale(1.5); /* Escalar 1.5 veces */
    transform: rotate(45deg); /* Rotar 45 grados */
    transform: skew(10deg, 5deg); /* Inclinar */
    
    /* Combinación de transformaciones */
    transform: translateX(20px) rotate(45deg) scale(1.2);
}
```

### Transiciones

Para cambios suaves entre estados:

```css
.boton {
    background-color: blue;
    color: white;
    transition: background-color 0.3s ease, color 0.3s ease;
    /* propiedad duración función-de-tiempo */
}

.boton:hover {
    background-color: darkblue;
}
```

### Animaciones

Para secuencias más complejas:

```css
/* Definición de la animación */
@keyframes deslizar {
    0% {
        transform: translateX(0);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translateX(100px);
        opacity: 0;
    }
}

/* Aplicación de la animación */
.elemento {
    animation: deslizar 2s ease-in-out infinite alternate;
    /* nombre duración función-tiempo iteraciones dirección */
}
```

## Variables CSS

Las variables CSS (propiedades personalizadas) permiten reutilizar valores:

```css
/* Definición global */
:root {
    --color-primario: #3498db;
    --color-secundario: #2ecc71;
    --espaciado-base: 16px;
    --fuente-principal: 'Arial', sans-serif;
}

/* Uso de variables */
.boton {
    background-color: var(--color-primario);
    padding: var(--espaciado-base);
    font-family: var(--fuente-principal);
}

.boton-secundario {
    background-color: var(--color-secundario);
}

/* Variables con respaldo en caso de no soportarse */
.elemento {
    color: var(--color-texto, black);
}

/* Variables en media queries */
@media (max-width: 768px) {
    :root {
        --espaciado-base: 12px; /* Menor espaciado en móviles */
    }
}
```

## Buenas prácticas

1. **Organización y metodologías**:
   - **BEM** (Block Element Modifier):
     ```css
     .bloque {}
     .bloque__elemento {}
     .bloque--modificador {}
     ```
   - **SMACSS** (Scalable and Modular Architecture for CSS)
   - **ITCSS** (Inverted Triangle CSS)

2. **Usa selectores eficientes**:
   - Evita selectores demasiado anidados
   - Prioriza clases sobre IDs o selectores de elementos

3. **Reutilización y modularidad**:
   - Crea componentes reutilizables
   - Usa variables CSS para valores recurrentes

4. **Mobile-first**:
   - Diseña primero para móviles y luego adapta para pantallas más grandes

5. **Herramientas modernas**:
   - Considera usar preprocesadores como Sass o Less
   - Utiliza herramientas de linting para mantener consistencia

6. **Optimización**:
   - Minimiza tu CSS para producción
   - Considera el uso de CSS crítico para mejorar el rendimiento

## Recursos adicionales

- [MDN Web Docs - CSS](https://developer.mozilla.org/es/docs/Web/CSS)
- [CSS-Tricks](https://css-tricks.com/) - Guías y técnicas avanzadas
- [Flexbox Froggy](https://flexboxfroggy.com/) - Juego para aprender Flexbox
- [Grid Garden](https://cssgridgarden.com/) - Juego para aprender Grid
- [Can I use](https://caniuse.com/) - Compatibilidad de funciones CSS entre navegadores 