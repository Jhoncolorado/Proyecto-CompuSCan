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
