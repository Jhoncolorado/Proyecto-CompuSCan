# Manual de Referencia JavaScript

## Índice
1. [Introducción a JavaScript](#introducción-a-javascript)
2. [Conceptos básicos](#conceptos-básicos)
3. [Funciones](#funciones)
4. [Objetos y arrays](#objetos-y-arrays)
5. [Manipulación del DOM](#manipulación-del-dom)
6. [Eventos](#eventos)
7. [Programación asíncrona](#programación-asíncrona)
8. [Módulos](#módulos)
9. [Buenas prácticas](#buenas-prácticas)
10. [Recursos adicionales](#recursos-adicionales)

## Introducción a JavaScript

JavaScript es un lenguaje de programación interpretado, orientado a objetos, basado en prototipos y con funciones de primera clase. Es principalmente conocido como el lenguaje de programación para páginas web, pero también se usa en muchos entornos fuera del navegador.

### Formas de incluir JavaScript

1. **JavaScript interno** (dentro del documento HTML):
```html
<script>
    alert('Hola mundo');
</script>
```

2. **JavaScript externo** (en un archivo separado):
```html
<script src="script.js"></script>
```

3. **Atributos de evento** (no recomendado, mejor usar addEventListener):
```html
<button onclick="alert('Hola')">Haz clic</button>
```

## Conceptos básicos

### Variables y tipos de datos

JavaScript tiene tipado dinámico, lo que significa que una variable puede cambiar de tipo:

```javascript
// Declaración de variables
let nombre = 'Juan'; // Variable que puede cambiar (recomendado)
const PI = 3.14159; // Constante (no puede cambiar)
var edad = 30; // Antigua forma de declarar variables (evitar usar)

// Tipos de datos primitivos
let texto = 'Hola'; // String (cadena de texto)
let numero = 42; // Number (número)
let esVerdadero = true; // Boolean (booleano)
let noDefinido = undefined; // Undefined (indefinido)
let nulo = null; // Null (nulo)
let simbolo = Symbol('descripción'); // Symbol (símbolo)
let numeroGrande = 9007199254740991n; // BigInt (para números muy grandes)

// Verificar tipo de una variable
console.log(typeof texto); // "string"
```

### Operadores

```javascript
// Operadores aritméticos
let suma = 5 + 3; // 8
let resta = 5 - 3; // 2
let multiplicacion = 5 * 3; // 15
let division = 5 / 3; // 1.6666...
let modulo = 5 % 3; // 2 (resto de la división)
let exponente = 5 ** 3; // 125 (5 elevado a 3)

// Incremento y decremento
let contador = 0;
contador++; // Incremento (contador = 1)
contador--; // Decremento (contador = 0)

// Operadores de asignación
let x = 10;
x += 5; // x = x + 5 (x = 15)
x -= 3; // x = x - 3 (x = 12)
x *= 2; // x = x * 2 (x = 24)
x /= 4; // x = x / 4 (x = 6)

// Operadores de comparación
let igual = 5 == '5'; // true (compara valor, ignora tipo)
let estrictamenteIgual = 5 === '5'; // false (compara valor y tipo)
let noIgual = 5 != '5'; // false
let estrictamenteNoIgual = 5 !== '5'; // true
let mayor = 5 > 3; // true
let menor = 5 < 10; // true
let mayorIgual = 5 >= 5; // true
let menorIgual = 5 <= 4; // false

// Operadores lógicos
let and = true && false; // false (ambos deben ser true)
let or = true || false; // true (al menos uno debe ser true)
let not = !true; // false (invierte el valor)

// Operador ternario
let resultado = edad >= 18 ? 'Mayor de edad' : 'Menor de edad';
```

### Estructuras de control

```javascript
// Condicionales
if (edad >= 18) {
    console.log('Mayor de edad');
} else if (edad >= 13) {
    console.log('Adolescente');
} else {
    console.log('Niño');
}

// Switch
switch (dia) {
    case 1:
        console.log('Lunes');
        break;
    case 2:
        console.log('Martes');
        break;
    // ...
    default:
        console.log('Día no válido');
}

// Bucle for
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}

// Bucle while
let contador = 0;
while (contador < 5) {
    console.log(contador); // 0, 1, 2, 3, 4
    contador++;
}

// Bucle do-while (se ejecuta al menos una vez)
let n = 0;
do {
    console.log(n); // 0
    n++;
} while (n < 0);

// Bucle for...of (para iterar sobre arrays)
const frutas = ['manzana', 'naranja', 'plátano'];
for (const fruta of frutas) {
    console.log(fruta); // "manzana", "naranja", "plátano"
}

// Bucle for...in (para iterar sobre propiedades de objetos)
const persona = { nombre: 'Ana', edad: 25 };
for (const propiedad in persona) {
    console.log(`${propiedad}: ${persona[propiedad]}`); // "nombre: Ana", "edad: 25"
}
```

## Funciones

Las funciones son bloques de código reutilizables:

```javascript
// Declaración de función tradicional
function saludar(nombre) {
    return `Hola, ${nombre}!`;
}

// Expresión de función
const despedir = function(nombre) {
    return `Adiós, ${nombre}!`;
};

// Función flecha (arrow function)
const multiplicar = (a, b) => a * b;

// Función con múltiples líneas
const calcularArea = (ancho, alto) => {
    const area = ancho * alto;
    return area;
};

// Parámetros por defecto
function configurar(opciones = { color: 'rojo', tamaño: 'medio' }) {
    console.log(opciones);
}

// Parámetros rest (recopilar argumentos restantes)
function sumar(...numeros) {
    return numeros.reduce((total, num) => total + num, 0);
}
console.log(sumar(1, 2, 3, 4)); // 10

// Inmediatamente Invoked Function Expression (IIFE)
(function() {
    console.log('Esta función se ejecuta inmediatamente');
})();
```

### Scope y closures

```javascript
// Scope (ámbito) de variables
let global = 'Soy global';

function ejemplo() {
    let local = 'Soy local';
    console.log(global); // "Soy global" (accesible)
    console.log(local); // "Soy local" (accesible)
}

console.log(global); // "Soy global" (accesible)
console.log(local); // Error: local is not defined (no accesible)

// Closure (una función que recuerda el ámbito en el que fue creada)
function crearContador() {
    let contador = 0;
    
    return function() {
        contador++;
        return contador;
    };
}

const miContador = crearContador();
console.log(miContador()); // 1
console.log(miContador()); // 2
```

## Objetos y arrays

### Objetos

Los objetos son colecciones de pares clave-valor:

```javascript
// Creación de objetos
const persona = {
    nombre: 'Juan',
    edad: 30,
    profesion: 'desarrollador',
    saludar: function() {
        return `Hola, soy ${this.nombre}`;
    }
};

// Acceder a propiedades
console.log(persona.nombre); // "Juan"
console.log(persona['edad']); // 30

// Añadir o modificar propiedades
persona.apellido = 'García';
persona.edad = 31;

// Eliminar propiedades
delete persona.profesion;

// Comprobar si una propiedad existe
console.log('nombre' in persona); // true

// Métodos de objeto con sintaxis moderna
const coche = {
    marca: 'Toyota',
    modelo: 'Corolla',
    arrancar() {
        console.log('El coche arrancó');
    },
    detener() {
        console.log('El coche se detuvo');
    }
};

// Desestructuración de objetos
const { nombre, edad } = persona;
console.log(nombre); // "Juan"

// Spread operator con objetos
const personaCompleta = { ...persona, apellido: 'García', ciudad: 'Madrid' };

// Object.keys(), Object.values(), Object.entries()
console.log(Object.keys(persona)); // ["nombre", "edad", "saludar", "apellido"]
console.log(Object.values(persona)); // ["Juan", 31, f, "García"]
console.log(Object.entries(persona)); // [["nombre", "Juan"], ["edad", 31], ...]
```

### Arrays

Los arrays son colecciones ordenadas de elementos:

```javascript
// Creación de arrays
const numeros = [1, 2, 3, 4, 5];
const mixto = [1, 'dos', true, { prop: 'valor' }, [6, 7]];
const nuevo = new Array(3); // Array de 3 elementos vacíos

// Acceder a elementos
console.log(numeros[0]); // 1
console.log(numeros[numeros.length - 1]); // 5

// Añadir y eliminar elementos
numeros.push(6); // Añade al final: [1, 2, 3, 4, 5, 6]
numeros.unshift(0); // Añade al inicio: [0, 1, 2, 3, 4, 5, 6]
numeros.pop(); // Elimina del final: [0, 1, 2, 3, 4, 5]
numeros.shift(); // Elimina del inicio: [1, 2, 3, 4, 5]

// Encontrar elementos
console.log(numeros.indexOf(3)); // 2 (posición del elemento 3)
console.log(numeros.includes(10)); // false (el 10 no está en el array)

// Métodos de transformación
const dobles = numeros.map(n => n * 2); // [2, 4, 6, 8, 10]
const pares = numeros.filter(n => n % 2 === 0); // [2, 4]
const suma = numeros.reduce((total, n) => total + n, 0); // 15
numeros.forEach(n => console.log(n)); // Imprime cada número

// Ordenación
numeros.sort((a, b) => a - b); // Ordena números de menor a mayor
numeros.reverse(); // Invierte el orden

// Desestructuración de arrays
const [primero, segundo, ...resto] = numeros;
console.log(primero); // 5 (después de reverse)
console.log(resto); // [3, 2, 1]

// Spread operator con arrays
const combinado = [...numeros, ...dobles];

// Métodos modernos
const alMenosTres = numeros.some(n => n >= 3); // true (al menos un elemento cumple)
const todosMayoresAUno = numeros.every(n => n > 1); // false (no todos cumplen)
const primerPar = numeros.find(n => n % 2 === 0); // 2 (primer elemento que cumple)
```

## Manipulación del DOM

El DOM (Document Object Model) es la representación en memoria de un documento HTML:

```javascript
// Selección de elementos
const elemento = document.getElementById('miId'); // Elemento con id="miId"
const parrafos = document.getElementsByTagName('p'); // Colección de todos los <p>
const botones = document.getElementsByClassName('boton'); // Elementos con class="boton"
const primero = document.querySelector('.clase'); // Primer elemento con clase="clase"
const todos = document.querySelectorAll('ul li'); // Lista de todos los <li> dentro de <ul>

// Modificar contenido
elemento.textContent = 'Nuevo texto'; // Solo texto plano
elemento.innerHTML = '<strong>Texto con HTML</strong>'; // Puede incluir HTML

// Modificar atributos
elemento.setAttribute('title', 'Mi título'); // Establece atributo
const titulo = elemento.getAttribute('title'); // Obtiene valor de atributo
elemento.removeAttribute('title'); // Elimina atributo

// Trabajar con clases
elemento.classList.add('activo'); // Añade una clase
elemento.classList.remove('inactivo'); // Elimina una clase
elemento.classList.toggle('visible'); // Añade si no existe, elimina si existe
const tieneClase = elemento.classList.contains('importante'); // Comprueba si existe

// Estilos CSS
elemento.style.color = 'red';
elemento.style.backgroundColor = '#f0f0f0';
elemento.style.fontSize = '18px';

// Crear elementos
const nuevoParrafo = document.createElement('p');
nuevoParrafo.textContent = 'Párrafo creado con JavaScript';

// Añadir elementos al DOM
document.body.appendChild(nuevoParrafo); // Al final del body
elemento.prepend(nuevoParrafo); // Al inicio del elemento
elemento.insertAdjacentElement('beforebegin', nuevoParrafo); // Antes del elemento

// Eliminar elementos
elemento.remove(); // Elimina el elemento
elemento.removeChild(nuevoParrafo); // Elimina un hijo específico

// Recorrer el DOM
const padre = elemento.parentNode; // Nodo padre
const siguienteHermano = elemento.nextSibling; // Hermano siguiente
const hijos = elemento.children; // Hijos elementos
```

## Eventos

Los eventos permiten responder a acciones del usuario:

```javascript
// Método recomendado
const boton = document.getElementById('miBoton');

// Añadir evento
boton.addEventListener('click', function(event) {
    console.log('Botón clicado');
    console.log(event); // Objeto del evento
    event.preventDefault(); // Prevenir comportamiento por defecto
    event.stopPropagation(); // Detener propagación del evento
});

// Eliminar evento
function manejador() {
    console.log('Evento activado');
}
boton.addEventListener('click', manejador);
boton.removeEventListener('click', manejador);

// Eventos comunes
document.addEventListener('DOMContentLoaded', () => console.log('DOM listo'));
window.addEventListener('load', () => console.log('Página cargada'));
boton.addEventListener('mouseover', () => console.log('Ratón encima'));
boton.addEventListener('mouseout', () => console.log('Ratón fuera'));
input.addEventListener('input', (e) => console.log(e.target.value));
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Formulario enviado');
});

// Delegación de eventos (más eficiente)
document.getElementById('lista').addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        console.log(`Clic en: ${e.target.textContent}`);
    }
});
```

## Programación asíncrona

JavaScript es de naturaleza asíncrona, lo que permite ejecutar código sin bloquear el hilo principal:

### Callbacks

```javascript
// Función con callback
function obtenerDatos(callback) {
    setTimeout(() => {
        const datos = { nombre: 'Ana', edad: 25 };
        callback(datos);
    }, 1000);
}

obtenerDatos(datos => {
    console.log(datos); // { nombre: 'Ana', edad: 25 }
});
```

### Promesas

```javascript
// Crear una promesa
function obtenerDatos() {
    return new Promise((resolve, reject) => {
        const exito = true;
        
        setTimeout(() => {
            if (exito) {
                resolve({ id: 1, nombre: 'Producto' });
            } else {
                reject(new Error('No se pudieron obtener los datos'));
            }
        }, 1000);
    });
}

// Consumir una promesa
obtenerDatos()
    .then(datos => {
        console.log(datos);
        return datos.id;
    })
    .then(id => {
        console.log(`El ID es: ${id}`);
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        console.log('Proceso completado');
    });

// Métodos de Promesas
Promise.all([promesa1, promesa2]) // Espera a que todas se resuelvan
    .then(resultados => console.log(resultados));

Promise.race([promesa1, promesa2]) // Se resuelve cuando la primera se resuelve
    .then(resultado => console.log(resultado));

Promise.allSettled([promesa1, promesa2]) // Espera a que todas terminen
    .then(resultados => console.log(resultados));
```

### Async/Await

```javascript
// Función asíncrona
async function obtenerUsuario(id) {
    try {
        const respuesta = await fetch(`https://api.example.com/usuarios/${id}`);
        
        if (!respuesta.ok) {
            throw new Error('Error en la petición');
        }
        
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error(error);
        throw error; // Relanzar para manejo externo
    }
}

// Consumir función asíncrona
async function mostrarUsuario() {
    try {
        const usuario = await obtenerUsuario(1);
        console.log(usuario);
    } catch (error) {
        console.error('No se pudo mostrar el usuario:', error);
    }
}

mostrarUsuario();
```

### Fetch API

```javascript
// Petición GET
fetch('https://api.example.com/datos')
    .then(respuesta => respuesta.json())
    .then(datos => console.log(datos))
    .catch(error => console.error(error));

// Petición POST
fetch('https://api.example.com/usuarios', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nombre: 'Carlos',
        email: 'carlos@example.com'
    })
})
.then(respuesta => respuesta.json())
.then(datos => console.log(datos))
.catch(error => console.error(error));

// Con async/await
async function enviarDatos() {
    try {
        const respuesta = await fetch('https://api.example.com/datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: 'Nuevo dato' })
        });
        
        const datos = await respuesta.json();
        console.log(datos);
    } catch (error) {
        console.error(error);
    }
}
```

## Módulos

Los módulos permiten dividir el código en archivos separados:

```javascript
// Archivo: modulo.js
// Exportar individualmente
export const PI = 3.14159;
export function sumar(a, b) {
    return a + b;
}

// Exportar por defecto
export default class Persona {
    constructor(nombre) {
        this.nombre = nombre;
    }
    
    saludar() {
        return `Hola, soy ${this.nombre}`;
    }
}

// Archivo: main.js
// Importar elementos individuales
import { PI, sumar } from './modulo.js';
console.log(PI); // 3.14159
console.log(sumar(2, 3)); // 5

// Importar elemento por defecto
import Persona from './modulo.js';
const persona = new Persona('Ana');
console.log(persona.saludar()); // "Hola, soy Ana"

// Importar todo como un objeto
import * as Modulo from './modulo.js';
console.log(Modulo.PI); // 3.14159
```

## Buenas prácticas

1. **Usa construcciones modernas**:
   - Prefiere `let` y `const` sobre `var`
   - Utiliza funciones flecha para funciones anónimas breves
   - Aprovecha la desestructuración y operador spread

2. **Organiza tu código**:
   - Divide en módulos
   - Sigue el principio de responsabilidad única
   - Implementa patrones de diseño según necesites

3. **Manejo de errores**:
   - Usa bloques try/catch para código propenso a errores
   - Implementa mensajes de error descriptivos
   - Considera el uso de errores personalizados

4. **Programación asíncrona**:
   - Prefiere async/await sobre promesas encadenadas cuando sea posible
   - Evita el "callback hell" anidando funciones

5. **Estilo de código**:
   - Usa un linter como ESLint para mantener la consistencia
   - Sigue una guía de estilo (como la de Airbnb o Google)
   - Comenta el código complejo pero mantén los comentarios actualizados

6. **Rendimiento**:
   - Evita modificar el DOM repetidamente (usa fragmentos)
   - Limita el uso de closures en bucles
   - Usa debouncing para eventos que se disparan frecuentemente

7. **Seguridad**:
   - No confíes en datos de entrada del usuario sin validación
   - Evita usar eval() o innerHTML con contenido no confiable
   - Protege contra ataques XSS y CSRF

## Recursos adicionales

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/) - Tutorial moderno de JavaScript
- [Eloquent JavaScript](https://eloquentjavascript.net/) - Libro gratuito
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS) - Serie de libros sobre JavaScript en profundidad
- [ES6 Features](http://es6-features.org/) - Características de ECMAScript 6 