const path = require('path');
const fs = require('fs');

// Mostrar el directorio actual
console.log('Directorio actual:', __dirname);

// Ruta completa a la carpeta public
const publicPath = path.join(__dirname, 'public');
console.log('Ruta a public:', publicPath);

// Verificar si la carpeta public existe
const publicExists = fs.existsSync(publicPath);
console.log('¿Existe la carpeta public?', publicExists);

// Ruta completa al archivo index.html
const indexPath = path.join(__dirname, 'public', 'index.html');
console.log('Ruta a index.html:', indexPath);

// Verificar si el archivo index.html existe
const indexExists = fs.existsSync(indexPath);
console.log('¿Existe el archivo index.html?', indexExists);

// Listar todos los archivos en la carpeta public
if (publicExists) {
    console.log('Contenido de la carpeta public:');
    const publicFiles = fs.readdirSync(publicPath);
    publicFiles.forEach(file => {
        console.log('- ' + file);
    });
} 