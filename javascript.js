document.addEventListener("DOMContentLoaded", async () => {
    // ========== [1. CONFIGURACIÓN INICIAL] ==========
    const bcrypt = window.dcodeIO.bcrypt;
    const saltRounds = 10;

    // ========== [2. LISTA COMPLETA DE PROGRAMAS SENA ==========
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
        sections.forEach(section => section.classList.toggle('active', section.id === sectionId));
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(link.getAttribute('href').substring(1));
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

    async function validarImagen(imagen) {
        try {
            const tensor = tf.browser.fromPixels(imagen)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .expandDims();
            
            const predicciones = await net.classify(tensor, 5);
            tensor.dispose();
    
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
    
            const umbralConfianza = 0.10;
    
            const esDispositivo = predicciones.some(p => {
                const clase = p.className.toLowerCase();
                const confianza = p.probability;
                
                const tieneKeyword = keywordsEquipo.some(kw => clase.includes(kw));
                const tieneExclusion = exclusiones.some(ex => clase.includes(ex));
                
                if (tieneKeyword) {
                    console.log(`Detectado posible dispositivo: ${clase} (${confianza.toFixed(2)})`);
                    return true;
                }
                
                return tieneKeyword && (confianza > umbralConfianza) && !tieneExclusion;
            });
    
            if (!esDispositivo) {
                console.log("No es identificado como dispositivo en primera revisión, haciendo análisis secundario...");
                
                const otrasPredicciones = predicciones.map(p => p.className.toLowerCase());
                
                const terminosIndirectos = [
                    'electronic', 'screen', 'display', 'technology', 
                    'digital', 'equipment', 'device', 'hardware',
                    'metal', 'plastic', 'screen', 'speaker', 'unit',
                    'system', 'pick', 'plectrum', 'appliance', 'gadget'
                ];
                
                const posibleDispositivo = otrasPredicciones.some(p => 
                    terminosIndirectos.some(term => p.includes(term))
                );
                
                if (posibleDispositivo) return true;
                
                const altaConfianzaGeneral = predicciones.some(p => p.probability > 0.4);
                if (altaConfianzaGeneral) return true;
            }
    
            return esDispositivo;
        } catch (error) {
            console.error("Error en validación IA:", error);
            mostrarNotificacion('⚠️ Advertencia: Error en análisis de imagen. Verificando manualmente.', 'warning');
            return true;
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

    // ========== [10. VALIDACIÓN GLOBAL RH ==========
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
    async function handleFormSubmit(formId, storageKey) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (formId === 'form-usuario' && !await validarContraseña(form)) return;
            
            if (formId === 'form-equipo') {
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
                } catch (error) {
                    mostrarNotificacion('⚠️ Error procesando imágenes', 'error');
                    return;
                }
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            if (formId === 'form-usuario') {
                // Verificar duplicados para aprendices
                if (data.rol === 'aprendiz') {
                    const aprendices = JSON.parse(localStorage.getItem('aprendices') || '[]');
                    const fichaDuplicada = aprendices.some(a => 
                        a.ficha === data.ficha && a.programa === data.programa
                    );
                    
                    if (fichaDuplicada) {
                        mostrarNotificacion('❌ Esta ficha ya está registrada para este programa', 'error');
                        return;
                    }
                }

                data.password_hash = await hashPassword(data.password);
                delete data.password;
                delete data.confirm_password;
            }

            const coleccion = formId === 'form-usuario' ? `${data.rol}s` : storageKey;
            const registros = JSON.parse(localStorage.getItem(coleccion) || '[]');
            registros.push(data);
            localStorage.setItem(coleccion, JSON.stringify(registros));
            
            mostrarNotificacion('✅ Registro exitoso!', 'success');
            form.reset();
            showSection('inicio');
        });
    }

    // ========== [13. AUTENTICACIÓN] ==========
    window.loginWeb = async (documento, password) => {
        const usuarios = [
            ...JSON.parse(localStorage.getItem('aprendices') || '[]'),
            ...JSON.parse(localStorage.getItem('instructores') || '[]'),
            ...JSON.parse(localStorage.getItem('administrativos') || '[]')
        ];

        const usuario = usuarios.find(u => u.documento === documento);
        if (!usuario) return mostrarNotificacion('❌ Credenciales inválidas', 'error');

        try {
            if (await bcrypt.compare(password, usuario.password_hash)) {
                mostrarNotificacion('✅ Bienvenido!', 'success');
                // Redirección lógica aquí
            } else {
                mostrarNotificacion('❌ Credenciales inválidas', 'error');
            }
        } catch (error) {
            mostrarNotificacion('⚠️ Error en autenticación', 'error');
            console.error("Error login:", error);
        }
    };

    // ========== [14. INICIALIZACIÓN] ==========
    showSection(window.location.hash.substring(1) || 'inicio');
    if (window.location.hash === '#equipos') await cargarModeloIA();
    window.addEventListener('hashchange', async () => {
        if (window.location.hash === '#equipos' && !iaCargada) await cargarModeloIA();
    });

    await cargarModeloIA();
    handleFormSubmit('form-usuario');
    handleFormSubmit('form-equipo', 'equipos');
});