document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const loginForm = document.getElementById('login-form');
    const registerForm1 = document.getElementById('register-form-1');
    const registerForm2 = document.getElementById('register-form-2');
    const backToStep1 = document.getElementById('back-to-step1');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginTab = document.getElementById('login');
    const registerTab = document.getElementById('register');
    const registerStep1 = document.getElementById('register-step-1');
    const registerStep2 = document.getElementById('register-step-2');

    // Control de pestañas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar clase activa de todos los botones
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase activa al botón clickeado
            btn.classList.add('active');
            
            // Mostrar la pestaña correspondiente
            const tabId = btn.getAttribute('data-tab');
            if (tabId === 'login') {
                loginTab.classList.add('active');
                registerTab.classList.remove('active');
            } else {
                loginTab.classList.remove('active');
                registerTab.classList.add('active');
                // Reset al paso 1 cuando se cambia a la pestaña de registro
                registerStep1.classList.add('active');
                registerStep2.classList.remove('active');
            }
        });
    });

    // Control de pasos en el registro
    let usuarioIdStep1 = null; // Guardar el id del usuario tras el primer paso
    if (registerForm1) {
        registerForm1.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateRegisterStep1()) {
                // Obtener datos del primer paso
                const formData1 = new FormData(registerForm1);
                const dataStep1 = {
                    nombre: formData1.get('nombre'),
                    correo: formData1.get('email'),
                    documento: formData1.get('documento'),
                    tipo_documento: formData1.get('tipo_documento'),
                    contrasena: formData1.get('password')
                };
                try {
                    showNotification('Procesando primer paso...', 'info');
                    const response = await fetch('/api/usuarios/register-step1', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataStep1)
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        showNotification(result.error || 'Error en el primer paso', 'error');
                        return;
                    }
                    usuarioIdStep1 = result.usuario.id;
                    showNotification('Primer paso exitoso. Continúa con el segundo paso.', 'success');
                    // Ocultar paso 1 y mostrar paso 2
                    registerStep1.classList.remove('active');
                    registerStep2.classList.add('active');
                } catch (error) {
                    showNotification('Error al registrar. Intente nuevamente.', 'error');
                }
            }
        });
    }

    // Botón para volver al paso 1
    if (backToStep1) {
        backToStep1.addEventListener('click', () => {
            registerStep2.classList.remove('active');
            registerStep1.classList.add('active');
        });
    }

    // Envío del formulario final de registro
    if (registerForm2) {
        registerForm2.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateRegisterStep2()) {
                if (!usuarioIdStep1) {
                    showNotification('Error: No se encontró el usuario del primer paso.', 'error');
                    return;
                }
                const formData2 = new FormData(registerForm2);
                const dataStep2 = {
                    rol: formData2.get('rol'),
                    telefono1: formData2.get('telefono1'),
                    telefono2: formData2.get('telefono2'),
                    rh: formData2.get('rh'),
                    ficha: formData2.get('ficha'),
                    observacion: formData2.get('observaciones')
                };
                try {
                    showNotification('Procesando segundo paso...', 'info');
                    const response = await fetch(`/api/usuarios/register-step2/${usuarioIdStep1}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataStep2)
                    });
                    const result = await response.json();
                    if (!response.ok) {
                        showNotification(result.error || 'Error en el segundo paso', 'error');
                        return;
                    }
                    showNotification('Registro exitoso! Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } catch (error) {
                    showNotification('Error al completar el registro. Intente nuevamente.', 'error');
                }
            }
        });
    }

    // Envío del formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;
            
            // Validación básica
            if (!email || !password) {
                showNotification('Por favor complete todos los campos', 'error');
                return;
            }
            
            try {
                showNotification('Iniciando sesión...', 'info');
                const response = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo: email, contrasena: password })
                });
                const result = await response.json();
                if (!response.ok) {
                    showNotification(result.error || 'Credenciales inválidas', 'error');
                    return;
                }
                // Guardar datos de usuario en localStorage
                localStorage.setItem('user', JSON.stringify(result.usuario));
                showNotification('Inicio de sesión exitoso! Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } catch (error) {
                showNotification('Error al iniciar sesión. Intente nuevamente.', 'error');
            }
        });
    }

    // Alternar visibilidad de contraseña
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    if (togglePasswordBtns) {
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.parentElement.querySelector('input');
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    btn.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });
    }

    // Indicador de fortaleza de contraseña
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('reg-confirm-password');
    const strengthIndicator = document.querySelector('.password-strength');
    
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            updatePasswordStrength(password, strengthIndicator);
        });
    }
    
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (password !== confirmPassword) {
                confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        });
    }

    // Funciones auxiliares
    function validateRegisterStep1() {
        const nombre = registerForm1.querySelector('#reg-nombre').value;
        const tipoDocumento = registerForm1.querySelector('#reg-tipo-documento').value;
        const documento = registerForm1.querySelector('#reg-documento').value;
        const email = registerForm1.querySelector('#reg-email').value;
        const password = registerForm1.querySelector('#reg-password').value;
        const confirmPassword = registerForm1.querySelector('#reg-confirm-password').value;
        
        // Validaciones básicas
        if (!nombre || !tipoDocumento || !documento || !email || !password || !confirmPassword) {
            showNotification('Por favor complete todos los campos', 'error');
            return false;
        }
        
        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Formato de correo electrónico inválido', 'error');
            return false;
        }
        
        // Validar contraseña
        if (password.length < 8) {
            showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
            return false;
        }
        
        // Validar confirmación de contraseña
        if (password !== confirmPassword) {
            showNotification('Las contraseñas no coinciden', 'error');
            return false;
        }
        
        return true;
    }
    
    function validateRegisterStep2() {
        const rol = registerForm2.querySelector('#reg-rol').value;
        
        // Validar rol (campo obligatorio)
        if (!rol) {
            showNotification('Por favor seleccione un rol', 'error');
            return false;
        }
        
        // Si es aprendiz, validar número de ficha
        if (rol === 'aprendiz') {
            const ficha = registerForm2.querySelector('#reg-ficha').value;
            if (!ficha) {
                showNotification('El número de ficha es obligatorio para aprendices', 'error');
                return false;
            }
        }
        
        return true;
    }
    
    function updatePasswordStrength(password, indicator) {
        // Evaluar fortaleza de la contraseña
        let strength = 0;
        
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Actualizar indicador visual
        indicator.className = 'password-strength';
        
        if (strength === 0) {
            // No mostrar barra si no hay contraseña
            indicator.classList.remove('weak', 'medium', 'strong');
        } else if (strength <= 2) {
            indicator.classList.add('weak');
        } else if (strength === 3) {
            indicator.classList.add('medium');
        } else {
            indicator.classList.add('strong');
        }
    }
    
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Crear icono según el tipo
        const icon = document.createElement('i');
        switch(type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'fas fa-times-circle';
                break;
            case 'info':
                icon.className = 'fas fa-info-circle';
                break;
            case 'warning':
                icon.className = 'fas fa-exclamation-circle';
                break;
        }
        
        // Crear contenedor de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = 'notification-message';
        messageDiv.textContent = message;
        
        // Crear botón de cerrar
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        // Ensamblar notificación
        notification.appendChild(icon);
        notification.appendChild(messageDiv);
        notification.appendChild(closeBtn);
        
        // Agregar al contenedor
        container.appendChild(notification);
        
        // Animar entrada
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Configurar cierre automático
        const timeout = setTimeout(() => {
            closeNotification(notification);
        }, 5000);
        
        // Manejar cierre manual
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            closeNotification(notification);
        });
        
        // Pausar timeout al hover
        notification.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
        });
        
        // Reanudar timeout al quitar hover
        notification.addEventListener('mouseleave', () => {
            const newTimeout = setTimeout(() => {
                closeNotification(notification);
            }, 2000);
            notification._timeout = newTimeout;
        });
    }

    function closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }

    // Agregar estilos de notificación dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        #notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        }

        .notification {
            display: flex;
            align-items: center;
            padding: 16px;
            border-radius: 12px;
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            gap: 12px;
        }

        .notification i {
            font-size: 20px;
        }

        .notification-message {
            flex: 1;
            margin: 0 12px;
            font-size: 14px;
            line-height: 1.4;
        }

        .notification-close {
            background: none;
            border: none;
            padding: 4px;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s ease;
            border-radius: 50%;
        }

        .notification-close:hover {
            opacity: 1;
            background: rgba(0, 0, 0, 0.05);
        }

        .notification-success {
            border-left: 4px solid #4caf50;
        }

        .notification-success i {
            color: #4caf50;
        }

        .notification-error {
            border-left: 4px solid #f44336;
        }

        .notification-error i {
            color: #f44336;
        }

        .notification-info {
            border-left: 4px solid #2196f3;
        }

        .notification-info i {
            color: #2196f3;
        }

        .notification-warning {
            border-left: 4px solid #ff9800;
        }

        .notification-warning i {
            color: #ff9800;
        }
    `;

    document.head.appendChild(style);

    // Fondo con logos de CompuScan
    function drawLogoBackground() {
        const canvas = document.getElementById('hex-bg-canvas');
        const ctx = canvas.getContext('2d');
        let logos = [];
        let animationFrame;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initLogos();
        }

        function initLogos() {
            logos = [];
            const spacing = 300;
            const rows = Math.ceil(canvas.height / spacing) + 2;
            const cols = Math.ceil(canvas.width / spacing) + 2;

            for (let i = -1; i < rows; i++) {
                for (let j = -1; j < cols; j++) {
                    const x = j * spacing + (i % 2) * spacing / 2;
                    const y = i * spacing;
                    logos.push({
                        x,
                        y,
                        scale: Math.random() * 0.4 + 0.8,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.015,
                        opacity: Math.random() * 0.3 + 0.2
                    });
                }
            }
        }

        function drawLogo(x, y, scale, rotation, opacity) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            
            // Dibujar el robot (simplificado)
            ctx.strokeStyle = `rgba(142, 198, 65, ${opacity})`;
            ctx.fillStyle = `rgba(142, 198, 65, ${opacity * 0.7})`;
            ctx.lineWidth = 3;
            
            // Cabeza del robot
            ctx.beginPath();
            ctx.arc(0, -25, 30, 0, Math.PI * 2);
            ctx.stroke();
            
            // Antena
            ctx.beginPath();
            ctx.moveTo(0, -55);
            ctx.lineTo(0, -70);
            ctx.arc(0, -70, 6, 0, Math.PI * 2);
            ctx.stroke();
            
            // Ojos
            ctx.beginPath();
            ctx.arc(-12, -30, 6, 0, Math.PI * 2);
            ctx.arc(12, -30, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Cuerpo
            ctx.beginPath();
            ctx.roundRect(-25, 5, 50, 50, 8);
            ctx.stroke();
            
            // Texto "CompuScan"
            ctx.textAlign = 'center';
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = `rgba(142, 198, 65, ${opacity})`;
            ctx.fillText('CompuScan', 0, 80);
            
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            logos.forEach(logo => {
                logo.rotation += logo.rotationSpeed;
                drawLogo(logo.x, logo.y, logo.scale, logo.rotation, logo.opacity);
            });
            
            animationFrame = requestAnimationFrame(animate);
        }

        // Event listeners
        window.addEventListener('resize', resize);
        resize();
        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }

    // Patrón de texto CompuScan
    function drawTextPattern() {
        const canvas = document.getElementById('logo-bg-canvas');
        const ctx = canvas.getContext('2d');
        let pattern;
        let animationFrame;
        let offset = 0;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createPattern();
        }

        function createPattern() {
            const patternCanvas = document.createElement('canvas');
            const patternCtx = patternCanvas.getContext('2d');
            patternCanvas.width = 300;
            patternCanvas.height = 150;

            // Dibujar el texto "CompuScan" en diferentes tamaños y opacidades
            patternCtx.font = 'bold 32px Arial';
            patternCtx.textAlign = 'center';
            patternCtx.fillStyle = 'rgba(142, 198, 65, 0.25)';
            patternCtx.fillText('CompuScan', 150, 50);

            patternCtx.font = 'bold 24px Arial';
            patternCtx.fillStyle = 'rgba(142, 198, 65, 0.15)';
            patternCtx.fillText('Security', 150, 90);

            pattern = ctx.createPattern(patternCanvas, 'repeat');
        }

        function draw() {
            if (!pattern) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            
            // Crear efecto de desplazamiento diagonal más lento
            ctx.translate(offset, offset);
            ctx.fillStyle = pattern;
            ctx.fillRect(-canvas.width, -canvas.height, canvas.width * 3, canvas.height * 3);
            
            offset = (offset + 0.15) % 300;
            ctx.restore();
            
            animationFrame = requestAnimationFrame(draw);
        }

        // Event listeners
        window.addEventListener('resize', resize);
        resize();
        draw();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }

    // Iniciar efectos de fondo
    drawLogoBackground();
    drawTextPattern();
}); 