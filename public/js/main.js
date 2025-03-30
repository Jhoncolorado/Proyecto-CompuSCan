document.addEventListener("DOMContentLoaded", async () => {
    // ========== [1. CONFIGURACIÓN INICIAL] ==========
    const bcrypt = window.dcodeIO?.bcrypt;
    const saltRounds = 10;

    // Verificar si hay una sesión activa
    const checkSession = () => {
        const user = localStorage.getItem('user');
        if (user) {
            document.body.classList.add('logged-in');
            return true;
        }
        document.body.classList.remove('logged-in');
        return false;
    };

    // Proteger secciones
    const protectSections = () => {
        document.querySelectorAll('#registros, #equipos').forEach(section => {
            section.classList.add('protected-section');
        });
    };

    // Inicializar protección
    protectSections();
    checkSession();

    // ========== [2. LISTA COMPLETA DE PROGRAMAS SENA] ==========
    const programasSENA = [
        "ADSO",
        "ENFERMERIA",
        "REGENCIA DE FARMACIA",
        "TALENTO HUMANO",
        "GESTION DOCUMENTAL",
        "GESTION ADMINISTRATIVA",
        "GESTION ADMISTRATIVA SECTOR SALUD",
        "DESARROLLO DE MEDIOS GRAFICOS",
        "DESARROLLO DE VIDEO JUEGOS",
        "ACTIVIDAD FISICA",
        "OPERACIONES COMERCIALES",
        "GESTION LOGISTICA",
        "PELUQUERIA",
        "COSMETOLOGIA Y ESTETICA INTEGRAL",
        "COCINA",
        "SERVICIO RESTAURANTE Y BAR",
        "COORDINACIÓN DE SERVICIOS HOTELEROS",
        "CUIDADO ESTETICO DE MANOS Y PIES",
        "ANALISIS DE DATOS",
        "ANIMACION DIGITAL",
        "BPO",
        "ASISTENCIA EN ORGANIZACIÓN DE ARCHIVOS",
        "ANIMACION 3D",
        "CONTABILIZACION DE OPERACIONES COMERCIALES Y FINANCIERAS",
        "GUIANZA TURISTICA",
        "DESARROLLO PUBLICITARIO",
        "SERVICIO DE RECEPCIÓN HOTELERA",
        "SEGURIDAD DIGITAL",
        "ATENCIÓN A LA PRIMERA INFANCIA",
        "SERVICIOS Y OPERACIONES MICROFINANCIERAS",
        "RECREACIÓN",
        "GESTIÓN CONTABLE",
        "SERVICIOS FARMACEUTICOS",
        "OTROS"
    ];

    // ========== [3. TOGGLE PASSWORD] ==========
    document.querySelectorAll('.toggle-password')?.forEach(icon => {
        icon?.addEventListener('click', () => {
            const input = icon.previousElementSibling;
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });

    // ========== [4. NAVEGACIÓN INTELIGENTE] ==========
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function showSection(sectionId) {
        const isLoggedIn = checkSession();
        
        // Si la sección es protegida y el usuario no está logueado, redirigir al inicio
        if ((sectionId === 'registros' || sectionId === 'equipos') && !isLoggedIn) {
            mostrarNotificacion('❌ Debes iniciar sesión para acceder a esta sección', 'error');
            sectionId = 'inicio';
        }

        // Ocultar todas las secciones primero
        sections.forEach(section => {
            section.style.opacity = '0';
            setTimeout(() => {
                section.classList.remove('active');
                section.style.display = 'none';
            }, 300);
        });

        // Mostrar la sección seleccionada con transición
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            setTimeout(() => {
                targetSection.style.display = 'block';
                targetSection.classList.add('active');
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                }, 50);
            }, 300);
        }

        // Actualizar enlaces de navegación
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Manejar la visibilidad del contenido según el estado de login
        const loginSection = document.getElementById('login-section');
        const mainContent = document.getElementById('main-content');
        
        if (sectionId === 'inicio') {
            if (isLoggedIn) {
                loginSection.style.display = 'none';
                mainContent.style.display = 'block';
                setTimeout(() => mainContent.classList.add('visible'), 50);
            } else {
                mainContent.classList.remove('visible');
                setTimeout(() => {
                    mainContent.style.display = 'none';
                    loginSection.style.display = 'block';
                }, 300);
            }
        } else {
            loginSection.style.display = 'none';
            mainContent.style.display = 'none';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
            window.location.hash = sectionId;
        });
    });

    // ========== [5. MENÚ RESPONSIVE] ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => navMenu.classList.remove('show'));

    // ========== [6. NOTIFICACIONES CONTEXTUALES] ==========
    function mostrarNotificacion(mensaje, tipo = 'success') {
        // Mapeo de tipos a colores de Bootstrap
        const tipoClase = {
            'success': 'bg-success',
            'error': 'bg-danger',
            'warning': 'bg-warning',
            'info': 'bg-info',
            'danger': 'bg-danger'
        };

        // Crear el contenedor de notificaciones si no existe
        let notificacionesContainer = document.getElementById('notificaciones');
        if (!notificacionesContainer) {
            notificacionesContainer = document.createElement('div');
            notificacionesContainer.id = 'notificaciones';
            notificacionesContainer.className = 'position-fixed top-0 end-0 p-3';
            notificacionesContainer.style.zIndex = '1050';
            document.body.appendChild(notificacionesContainer);
        }

        // Crear la notificación
        const toast = document.createElement('div');
        toast.className = `toast ${tipoClase[tipo] || 'bg-primary'} text-white`;
        toast.role = 'alert';
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        // Contenido del toast con estilo mejorado
        toast.innerHTML = `
            <div class="toast-header ${tipoClase[tipo] || 'bg-primary'} text-white">
                <strong class="me-auto">CompuScan</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${mensaje}
            </div>
        `;

        // Agregar la notificación al contenedor
        notificacionesContainer.appendChild(toast);

        // Inicializar y mostrar el toast
        const bsToast = new bootstrap.Toast(toast, {
            animation: true,
            autohide: true,
            delay: 3000
        });
        bsToast.show();

        // Eliminar el toast del DOM después de ocultarse
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // ========== [7. SISTEMA DE IA CON REINTENTOS] ==========
    let net;
    let iaCargada = false;
    
    async function cargarModeloIA() {
        try {
            mostrarNotificacion('🔃 Inicializando motor de IA...', 'info');
            net = await mobilenet.load();
            iaCargada = true;
            mostrarNotificacion('✅ IA lista para validar equipos', 'success');
        } catch (error) {
            mostrarNotificacion('❌ Error al cargar modelo de IA', 'error');
            console.error("Error IA:", error);
            iaCargada = false;
        }
    }

    // ========== [8. GESTIÓN DE CONTRASEÑAS] ==========
    async function hashPassword(password) {
        return await bcrypt.hash(password, saltRounds);
    }

    async function validarContraseña(form) {
        const password = form.querySelector('input[name="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirm_password"]').value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test(password)) {
            mostrarNotificacion('❌ La contraseña debe tener 8+ caracteres con mayúscula, minúscula, número y especial', 'error');
            return false;
        }
        if (password !== confirmPassword) {
            mostrarNotificacion('❌ Las contraseñas no coinciden', 'error');
            return false;
        }
        return true;
    }

    // ========== [9. CAMPOS DINÁMICOS USUARIOS] ==========
    const selectorRol = document.getElementById('selector-rol');
    if (selectorRol) {
        selectorRol.addEventListener('change', function() {
            const rol = this.value;
            const camposEspecificos = document.getElementById('campos-especificos');
            if (!camposEspecificos) return;
            
            camposEspecificos.innerHTML = '';
            
            const campos = {
                aprendiz: `
                    <div class="form-group">
                        <label>RH:</label>
                        <input type="text" name="rh" placeholder="Ej: A+" pattern="(A|B|AB|O)[+-]" required>
                    </div>
                    <div class="form-group">
                        <label>Número Ficha:</label>
                        <input type="text" name="ficha" pattern="\\d{5,7}" placeholder="Ej: 2825019" required>
                    </div>
                    <div class="form-group">
                        <label>Programa:</label>
                        <select name="programa" required>
                            <option value="">Seleccione...</option>
                            ${programasSENA.map(p => `<option>${p}</option>`).join('')}
                        </select>
                    </div>
                    <!-- Nuevos Campos Agregados -->
                    <div class="form-group">
                        <label>Jornada:</label>
                        <select name="jornada" required>
                            <option value="">Seleccione...</option>
                            <option value="Diurna">Diurna</option>
                            <option value="Mixta">Mixta</option>
                            <option value="Nocturna">Nocturna</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nivel Formativo:</label>
                        <select name="nivel_formativo" required>
                            <option value="">Seleccione...</option>
                            <option value="Técnico">Técnico</option>
                            <option value="Tecnólogo">Tecnólogo</option>
                            <option value="Especialización Técnica">Especialización Técnica</option>
                            <option value="Curso Corto">Curso Corto</option>
                        </select>
                    </div>
                    <!-- Fin de Nuevos Campos -->
                    <div class="form-group">
                        <label>Observaciones:</label>
                        <textarea name="observaciones" placeholder="Escribe observaciones adicionales..."></textarea>
                    </div>`,
                instructor: `
                    <div class="form-group">
                        <label>Observaciones:</label>
                        <textarea name="observaciones" placeholder="Escribe observaciones adicionales..."></textarea>
                    </div>`,
                administrativo: `
                    <div class="form-group">
                        <label>Observaciones:</label>
                        <textarea name="observaciones" placeholder="Escribe observaciones adicionales..."></textarea>
                    </div>`
            };

            if (campos[rol]) camposEspecificos.innerHTML = campos[rol];
            
            if (rol === 'aprendiz') {
                const rhInput = camposEspecificos.querySelector('input[name="rh"]');
                if (rhInput) {
                    rhInput.addEventListener('input', function() {
                        const rhValue = this.value;
                        const rhPattern = /^(A|B|AB|O)[+-]$/;
                        
                        if (!rhPattern.test(rhValue) && rhValue !== '') {
                            this.setCustomValidity('Formato incorrecto. Use A+, B-, AB+, O-, etc.');
                            this.classList.add('invalid-input');
                        } else {
                            this.setCustomValidity('');
                            this.classList.remove('invalid-input');
                        }
                    });
                }
            }
        });
    }

    // ========== [10. VALIDACIÓN GLOBAL RH] ==========
    document.addEventListener('input', function(e) {
        if (e.target.name === 'rh') {
            const rhValue = e.target.value;
            const rhPattern = /^(A|B|AB|O)[+-]$/;
            
            if (!rhPattern.test(rhValue) && rhValue !== '') {
                e.target.setCustomValidity('Formato incorrecto. Use A+, B-, AB+, O-, etc.');
                e.target.classList.add('invalid-input');
            } else {
                e.target.setCustomValidity('');
                e.target.classList.remove('invalid-input');
            }
        }
    });

    // ========== [11. CAMPOS DINÁMICOS EQUIPOS] ==========
    const tipoDispositivo = document.getElementById('tipo-dispositivo');
    if (tipoDispositivo) {
        tipoDispositivo.addEventListener('change', function() {
            const tipo = this.value;
            const camposEspecificos = document.getElementById('campos-especificos-equipo');
            if (!camposEspecificos) return;
            
            camposEspecificos.innerHTML = '';
            
            const campos = {
                camera: `
                    <div class="form-group">
                        <label>Resolución:</label>
                        <input type="text" name="resolucion" placeholder="Ej: 24MP" required>
                    </div>
                    <div class="form-group">
                        <label>Tipo de Lente:</label>
                        <input type="text" name="lente" placeholder="Ej: Zoom 18-55mm" required>
                    </div>`,
                tablet: `
                    <div class="form-group">
                        <label>Pantalla:</label>
                        <input type="text" name="pantalla" placeholder="Ej: 10.1''" required>
                    </div>
                    <div class="form-group">
                        <label>Almacenamiento:</label>
                        <input type="text" name="almacenamiento" placeholder="Ej: 128GB" required>
                    </div>`,
                laptop: `
                    <div class="form-group">
                        <label>Procesador:</label>
                        <input type="text" name="procesador" placeholder="Ej: Intel i7" required>
                    </div>
                    <div class="form-group">
                        <label>Cargador:</label>
                        <select name="cargador" required>
                            <option value="">Seleccione...</option>
                            <option value="Incluido">Incluido</option>
                            <option value="No incluido">No incluido</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Mouse:</label>
                        <select name="mouse" required>
                            <option value="">Seleccione...</option>
                            <option value="Incluido">Incluido</option>
                            <option value="No incluido">No incluido</option>
                        </select>
                    </div>`,
                monitor: `
                    <div class="form-group">
                        <label>Tamaño:</label>
                        <input type="text" name="tamano" placeholder="Ej: 24 pulgadas" required>
                    </div>
                    <div class="form-group">
                        <label>Resolución:</label>
                        <input type="text" name="resolucion" placeholder="Ej: 1920x1080" required>
                    </div>`
            };
        
            if (campos[tipo]) camposEspecificos.innerHTML = campos[tipo];
        });
    }

    // ========== [12. GESTIÓN DE FORMULARIOS] ==========
    // Formulario de Usuario
    const formUsuario = document.getElementById('form-usuario');
    if (formUsuario) {
        const rolSelect = document.getElementById('rol');
        const fichaGroup = document.querySelector('.form-group:has(#ficha)');
        
        if (rolSelect) {
            rolSelect.addEventListener('change', function() {
                if (!fichaGroup) return;
                
                if (this.value === 'aprendiz') {
                    fichaGroup.style.display = 'block';
                    const fichaInput = document.getElementById('ficha');
                    if (fichaInput) fichaInput.required = true;
                } else {
                    fichaGroup.style.display = 'none';
                    const fichaInput = document.getElementById('ficha');
                    if (fichaInput) {
                        fichaInput.required = false;
                        fichaInput.value = '';
                    }
                }
            });
        }

        formUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(formUsuario);
                
                // Construir el nombre completo
                const nombreCompleto = `${formData.get('nombre')} ${formData.get('apellidos')}`.trim();
                
                const userData = {
                    nombre: nombreCompleto,
                    correo: formData.get('email'),
                    documento: formData.get('documento'),
                    tipo_documento: formData.get('tipo_documento'),
                    contrasena: formData.get('password'),
                    rol: formData.get('rol'),
                    rh: formData.get('rh') || null,
                    ficha: formData.get('ficha') || null,
                    observacion: formData.get('observaciones') || null,
                    telefono1: formData.get('telefono1') || null,
                    telefono2: formData.get('telefono2') || null,
                    foto: null
                };

                // Validaciones adicionales
                if (userData.rol === 'aprendiz' && !userData.ficha) {
                    mostrarNotificacion('❌ El número de ficha es requerido para aprendices', 'danger');
                    return;
                }

                // Verificar que window.api existe
                if (!window.api || !window.api.registrarUsuario) {
                    mostrarNotificacion('❌ Error: API no disponible', 'danger');
                    console.error('API no está disponible');
                    return;
                }

                // Mostrar notificación de carga
                mostrarNotificacion('🔄 Registrando usuario...', 'info');

                console.log('Enviando datos de usuario:', {
                    ...userData,
                    contrasena: '[PROTECTED]'
                });

                // Enviar al backend
                const response = await window.api.registrarUsuario(userData);
                
                if (response.error) {
                    mostrarNotificacion(`❌ Error: ${response.error}`, 'danger');
                    console.error('Error del servidor:', response.error);
                    return;
                }

                // Mostrar notificación de éxito
                mostrarNotificacion('✅ Usuario registrado exitosamente', 'success');
                
                // Limpiar el formulario
                formUsuario.reset();

            } catch (error) {
                console.error('Error completo:', error);
                mostrarNotificacion(`❌ Error: ${error.message || 'Error al registrar usuario'}`, 'danger');
            }
        });
    }

    // Función para validar el formato del documento según su tipo
    function validarDocumento(documento, tipo) {
        const validaciones = {
            'CC': /^\d{8,10}$/,  // 8-10 dígitos
            'TI': /^\d{10,11}$/, // 10-11 dígitos
            'CE': /^[A-Z0-9]{6,12}$/, // 6-12 caracteres alfanuméricos
            'PAS': /^[A-Z0-9]{6,12}$/ // 6-12 caracteres alfanuméricos
        };

        return validaciones[tipo].test(documento);
    }

    // Función para comprimir imagen
    async function comprimirImagen(base64Str) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 600;
                
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Comprimir a JPEG con calidad 0.7
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = base64Str;
        });
    }

    // Formulario de Equipo
    const formEquipo = document.getElementById('form-equipo');
    if (formEquipo) {
        formEquipo.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                // Obtener los campos del formulario
                const formData = new FormData(formEquipo);
                const tipo = formData.get('tipo-dispositivo');
                const marca = formData.get('marca');
                const modelo = formData.get('modelo');
                const serial = formData.get('serial');
                const procesador = formData.get('procesador');
                const cargador = formData.get('cargador');
                const mouse = formData.get('mouse');

                // Validaciones del lado del cliente
                const errores = [];
                
                if (!tipo || !['laptop', 'tablet', 'camera', 'monitor'].includes(tipo.toLowerCase())) {
                    errores.push('Tipo de dispositivo inválido');
                }

                if (!marca || marca.length < 2 || !/^[a-zA-Z0-9\s-]+$/.test(marca)) {
                    errores.push('Marca inválida. Debe tener al menos 2 caracteres y solo letras, números y guiones');
                }

                if (!modelo || modelo.length < 2 || !/^[a-zA-Z0-9\s-]+$/.test(modelo)) {
                    errores.push('Modelo inválido. Debe tener al menos 2 caracteres y solo letras, números y guiones');
                }

                if (!serial || serial.length < 5 || !/\d/.test(serial)) {
                    errores.push('Serial inválido. Debe tener al menos 5 caracteres y contener números');
                }

                if (errores.length > 0) {
                    mostrarNotificacion(`❌ ${errores.join(', ')}`, 'danger');
                    return;
                }

                // Validación de imágenes
                const iaUpload = document.getElementById('ia-upload');
                if (!iaUpload || !iaUpload.files || iaUpload.files.length === 0) {
                    mostrarNotificacion('❌ Debes seleccionar las fotos del dispositivo', 'danger');
                    return;
                }

                if (iaUpload.files.length !== 3) {
                    mostrarNotificacion('❌ Debes seleccionar exactamente 3 fotos', 'danger');
                    return;
                }

                // Procesar y comprimir imágenes
                const fotosBase64 = [];
                for (let i = 0; i < iaUpload.files.length; i++) {
                    const file = iaUpload.files[i];
                    
                    // Verificar formato
                    if (!file.type.startsWith('image/')) {
                        mostrarNotificacion(`❌ El archivo ${i + 1} no es una imagen válida`, 'danger');
                        return;
                    }

                    // Convertir a base64
                    const base64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    });

                    // Comprimir imagen
                    const imagenComprimida = await comprimirImagen(base64);
                    fotosBase64.push(imagenComprimida);

                    // Verificar tamaño
                    const sizeInMB = (imagenComprimida.length * 3/4) / (1024*1024);
                    if (sizeInMB > 5) {
                        mostrarNotificacion(`❌ La foto ${i + 1} excede el tamaño máximo permitido de 5MB`, 'danger');
                        return;
                    }
                }

                // Preparar datos para enviar
                const dispositivoData = {
                    tipo: tipo.toLowerCase(),
                    marca,
                    modelo,
                    serial,
                    procesador: procesador || null,
                    cargador: cargador || 'No',
                    mouse: mouse || 'No',
                    fotos: fotosBase64
                };

                console.log('Enviando datos del dispositivo:', {
                    ...dispositivoData,
                    fotos: `${dispositivoData.fotos.length} fotos procesadas`
                });

                // Verificar que window.api existe
                if (!window.api || !window.api.registrarDispositivo) {
                    mostrarNotificacion('❌ Error: API no disponible', 'danger');
                    console.error('API no está disponible');
                    return;
                }

                // Mostrar notificación de carga
                mostrarNotificacion('🔄 Registrando dispositivo...', 'info');

                // Enviar al backend usando la API
                const response = await window.api.registrarDispositivo(dispositivoData);
                
                if (response.error) {
                    mostrarNotificacion(`❌ Error: ${response.error}`, 'danger');
                    console.error('Error del servidor:', response.error);
                    return;
                }

                // Mostrar notificación de éxito
                mostrarNotificacion('✅ Dispositivo registrado exitosamente', 'success');
                
                // Limpiar el formulario
                formEquipo.reset();
                
                // Limpiar las previsualizaciones de imágenes
                document.querySelectorAll('.preview-image').forEach(img => {
                    img.src = '';
                    img.classList.add('d-none');
                });

            } catch (error) {
                console.error('Error:', error);
                mostrarNotificacion(`❌ Error: ${error.message || 'Error al registrar dispositivo'}`, 'danger');
            }
        });
    }

    // Formulario de Contacto
    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(formContacto);
                const contactoData = Object.fromEntries(formData.entries());

                // Aquí podrías agregar una llamada a la API para manejar mensajes de contacto
                // Por ahora solo mostraremos una notificación
                mostrarNotificacion('✅ Mensaje enviado exitosamente', 'success');
                formContacto.reset();
            } catch (error) {
                console.error('Error:', error);
                mostrarNotificacion('❌ Error al enviar mensaje', 'error');
            }
        });
    }

    // ========== [13. VALIDACIÓN DE IMÁGENES] ==========
    async function validarImagen(imagen) {
        try {
            const predicciones = await net.classify(imagen);
            console.log('Predicciones:', predicciones);
            
            const keywordsEquipo = [
                'computer', 'laptop', 'notebook', 'desktop', 'pc', 'tablet',
                'monitor', 'screen', 'display', 'keyboard', 'mouse', 'printer',
                'scanner', 'webcam', 'camera', 'device', 'electronic',
                'hardware', 'peripheral', 'accessory', 'equipment',
                'router', 'modem', 'network', 'server', 'workstation',
                'machine', 'computer equipment', 'tech', 'technology',
                'computing', 'digital', 'electronic device', 'gadget',
                'computer peripheral', 'input device', 'output device',
                'storage device', 'computer accessory', 'computer component',
                'computer hardware', 'computer part', 'tech device',
                'tech equipment', 'tech accessory', 'tech component',
                'tech hardware', 'tech part', 'electronic equipment',
                'electronic accessory', 'electronic component', 'electronic hardware',
                'electronic part', 'digital device', 'digital equipment',
                'digital accessory', 'digital component', 'digital hardware',
                'digital part'
            ];

            // Verificar si alguna predicción coincide con las palabras clave
            for (const prediccion of predicciones) {
                const clase = prediccion.className.toLowerCase();
                console.log('Analizando clase:', clase, 'con probabilidad:', prediccion.probability);
                
                // Si encuentra una coincidencia con probabilidad mayor a 0.2
                if (keywordsEquipo.some(keyword => clase.includes(keyword)) && prediccion.probability > 0.2) {
                    console.log('Imagen válida encontrada:', clase);
                    return true;
                }
            }

            console.log('Imagen no válida: no se encontraron coincidencias suficientes');
            return false;
        } catch (error) {
            console.error("Error en validación IA:", error);
            mostrarNotificacion('⚠️ Error en análisis de imagen', 'warning');
            return false;
        }
    }

    // ========== [14. INICIALIZACIÓN] ==========
    cargarModeloIA();
    showSection(window.location.hash.substring(1) || 'inicio');

    // ========== [15. MANEJO DE LOGIN] ==========
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(formLogin);
                const loginData = {
                    correo: formData.get('correo'),
                    contrasena: formData.get('contrasena')
                };

                console.log('Intentando iniciar sesión con:', loginData);

                const response = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.usuario));
                    document.body.classList.add('logged-in');
                    mostrarNotificacion('✅ Inicio de sesión exitoso', 'success');
                    formLogin.reset();
                    
                    // Actualizar el contenido principal con animación
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.querySelector('h2').textContent = `Bienvenido ${data.usuario.nombre}`;
                        mainContent.style.display = 'block';
                        setTimeout(() => mainContent.classList.add('visible'), 50);
                    }
                    
                    // Mantener en la sección de inicio
                    showSection('inicio');
                } else {
                    throw new Error(data.error || 'Error al iniciar sesión');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarNotificacion('❌ ' + error.message, 'error');
            }
        });
    }
});