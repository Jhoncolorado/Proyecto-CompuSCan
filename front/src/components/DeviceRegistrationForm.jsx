const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('[DEBUG] Enviando petición PUT a /api/dispositivos/' + id);
  try {
    const response = await fetch(`http://localhost:3000/api/dispositivos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, serial, foto, mime_type }),
    });
    // ... resto del código ...
  } catch (error) {
    console.error('Error al actualizar dispositivo:', error);
  }
}; 