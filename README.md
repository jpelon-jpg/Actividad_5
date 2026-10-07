# 🎓 Sistema de Gestión Escolar - Frontend Web

---

## 📋 Portada e Información del Proyecto

- **Nombre del Proyecto:** Sistema de Gestión Escolar Web
- **Materia / Asignatura:** Programación Web / Ingeniería de Software
- **Integrantes del Equipo:**
  - [Nombre y Apellidos del Integrante 1]
  - [Nombre y Apellidos del Integrante 2]
  - [Nombre y Apellidos del Integrante 3]
  - [Nombre y Apellidos del Integrante 4]
- **Descripción Breve:**  
  Plataforma web ligera e interactiva diseñada para la administración escolar, el registro de usuarios y la gestión de alumnos. El sistema incluye un módulo de inicio de sesión con animación de deslizamiento (*sliding panel*), validación de contraseñas complejas en tiempo real, cálculo automatizado de edades y días faltantes para el cumpleaños de los alumnos, y un panel de control con navegación dinámica sin recarga de página.

---

## 🛠️ Explicación Técnica y Documentación

### 1. Framework CSS Utilizado
El proyecto utiliza **Bootstrap v5.3.3** como framework CSS principal para la maquetación responsiva, el diseño de componentes (tablas, formularios, botones, tarjetas) y la gestión de modales interactivas y avisos flotantes (*Toasts*)[cite: 5, 6, 9]. Se complementa con archivos CSS propios (`login.css` e `index.css`) para aplicar estilos personalizados, animaciones de transición y variables cromáticas globales (`:root`)[cite: 10, 11].

### 2. Flujo de Autenticación y Transición del Login al Sistema
1. **Acceso al Login (`login.html`):** El usuario interactúa con la interfaz deslizable (*Sign In / Sign Up*)[cite: 6].
2. **Validación:** Al iniciar sesión o registrarse, se validan la estructura del correo electrónico y la fortaleza de la contraseña (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo)[cite: 7, 8].
3. **Persistencia:** Si las credenciales son correctas o el registro es exitoso, la información del usuario se almacena en `sessionStorage` bajo la clave `usuarioActual`[cite: 7].
4. **Redirección:** El script ejecuta la redirección automática hacia la pantalla principal (`index.html`)[cite: 7].
5. **Verificación de Seguridad:** Al cargar `index.html`, el script `index.js` consulta `sessionStorage`. Si no existe la sesión de un usuario autenticado, redirige inmediatamente de vuelta a `login.html` para denegar accesos no autorizados[cite: 9].

### 3. Transferencia del Nombre de Usuario al Navbar
Para pasar los datos del usuario logueado desde la pantalla de login hasta la barra de navegación (*Navbar*):
1. En **`login.js`**, tras autenticar al usuario, se guarda el objeto con sus datos en el navegador:
   ```javascript
   sessionStorage.setItem('usuarioActual', JSON.stringify({ email: correo, nombre: nombreExtraido }));
   ```[cite: 7]
2. En **`index.js`**, durante la inicialización de la página principal, se lee el valor almacenado:
   ```javascript
   const usuarioSesion = JSON.parse(sessionStorage.getItem('usuarioActual'));
   ```[cite: 9]
3. Se extrae el nombre/correo y se invoca la función para renderizar el nombre de usuario y calcular sus iniciales para el avatar en el Navbar[cite: 9]:
   ```javascript
   document.getElementById('lblNombreUsuario').textContent = usuarioSesion.nombre;
   document.getElementById('avatarUsuario').textContent = obtenerIniciales(usuarioSesion.nombre);
   ```[cite: 5, 9]

### 4. Métodos y Funciones Principales

#### Módulo de Utilería (`utileria.js`)
- `validarCorreo(correo)`: Comprueba la estructura válida de correo mediante expresiones regulares (Regex)[cite: 8].
- `validarPassword(password)`: Verifica los 5 criterios de seguridad de la contraseña[cite: 8].
- `soloLetras(texto)`: Garantiza que un texto contenga únicamente letras, espacios y caracteres acentuados[cite: 8].
- `validarLongitud(numero, maxLongitud)`: Restringe el ingreso a un máximo de dígitos (usado para la matrícula/número de control de 6 dígitos)[cite: 8].
- `calcularEdad(fechaNacimiento)`: Retorna la edad exacta calculada en años[cite: 8].
- `esMayorDeEdad(fechaNacimiento)`: Evalúa si la persona tiene 18 años o más[cite: 8].
- `diasParaCumple(fechaNacimiento)`: Retorna el número de días faltantes para la próxima fecha de cumpleaños[cite: 8].

#### Módulo Principal (`index.js`)
- `cargarVista(hash)`: Gestiona el cambio de secciones (*Inicio*, *Usuarios*, *Alumnos*) ocultando y mostrando los contenedores según la ruta en la URL[cite: 9].
- `guardarAlumno()`: Lee los campos del formulario, ejecuta las validaciones, añade el nuevo registro a la tabla y despliega el modal interactivo de confirmación[cite: 9].
- `cerrarSesion()`: Elimina los datos guardados en `sessionStorage` y redirige a la pantalla de acceso[cite: 9].

---

## 🏗️ Proceso de Creación Paso a Paso

### Paso 1: Módulo de Login Deslizable (*Sliding Panel*)
1. **Estructura HTML:** Se diseñó un contenedor principal con dos formularios en paralelo (`Sign In` y `Sign Up`) y un panel superpuesto (*Overlay Container*)[cite: 6].
2. **Estilos CSS:** Se utilizó `position: absolute`, animaciones CSS (`keyframes`) y la propiedad `transform: translateX()` para lograr el efecto de deslizamiento suave al presionar el botón de conmutación[cite: 11].
3. **Lógica JS:** Se agregaron escuchadores de eventos (*event listeners*) a los botones para alternar la clase `.right-panel-active` en el contenedor principal[cite: 7].
4. **Validación Dinámica:** Se añadieron eventos `input` en el campo de contraseña para encender o apagar dinámicamente los indicadores de requisitos de seguridad en tiempo real[cite: 7, 8].

> **Captura - Pantalla de Login y Registro:**  
> *(Insertar imagen aquí: `docs/capturas/01_login_registro.png`)*

---

### Paso 2: Construcción del Dashboard y Sidebar
1. **Estructura Base:** Se creó la plantilla principal en `index.html` organizando el maquetado en dos columnas con Bootstrap: una columna fija para la navegación lateral (*Sidebar*) y un área central expandible para el contenido[cite: 5].
2. **Navegación Dinámica:** En lugar de recargar archivos HTML distintos, se asignaron identidades `#inicio`, `#captura` y `#alumnos` a cada vista[cite: 5]. Se utilizó el evento `hashchange` para ocultar o mostrar cada sección dinámicamente mediante manipular clases de visibilidad CSS[cite: 9].

> **Captura - Sidebar y Vista de Inicio:**  
> *(Insertar imagen aquí: `docs/capturas/02_sidebar_dashboard.png`)*

---

### Paso 3: Integración del Navbar y Gestión del Usuario
1. **Diseño:** Se ubicó el Navbar en la parte superior del contenido principal con el título del sistema, un avatar dinámico y un menú desplegable para cerrar sesión[cite: 5].
2. **Vinculación:** Al validar el inicio de sesión, el script de Login almacena el usuario y el script del Dashboard lee este estado global, inyectando el nombre del usuario y sus iniciales en los elementos correspondientes del DOM[cite: 7, 9].

> **Captura - Navbar con datos del usuario e iniciales:**  
> *(Insertar imagen aquí: `docs/capturas/03_navbar_usuario.png`)*

---

### Paso 4: Formulario con Número de Control y Modal de Edad
1. **Campo Número de Control:** Se implementó una máscara de entrada mediante JS para impedir el ingreso de caracteres alfabéticos o la captura de más de 6 dígitos numéricos[cite: 8, 9].
2. **Selector de Fecha:** Se limitó el parámetro `max` en el selector HTML `<input type="date">` a la fecha actual para evitar registros de fechas futuras[cite: 9].
3. **Cálculo y Generación del Modal:** Al procesar el formulario de alumno:
   - Se procesa la fecha ingresada utilizando las funciones de `utileria.js` (`calcularEdad`, `esMayorDeEdad`, `diasParaCumple`)[cite: 8, 9].
   - Se inyectan los valores resultantes en la estructura del modal Bootstrap (`#modalResumenAlumno`)[cite: 5, 9].
   - Se dispara la apertura programática del modal usando la API de Bootstrap: `new bootstrap.Modal(...).show()`[cite: 9].

> **Captura - Formulario de Registro de Alumno y Restricciones:**  
> *(Insertar imagen aquí: `docs/capturas/04_formulario_alumnos.png`)*

> **Captura - Modal con Cálculo de Edad y Días para Cumpleaños:**  
> *(Insertar imagen aquí: `docs/capturas/05_modal_edad.png`)*

---

## 📸 Capturas de Pantalla del Flujo Completo

A continuación se muestra la secuencia completa de uso del sistema:

### 1. Pantalla de Acceso (Login / Registro)
*(Insertar captura mostrando el formulario de login e indicadores de contraseña)*

### 2. Panel Principal (Dashboard)
*(Insertar captura de la vista inicial con tarjetas informativas y Sidebar funcional)*

### 3. Menú de Usuario en Navbar
*(Insertar captura con zoom al Navbar, mostrando el nombre, avatar y opción "Cerrar Sesión")*

### 4. Captura de Registro de Alumnos
*(Insertar captura del formulario de alumnos completado con número de control de 6 dígitos)*

### 5. Modal Interactivo de Resultados de Alumno
*(Insertar captura del Modal desplegado mostrando la edad calculada, estatus de mayoría de edad y días faltantes para su cumpleaños)*

---

## 💻 Instrucciones de Ejecución Local

1. Descarga o clona este repositorio.
2. Abre el archivo **`login.html`** directamente en tu navegador preferido[cite: 6].
3. Registra un nuevo usuario respetando los parámetros requeridos para la contraseña[cite: 6, 7].
4. Explora las secciones del sistema desde el menú lateral[cite: 5].