document.addEventListener("DOMContentLoaded", async () => {
    // ========== [1. CONFIGURACIÓN INICIAL] ==========
    const bcrypt = window.dcodeIO.bcrypt;
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
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            icon.classList.toggle('fa-eye-slash');
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
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
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
        
        if (loginSection && mainContent) {
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
        } else {
            console.error('Elementos no encontrados: loginSection o mainContent');
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
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion ${tipo}`;
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        setTimeout(() => notificacion.remove(), 3000);
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
    document.getElementById('selector-rol').addEventListener('change', function() {
        const rol = this.value;
        const camposEspecificos = document.getElementById('campos-especificos');
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
    document.getElementById('tipo-dispositivo').addEventListener('change', function() {
        const tipo = this.value;
        const camposEspecificos = document.getElementById('campos-especificos-equipo');
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
                    <input type="text" name="cargador" placeholder="Ej: Incluido, No incluido" required>
                </div>
                <div class="form-group">
                    <label>Mouse:</label>
                    <input type="text" name="mouse" placeholder="Ej: Incluido, No incluido" required>
                </div>`
        };
    
        if (campos[tipo]) camposEspecificos.innerHTML = campos[tipo];
    });

    // ========== [12. GESTIÓN DE FORMULARIOS] ==========
    // Formulario de Usuario
    const formUsuario = document.getElementById('form-usuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!await validarContraseña(formUsuario)) return;

            try {
                const formData = new FormData(formUsuario);
                
                // Construir el nombre completo
                const nombreCompleto = `${formData.get('nombre')} ${formData.get('apellidos')}`.trim();
                
                const userData = {
                    nombre: nombreCompleto,
                    correo: formData.get('email'),
                    documento: formData.get('documento'),
                    tipo_documento: 'CC',
                    contrasena: formData.get('password'),
                    rol: formData.get('rol'),
                    rh: formData.get('rh') || null,
                    ficha: formData.get('ficha') || null,
                    observacion: formData.get('observaciones') || null,
                    telefono1: null,
                    telefono2: null,
                    foto: null
                };

                console.log('Datos a enviar:', userData); // Para debug

                // Enviar al backend
                const response = await window.api.registrarUsuario(userData);
                
                if (response.error) {
                    mostrarNotificacion(response.error, 'error');
                    return;
                }

                mostrarNotificacion('✅ Usuario registrado exitosamente', 'success');
                formUsuario.reset();
                showSection('inicio');
            } catch (error) {
                console.error('Error:', error);
                mostrarNotificacion('❌ Error al registrar usuario: ' + (error.message || 'Error desconocido'), 'error');
            }
        });
    }

    // Formulario de Equipo
    const formEquipo = document.getElementById('form-equipo');
    if (formEquipo) {
        formEquipo.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validación de imágenes con IA
            const files = document.getElementById('ia-upload').files;
            if (files.length !== 3) {
                mostrarNotificacion('❌ Debes subir 3 imágenes', 'error');
                return;
            }

            if (!iaCargada) {
                mostrarNotificacion('⚠️ IA no está lista', 'error');
                return;
            }

            try {
                // Validar imágenes con IA
                const resultados = await Promise.all(Array.from(files).map(async file => {
                    const img = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = e => {
                            const imagen = new Image();
                            imagen.onload = () => resolve(imagen);
                            imagen.onerror = reject;
                            imagen.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    });
                    return await validarImagen(img);
                }));

                if (!resultados.every(r => r)) {
                    mostrarNotificacion('❌ Imágenes no válidas', 'error');
                    return;
                }

                // Preparar datos del dispositivo
                const formData = new FormData(formEquipo);
                const dispositivoData = Object.fromEntries(formData.entries());
                
                // Convertir imágenes a base64
                dispositivoData.fotos = await Promise.all(
                    Array.from(files).map(file => 
                        new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = e => resolve(e.target.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        })
                    )
                );

                // Enviar al backend
                const response = await window.api.registrarDispositivo(dispositivoData);
                
                if (response.error) {
                    mostrarNotificacion(response.error, 'error');
                    return;
                }

                mostrarNotificacion('✅ Dispositivo registrado exitosamente', 'success');
                formEquipo.reset();
                showSection('inicio');
            } catch (error) {
                console.error('Error:', error);
                mostrarNotificacion('❌ Error al registrar dispositivo', 'error');
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
            
            const keywordsEquipo = [
                'desktop', 'laptop', 'notebook', 'computer', 'pc', 
                'macbook', 'electronic', 'device', 'tablet', 'camera',
                'charger', 'electronics', 'battery', 'adapter', 'monitor',
                'keyboard', 'mouse', 'printer', 'scanner', 'projector',
                'hardware', 'electronic equipment', 'personal computer',
                'workstation', 'motherboard', 'processor', 'display',
                'speaker', 'loudspeaker', 'plectrum',
                'desktop computer', 'notebook computer', 'laptop computer'
            ];

            const exclusiones = [
                'logo', 'paper', 'card', 'book', 'label', 'person',
                'food', 'animal', 'clothing', 'vehicle', 'furniture',
                'building', 'landscape', 'toy', 'artwork', 'plant',
                'flower', 'tree', 'sky', 'water', 'road'
            ];

            return predicciones.some(p => {
                const clase = p.className.toLowerCase();
                return keywordsEquipo.some(kw => clase.includes(kw)) && 
                       !exclusiones.some(ex => clase.includes(ex));
            });
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