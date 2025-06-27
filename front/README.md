# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Exportar reportes a Excel

El frontend permite exportar los reportes de Usuarios, Historial y Dispositivos a archivos Excel (.xlsx) directamente desde la interfaz de reportes.

- Se utiliza la librería [xlsx](https://www.npmjs.com/package/xlsx) para transformar los datos obtenidos de la API en un archivo Excel descargable.
- El botón "Exportar a Excel" en cada pestaña ejecuta la función `handleExport`, que:
  1. Obtiene todos los datos de la API correspondiente.
  2. Filtra y transforma los datos para dejar solo los campos relevantes.
  3. Genera y descarga el archivo Excel en el navegador.

**Fragmento de código relevante:**

```jsx
import * as XLSX from 'xlsx';

const handleExport = async () => {
  // ...fetch de datos según la pestaña activa...
  const ws = XLSX.utils.json_to_sheet(filteredData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, activeTab);
  XLSX.writeFile(wb, filename);
};
```

- El backend solo entrega los datos en JSON; toda la lógica de exportación ocurre en el frontend.

## Gestión de Asistencia: Flujo y Conexión

### ¿Cómo funciona la asistencia en CompuSCan?

- **Conexión Frontend-Backend:**  
  El frontend (React) se conecta al backend (Node.js/Express) mediante Axios y JWT. Todas las acciones de asistencia (marcar, justificar, consultar, exportar) se hacen a través de endpoints REST protegidos.

- **Flujo completo:**
  1. El instructor selecciona la ficha y ve la lista de aprendices.
  2. Marca la asistencia de cada aprendiz (presente/ausente) o justifica inasistencias.
  3. El backend valida, registra y actualiza el estado en la base de datos.
  4. El frontend muestra estadísticas y feedback inmediato.
  5. El historial es consultable y exportable a Excel.
  6. El aprendiz puede ver su propio historial y justificar inasistencias.

- **Integración RFID:**  
  El sistema permite registrar asistencia pasando la tarjeta RFID. El backend alterna entre ENTRADA y SALIDA automáticamente.

- **Exportación de reportes:**  
  El frontend transforma los datos obtenidos de la API en archivos Excel descargables, sin lógica especial en el backend.

- **Seguridad:**  
  Todo el flujo está protegido por autenticación JWT y control de roles.  
  Solo usuarios autorizados pueden registrar, justificar o consultar asistencia.

### ¿Por qué es robusto y profesional?
- El flujo es claro, seguro y auditable.
- Cada acción queda registrada y es trazable.
- El sistema es escalable y fácil de mantener.
- La experiencia de usuario es moderna y profesional.

### Referencias de Código
- `front/src/pages/Asistencia.jsx` (pantalla y lógica de asistencia)
- `front/src/pages/history/History.jsx` (historial)
- `front/src/services/api.js` (llamadas a la API)
- `controllers/asistenciaController.js` (backend)
- `models/asistenciaModel.js` (backend)
- `routes/asistenciaRoutes.js` (backend)

## Visualización de Imágenes de Dispositivos

- El frontend espera que el campo `foto` de cada dispositivo sea un **array de strings**.
- Muestra hasta 3 imágenes (frontal, trasera, cerrado) en la tarjeta del equipo, alineadas y con etiquetas.
- Si falta alguna imagen, se muestra un recuadro "Sin imagen".
- Las imágenes se obtienen de la URL:  
  `http://localhost:3000/uploads/<nombre_de_archivo>`
- El sistema es robusto ante formatos antiguos: si solo hay una imagen o el campo es base64, igual se visualiza correctamente.

### ¿Por qué no se veían las imágenes antes?

- El campo `foto` podía llegar como un string base64, un array serializado, o incluso un array dentro de otro array.
- El frontend solo podía mostrar imágenes si recibía un array plano de nombres de archivo.
- Se corrigió el backend para que **siempre entregue un array plano**, sin importar el formato original, garantizando la visualización en todos los puntos de la app.
