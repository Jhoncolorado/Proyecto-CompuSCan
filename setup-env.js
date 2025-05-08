const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('='.repeat(50));
console.log('Configuración del archivo .env para CompuSCan');
console.log('='.repeat(50));

// Ruta al archivo .env-example
const envExamplePath = path.join(__dirname, '.env-example');
// Ruta al archivo .env que crearemos
const envPath = path.join(__dirname, '.env');

// Verificar si ya existe un archivo .env
if (fs.existsSync(envPath)) {
  console.log('\n⚠️ Ya existe un archivo .env. ¿Deseas sobrescribirlo? (s/n)');
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
      createEnvFile();
    } else {
      console.log('\n❌ Operación cancelada. Se conservará el archivo .env existente.');
      rl.close();
    }
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  // Verificar si existe el archivo .env-example
  if (!fs.existsSync(envExamplePath)) {
    console.log('\n❌ Error: No se encontró el archivo .env-example.');
    console.log('Por favor, asegúrate de que el archivo .env-example existe en la raíz del proyecto.');
    rl.close();
    return;
  }

  // Leer el contenido del archivo .env-example
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Mostrar el contenido y pedir confirmación
  console.log('\nSe creará un archivo .env con el siguiente contenido:');
  console.log('-'.repeat(50));
  console.log(envExampleContent);
  console.log('-'.repeat(50));
  
  console.log('\n¿Deseas modificar algún valor? (s/n)');
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
      modifyEnvContent(envExampleContent);
    } else {
      // Guardar el archivo .env con el mismo contenido que .env-example
      fs.writeFileSync(envPath, envExampleContent);
      console.log('\n✅ Archivo .env creado exitosamente con los valores por defecto.');
      console.log('Puedes editar este archivo manualmente en cualquier momento.');
      rl.close();
    }
  });
}

function modifyEnvContent(content) {
  console.log('\nPor favor, introduce los valores para las siguientes variables:');
  
  // Convertir el contenido en un array de líneas
  const lines = content.split('\n');
  const variables = [];
  
  // Extraer las variables (líneas que contienen un signo =)
  for (const line of lines) {
    if (line.includes('=') && !line.trim().startsWith('#')) {
      const [key, value] = line.split('=');
      variables.push({ key: key.trim(), value: value.trim() });
    }
  }
  
  // Función recursiva para pedir valores uno por uno
  askForValue(0, variables, {});
}

function askForValue(index, variables, newValues) {
  if (index >= variables.length) {
    // Hemos terminado de pedir todos los valores
    createFinalEnvFile(variables, newValues);
    return;
  }
  
  const variable = variables[index];
  console.log(`\n${variable.key} [${variable.value}]:`);
  rl.question('> ', (answer) => {
    // Si el usuario no ingresa nada, conservar el valor por defecto
    if (answer.trim() !== '') {
      newValues[variable.key] = answer.trim();
    }
    // Pasar al siguiente valor
    askForValue(index + 1, variables, newValues);
  });
}

function createFinalEnvFile(variables, newValues) {
  // Leer el contenido del archivo .env-example
  let envContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Reemplazar los valores con los nuevos proporcionados por el usuario
  for (const variable of variables) {
    if (newValues[variable.key]) {
      // Reemplazar el valor en el contenido
      const regex = new RegExp(`${variable.key}=.*`, 'g');
      envContent = envContent.replace(regex, `${variable.key}=${newValues[variable.key]}`);
    }
  }
  
  // Guardar el archivo .env
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Archivo .env creado exitosamente con tus valores personalizados.');
  console.log('Puedes editar este archivo manualmente en cualquier momento.');
  rl.close();
} 