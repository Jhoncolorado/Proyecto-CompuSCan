# Ejemplos Prácticos para CompuSCan

Este documento contiene ejemplos específicos aplicados al proyecto CompuSCan que puedes usar como referencia rápida cuando necesites implementar características similares.

## Índice
1. [Componentes de interfaz](#componentes-de-interfaz)
2. [Manejo de datos](#manejo-de-datos)
3. [Patrones de diseño](#patrones-de-diseño)
4. [Soluciones a problemas comunes](#soluciones-a-problemas-comunes)

## Componentes de interfaz

### Badges para estados (como los usados en el historial)

**HTML:**
```html
<span class="history-badge badge-success">ENTRADA</span>
<span class="history-badge badge-danger">SALIDA</span>
<span class="history-badge badge-default">OTRO</span>
```

**CSS:**
```css
.history-badge {
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  text-align: center;
  min-width: 80px;
}

.badge-success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.badge-danger {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
}

.badge-default {
  background-color: #eceff1;
  color: #455a64;
  border: 1px solid #cfd8dc;
}
```

### Tabla de datos responsiva

**HTML:**
```html
<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th>Fecha y Hora</th>
        <th>Descripción</th>
        <th>Dispositivo</th>
        <th>Serial</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>16/05/2023 14:30</td>
        <td>
          <span class="history-badge badge-success">ENTRADA</span>
          <span>- Acceso autorizado</span>
        </td>
        <td>Scanner A</td>
        <td>SCA-001</td>
      </tr>
      <!-- Más filas aquí -->
    </tbody>
  </table>
</div>
```

**CSS:**
```css
.table-container {
  width: 100%;
  overflow-x: auto;
  background: #fff;
  border-radius: 8px;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.97rem;
  min-width: 800px;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background: #2e7d32;
  color: #fff;
  font-weight: 700;
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table tr:nth-child(even) {
  background: #f8fafc;
}

.data-table tr:hover {
  background: #e3eaf2;
}
```

### Mensaje de "No hay datos"

**HTML:**
```html
<div class="empty-state">
  <div class="empty-icon">
    <i class="fas fa-history"></i>
    <!-- Alternativa con React Icons: <FaHistory /> -->
  </div>
  <h3>No hay registros disponibles</h3>
  <p>Los registros aparecerán aquí cuando estén disponibles.</p>
</div>
```

**CSS:**
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  color: #455a64;
  min-height: 300px;
}

.empty-icon {
  color: #b0bec5;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f5f5f5;
}

.empty-icon svg,
.empty-icon i {
  font-size: 60px;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #37474f;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
  max-width: 500px;
  color: #78909c;
}
```

## Manejo de datos

### Obtener datos de API (ejemplo de historial)

```javascript
const fetchHistorial = async () => {
  try {
    setLoading(true);
    const response = await fetch('http://localhost:3000/api/historiales');
    
    if (!response.ok) {
      throw new Error('Error al cargar el historial');
    }
    
    const data = await response.json();
    setHistorial(data);
    setError(null);
  } catch (error) {
    setError(error.message);
    setHistorial([]);
  } finally {
    setLoading(false);
  }
};
```

### Formatear fechas

```javascript
// Formatear fecha y hora
const formatDateTime = (dateString) => {
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString('es-ES', options);
};

// Ejemplo de uso
<span>{formatDateTime(registro.fecha_hora)}</span>
```

### Procesar texto con formato especial (ejemplo de descripciones)

```javascript
const procesarDescripcion = (descripcion) => {
  const [tipo, ...resto] = descripcion.split(' - ');
  
  return (
    <>
      <span className={`badge ${tipo === 'ENTRADA' ? 'badge-success' : 
                             tipo === 'SALIDA' ? 'badge-danger' : 'badge-default'}`}>
        {tipo}
      </span>
      {resto.length > 0 && <span> - {resto.join(' - ')}</span>}
    </>
  );
};

// Uso en JSX
<td>{procesarDescripcion(registro.descripcion)}</td>
```

## Patrones de diseño

### Componente con estados de carga, error y datos vacíos

```jsx
function DataSection({ title, fetchData, renderItem }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchData]);
  
  return (
    <div className="data-section">
      <h2>{title}</h2>
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Cargando datos...</span>
        </div>
      ) : error ? (
        <div className="error-state">
          <span>{error}</span>
        </div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-info-circle"></i>
          </div>
          <h3>No hay datos disponibles</h3>
          <p>La información aparecerá aquí cuando esté disponible.</p>
        </div>
      ) : (
        <div className="data-content">
          {data.map(item => renderItem(item))}
        </div>
      )}
    </div>
  );
}

// Uso del componente
<DataSection
  title="Historial de Accesos"
  fetchData={() => fetch('/api/historiales').then(res => res.json())}
  renderItem={(registro) => (
    <div key={registro.id} className="registro-item">
      {/* Contenido del registro */}
    </div>
  )}
/>
```

### Layout adaptable (como el usado en CompuSCan)

```jsx
function Layout({ children, fullWidth }) {
  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <Header />
      <div className="main-content" style={{ marginTop: 60 }}>
        <div className="d-flex justify-content-center bg-light">
          <div className="w-100" style={fullWidth ? {} : { maxWidth: 900 }}>
            <div className="bg-white rounded-4 shadow p-4 mb-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Uso con ancho completo o limitado
<Layout fullWidth={true}>
  <DevicesPage />
</Layout>
```

## Soluciones a problemas comunes

### Evitar solapamiento del header con el contenido

```css
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
}

.content-section {
  margin-top: 80px; /* Altura del header + margen extra */
}
```

### Tabla con scroll horizontal en móviles pero sin scroll en desktop

```css
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  
  .data-table {
    min-width: 800px; /* Fuerza el scroll horizontal */
  }
}

@media (min-width: 769px) {
  .table-container {
    overflow-x: visible;
  }
  
  .data-table {
    width: 100%;
    min-width: auto;
  }
}
```

### Mantener el pie de página siempre al final

```css
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

footer {
  margin-top: auto;
}
```

### Botón animado (como el de Cerrar Sesión)

```css
.action-button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

---

Estos ejemplos están basados en el código actual de CompuSCan y pueden adaptarse según las necesidades específicas de cada sección del proyecto. Recuerda mantener la consistencia en el diseño y la funcionalidad para ofrecer una experiencia de usuario cohesiva. 