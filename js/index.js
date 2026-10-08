// Pantalla del sistema (index.html).
// Usa funciones de utileria.js
// Datos que comparte con login.js:
//   sessionStorage "usuarioNombre" y "usuarioCorreo"  -> sesión activa
//   localStorage   "usuarios_registrados"              -> usuarios que pueden entrar
// Datos propios de esta pantalla:
//   localStorage   "alumnos_registrados"

const LLAVE_USUARIOS = "usuarios_registrados";
const LLAVE_ALUMNOS = "alumnos_registrados";
const DIGITOS_CONTROL = 6;

// leer el usuario que inicio sesión en el login
const sesionCorreo = sessionStorage.getItem("usuarioCorreo");
const sesionNombre = sessionStorage.getItem("usuarioNombre") || sesionCorreo;

// Respaldo por si el script del <head> no alcanzó a redirigir
if (!sesionCorreo) {
    window.location.replace("login.html");
}

// Iniciales para el avatar: "Juan Perez" -> "JP"
function obtenerIniciales(nombre) {
    let palabras = nombre.replace(/@.*/, "").split(/[\s._-]+/).filter(p => p.length > 0);
    let iniciales = palabras.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join("");
    return iniciales || "?";
}

// Coloca el nombre en el navbar, en el menú desplegable y en el saludo
function mostrarUsuarioEnNavbar() {
    document.getElementById("nombreUsuario").textContent = sesionNombre;
    document.getElementById("avatarUsuario").textContent = obtenerIniciales(sesionNombre);
    document.getElementById("menuNombre").textContent = sesionNombre;
    document.getElementById("menuCorreo").textContent = sesionCorreo;
    document.getElementById("saludoNombre").textContent = sesionNombre;
}

// Cierra la sesión y regresa al login (replace evita volver con el botón "atrás")
function cerrarSesion() {
    sessionStorage.removeItem("usuarioNombre");
    sessionStorage.removeItem("usuarioCorreo");
    window.location.replace("login.html");
}

document.querySelectorAll(".btn-salir").forEach(function (boton) {
    boton.addEventListener("click", cerrarSesion);
});

// sidebar boton hambuerguesa (abrir y cerrar)
const btnHamburguesa = document.getElementById("btnHamburguesa");
const sidebarFondo = document.getElementById("sidebarFondo");
const consultaEscritorio = window.matchMedia("(min-width: 992px)");

function esEscritorio() {
    return consultaEscritorio.matches;
}

function sidebarVisible() {
    return esEscritorio()
        ? !document.body.classList.contains("sidebar-cerrado")
        : document.body.classList.contains("sidebar-abierto");
}

function actualizarAriaHamburguesa() {
    btnHamburguesa.setAttribute("aria-expanded", sidebarVisible() ? "true" : "false");
}

function alternarSidebar() {
    if (esEscritorio()) {
        document.body.classList.toggle("sidebar-cerrado");
    } else {
        document.body.classList.toggle("sidebar-abierto");
    }
    actualizarAriaHamburguesa();
}

function cerrarSidebarMovil() {
    document.body.classList.remove("sidebar-abierto");
    actualizarAriaHamburguesa();
}

btnHamburguesa.addEventListener("click", alternarSidebar);
sidebarFondo.addEventListener("click", cerrarSidebarMovil);
document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && !esEscritorio()) cerrarSidebarMovil();
});
consultaEscritorio.addEventListener("change", function () {
    document.body.classList.remove("sidebar-abierto");
    actualizarAriaHamburguesa();
});

// navegación entre vistas del sidebar
const vistas = document.querySelectorAll(".vista");
const tituloVista = document.getElementById("tituloVista");

function mostrarVista(nombre) {
    let vista = document.getElementById("vista-" + nombre);
    if (!vista) {
        nombre = "inicio";
        vista = document.getElementById("vista-inicio");
    }

    vistas.forEach(function (v) { v.hidden = (v !== vista); });
    tituloVista.textContent = vista.dataset.titulo;
    document.title = vista.dataset.titulo + " | Sistema Escolar";

    document.querySelectorAll(".sidebar-enlace[data-vista]").forEach(function (enlace) {
        let activo = enlace.dataset.vista === nombre;
        enlace.classList.toggle("activo", activo);
        if (activo) enlace.setAttribute("aria-current", "page");
        else enlace.removeAttribute("aria-current");
    });

    if (!esEscritorio()) cerrarSidebarMovil();
    window.scrollTo(0, 0);
}

document.querySelectorAll("[data-vista]").forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
        evento.preventDefault();
        let nombre = enlace.dataset.vista;
        history.replaceState(null, "", "#" + nombre);
        mostrarVista(nombre);
    });
});

// utilidades del formulario y almacenamiento
function mostrarError(input, mensaje) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    let feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = mensaje;
}

function marcarValido(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
}

function limpiarEstados(formulario) {
    formulario.querySelectorAll(".form-control").forEach(function (input) {
        input.classList.remove("is-invalid", "is-valid");
    });
}

function leerLista(llave) {
    try {
        let datos = JSON.parse(localStorage.getItem(llave));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

function guardarLista(llave, lista) {
    localStorage.setItem(llave, JSON.stringify(lista));
}

// Valida un nombre de una o varias palabras usando soloLetras en cada palabra
function sonSoloLetras(texto) {
    let palabras = texto.trim().split(/\s+/);
    return palabras.length > 0 && palabras.every(p => soloLetras(p));
}

// Crea una celda de tabla con texto seguro (sin innerHTML)
function crearCelda(texto, clase) {
    let td = document.createElement("td");
    td.textContent = texto;
    if (clase) td.className = clase;
    return td;
}

function crearBotonIcono(icono, etiqueta, claseBoton, alClic) {
    let boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-sm btn-icono " + claseBoton;
    boton.title = etiqueta;
    boton.setAttribute("aria-label", etiqueta);
    let imagen = document.createElement("img");
    imagen.className = "icono";
    imagen.src = "img/" + icono + ".svg";
    imagen.alt = "";
    boton.appendChild(imagen);
    boton.addEventListener("click", alClic);
    return boton;
}

// Confirmación con SweetAlert2 antes de eliminar
function confirmarEliminacion(titulo, texto, alConfirmar) {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        reverseButtons: true,
        focusCancel: true
    }).then(function (resultado) {
        if (resultado.isConfirmed) alConfirmar();
    });
}

function filaVacia(columnas, mensaje) {
    let tr = document.createElement("tr");
    tr.className = "tabla-vacia";
    let td = crearCelda(mensaje);
    td.colSpan = columnas;
    tr.appendChild(td);
    return tr;
}

// Aviso flotante de confirmación
const aviso = bootstrap.Toast.getOrCreateInstance(document.getElementById("aviso"), { delay: 2500 });
function mostrarAviso(texto, tipo) {
    let elemento = document.getElementById("aviso");
    elemento.classList.remove("text-bg-success", "text-bg-secondary");
    elemento.classList.add(tipo === "info" ? "text-bg-secondary" : "text-bg-success");
    document.getElementById("avisoTexto").textContent = texto;
    aviso.show();
}

// usuarios y captura de usuarios
const formUsuario = document.getElementById("formUsuario");
const usuNombre = document.getElementById("usuNombre");
const usuCorreo = document.getElementById("usuCorreo");
const usuPassword = document.getElementById("usuPassword");
const btnVerPassword = document.getElementById("btnVerPassword");
const requisitos = document.querySelectorAll("#requisitosPassword li");

function validarCampoNombreUsuario() {
    let nombre = usuNombre.value.trim();
    if (nombre === "") {
        mostrarError(usuNombre, "Escribe el nombre de usuario.");
        return false;
    }
    if (nombre.length < 3) {
        mostrarError(usuNombre, "El nombre debe tener al menos 3 caracteres.");
        return false;
    }
    marcarValido(usuNombre);
    return true;
}

function validarCampoCorreoUsuario() {
    let correo = usuCorreo.value.trim();
    if (correo === "") {
        mostrarError(usuCorreo, "Escribe el correo electrónico.");
        return false;
    }
    if (!validarCorreo(correo)) {
        mostrarError(usuCorreo, "Correo no válido. Ejemplo: nombre@correo.com");
        return false;
    }
    let existe = leerLista(LLAVE_USUARIOS).some(u => u.correo === correo.toLowerCase());
    if (existe) {
        mostrarError(usuCorreo, "Este correo ya está registrado.");
        return false;
    }
    marcarValido(usuCorreo);
    return true;
}

function validarCampoPasswordUsuario() {
    if (usuPassword.value === "") {
        mostrarError(usuPassword, "Escribe una contraseña.");
        return false;
    }
    if (!validarPassword(usuPassword.value)) {
        mostrarError(usuPassword, "La contraseña no cumple todos los requisitos.");
        return false;
    }
    marcarValido(usuPassword);
    return true;
}

// Marca en verde cada requisito que ya se cumple mientras se escribe
function actualizarRequisitos() {
    let valor = usuPassword.value;
    let reglas = {
        largo: valor.length >= 8,
        mayus: /[A-Z]/.test(valor),
        minus: /[a-z]/.test(valor),
        numero: /[0-9]/.test(valor),
        simbolo: /[^A-Za-z0-9\s]/.test(valor)
    };
    requisitos.forEach(function (li) {
        li.classList.toggle("cumple", reglas[li.dataset.regla]);
    });
}

usuPassword.addEventListener("input", function () {
    actualizarRequisitos();
    if (usuPassword.classList.contains("is-invalid")) validarCampoPasswordUsuario();
});
usuNombre.addEventListener("input", function () {
    if (usuNombre.classList.contains("is-invalid")) validarCampoNombreUsuario();
});
usuCorreo.addEventListener("input", function () {
    if (usuCorreo.classList.contains("is-invalid")) validarCampoCorreoUsuario();
});

btnVerPassword.addEventListener("click", function () {
    let oculto = usuPassword.type === "password";
    usuPassword.type = oculto ? "text" : "password";
    btnVerPassword.setAttribute("aria-label", oculto ? "Ocultar contraseña" : "Mostrar contraseña");
    btnVerPassword.classList.toggle("active", oculto);
});

function pintarUsuarios() {
    let tabla = document.getElementById("tablaUsuarios");
    let usuarios = leerLista(LLAVE_USUARIOS);
    tabla.replaceChildren();

    if (usuarios.length === 0) {
        tabla.appendChild(filaVacia(3, "Aún no hay usuarios registrados."));
    }

    usuarios.forEach(function (usuario) {
        let tr = document.createElement("tr");
        let esActual = usuario.correo === sesionCorreo.toLowerCase();
        // Nombre y correo se muestran tal cual los escribió el usuario
        let nombre = usuario.nombre || "—";
        let correo = usuario.correoOriginal || usuario.correo;

        let tdNombre = crearCelda(nombre);
        if (!usuario.nombre) tdNombre.classList.add("text-body-secondary");
        if (esActual) {
            let etiqueta = document.createElement("span");
            etiqueta.className = "badge text-bg-light border ms-2";
            etiqueta.textContent = "Tú";
            tdNombre.appendChild(etiqueta);
        }
        tr.appendChild(tdNombre);
        tr.appendChild(crearCelda(correo, "text-break"));

        let tdAccion = crearCelda("", "text-end");
        if (!esActual) {
            tdAccion.appendChild(crearBotonIcono("borrar", "Eliminar usuario", "btn-outline-danger", function () {
                    confirmarEliminacion("¿Eliminar usuario?", "Se eliminará al usuario " + correo + ".", function () {
                    eliminarUsuario(usuario.correo);
                });
            }));
        }
        tr.appendChild(tdAccion);
        tabla.appendChild(tr);
    });

    document.getElementById("totalUsuarios").textContent = usuarios.length;
}

function eliminarUsuario(correo) {
    let usuarios = leerLista(LLAVE_USUARIOS).filter(u => u.correo !== correo);
    guardarLista(LLAVE_USUARIOS, usuarios);
    pintarUsuarios();
    mostrarAviso("Usuario eliminado.", "info");
}

formUsuario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let nombreOk = validarCampoNombreUsuario();
    let correoOk = validarCampoCorreoUsuario();
    let passwordOk = validarCampoPasswordUsuario();
    if (!nombreOk || !correoOk || !passwordOk) return;

    // Se guarda en la misma lista que usa login.js, así el usuario puede iniciar sesión.
    // Nombre y correo se guardan tal cual se escribieron (mayúsculas, minúsculas y números);
    // "correo" en minúsculas solo sirve para buscarlo al iniciar sesión.
    let correoEscrito = usuCorreo.value.trim();
    let usuarios = leerLista(LLAVE_USUARIOS);
    usuarios.push({
        nombre: usuNombre.value.trim(),
        correo: correoEscrito.toLowerCase(),
        correoOriginal: correoEscrito,
        password: usuPassword.value
    });
    guardarLista(LLAVE_USUARIOS, usuarios);

    formUsuario.reset();
    pintarUsuarios();
    mostrarAviso("Usuario guardado correctamente.");
});

formUsuario.addEventListener("reset", function () {
    limpiarEstados(formUsuario);
    usuPassword.type = "password";
    btnVerPassword.classList.remove("active");
    setTimeout(actualizarRequisitos, 0);
});

// numero de contral y modal de edad
const formAlumno = document.getElementById("formAlumno");
const aluNombre = document.getElementById("aluNombre");
const aluApellidos = document.getElementById("aluApellidos");
const aluControl = document.getElementById("aluControl");
const aluFecha = document.getElementById("aluFecha");
const contadorControl = document.getElementById("contadorControl");
const modalEdad = new bootstrap.Modal(document.getElementById("modalEdad"));

// No se permite elegir una fecha futura en el calendario
(function () {
    let hoy = new Date();
    let mes = String(hoy.getMonth() + 1).padStart(2, "0");
    let dia = String(hoy.getDate()).padStart(2, "0");
    aluFecha.max = hoy.getFullYear() + "-" + mes + "-" + dia;
})();

function validarCampoTextoAlumno(input, etiqueta) {
    let valor = input.value.trim();
    if (valor === "") {
        mostrarError(input, "Escribe " + etiqueta + ".");
        return false;
    }
    if (!sonSoloLetras(valor)) {
        mostrarError(input, "Solo se permiten letras y espacios.");
        return false;
    }
    marcarValido(input);
    return true;
}

// Número de control: exactamente 6 dígitos (validarLongitud)
function validarCampoControl() {
    let control = aluControl.value.trim();
    if (control === "") {
        mostrarError(aluControl, "Escribe el número de control.");
        return false;
    }
    if (!validarLongitud(control, DIGITOS_CONTROL) || control.length !== DIGITOS_CONTROL) {
        mostrarError(aluControl, "El número de control debe tener exactamente 6 dígitos.");
        return false;
    }
    let repetido = leerLista(LLAVE_ALUMNOS).some(a => a.control === control);
    if (repetido) {
        mostrarError(aluControl, "Ya existe un alumno con ese número de control.");
        return false;
    }
    marcarValido(aluControl);
    return true;
}

function validarCampoFecha() {
    if (aluFecha.value === "") {
        mostrarError(aluFecha, "Selecciona la fecha de nacimiento.");
        return false;
    }
    let edad = calcularEdad(aluFecha.value);
    if (edad < 0) {
        mostrarError(aluFecha, "La fecha no puede ser futura.");
        return false;
    }
    if (edad > 100) {
        mostrarError(aluFecha, "Revisa el año de nacimiento.");
        return false;
    }
    marcarValido(aluFecha);
    return true;
}

// Solo deja escribir números y muestra cuántos dígitos lleva
aluControl.addEventListener("input", function () {
    aluControl.value = aluControl.value.replace(/\D/g, "").slice(0, DIGITOS_CONTROL);
    contadorControl.textContent = aluControl.value.length;
    if (aluControl.classList.contains("is-invalid")) validarCampoControl();
});
aluNombre.addEventListener("input", function () {
    if (aluNombre.classList.contains("is-invalid")) validarCampoTextoAlumno(aluNombre, "el nombre");
});
aluApellidos.addEventListener("input", function () {
    if (aluApellidos.classList.contains("is-invalid")) validarCampoTextoAlumno(aluApellidos, "los apellidos");
});
aluFecha.addEventListener("change", function () {
    if (aluFecha.classList.contains("is-invalid")) validarCampoFecha();
});

// Llena y abre el modal con la edad del alumno
function mostrarModalEdad(alumno) {
    let edad = calcularEdad(alumno.fecha);
    let mayor = esMayorDeEdad(alumno.fecha);
    let dias = diasParaCumple(alumno.fecha);

    let circulo = document.getElementById("modalEdadNumero");
    circulo.textContent = edad;
    circulo.classList.toggle("menor", !mayor);

    document.getElementById("modalEdadNombre").textContent = alumno.nombre + " " + alumno.apellidos;
    document.getElementById("modalEdadControl").textContent = alumno.control;

    let estado = document.getElementById("modalEdadEstado");
    estado.textContent = mayor ? "Es mayor de edad" : "Es menor de edad";
    estado.className = "badge rounded-pill fs-6 px-3 py-2 " + (mayor ? "text-bg-success" : "text-bg-warning");

    document.getElementById("modalEdadCumple").textContent = dias === 0
        ? "¡Hoy es su cumpleaños!"
        : "Faltan " + dias + (dias === 1 ? " día" : " días") + " para su cumpleaños.";

    modalEdad.show();
}

function pintarAlumnos() {
    let tabla = document.getElementById("tablaAlumnos");
    let alumnos = leerLista(LLAVE_ALUMNOS);
    tabla.replaceChildren();

    if (alumnos.length === 0) {
        tabla.appendChild(filaVacia(4, "Aún no hay alumnos registrados."));
    }

    let mayores = 0;
    alumnos.forEach(function (alumno) {
        let edad = calcularEdad(alumno.fecha);
        let mayor = esMayorDeEdad(alumno.fecha);
        if (mayor) mayores++;

        let tr = document.createElement("tr");
        tr.appendChild(crearCelda(alumno.control, "font-monospace"));
        tr.appendChild(crearCelda(alumno.nombre + " " + alumno.apellidos));

        let tdEdad = crearCelda(edad + " ");
        let badge = document.createElement("span");
        badge.className = "badge " + (mayor ? "text-bg-success" : "text-bg-warning");
        badge.textContent = mayor ? "Mayor" : "Menor";
        tdEdad.appendChild(badge);
        tr.appendChild(tdEdad);

        let tdAccion = crearCelda("", "text-end text-nowrap");
        tdAccion.appendChild(crearBotonIcono("pastel", "Ver edad", "btn-outline-secondary me-1", function () {
            mostrarModalEdad(alumno);
        }));
        tdAccion.appendChild(crearBotonIcono("borrar", "Eliminar alumno", "btn-outline-danger", function () {
            confirmarEliminacion("¿Eliminar alumno?", "Se eliminará al alumno con número de control " + alumno.control + ".", function () {
                eliminarAlumno(alumno.control);
            });
        }));
        tr.appendChild(tdAccion);
        tabla.appendChild(tr);
    });

    document.getElementById("totalAlumnos").textContent = alumnos.length;
    document.getElementById("totalMayores").textContent = mayores;
}

function eliminarAlumno(control) {
    let alumnos = leerLista(LLAVE_ALUMNOS).filter(a => a.control !== control);
    guardarLista(LLAVE_ALUMNOS, alumnos);
    pintarAlumnos();
    mostrarAviso("Alumno eliminado.", "info");
}

formAlumno.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let nombreOk = validarCampoTextoAlumno(aluNombre, "el nombre");
    let apellidosOk = validarCampoTextoAlumno(aluApellidos, "los apellidos");
    let controlOk = validarCampoControl();
    let fechaOk = validarCampoFecha();
    if (!nombreOk || !apellidosOk || !controlOk || !fechaOk) return;

    let alumno = {
        nombre: capitalizarNombre(aluNombre.value),
        apellidos: capitalizarNombre(aluApellidos.value),
        control: aluControl.value.trim(),
        fecha: aluFecha.value
    };

    let alumnos = leerLista(LLAVE_ALUMNOS);
    alumnos.push(alumno);
    guardarLista(LLAVE_ALUMNOS, alumnos);

    formAlumno.reset();
    pintarAlumnos();
    mostrarModalEdad(alumno);
});

formAlumno.addEventListener("reset", function () {
    limpiarEstados(formAlumno);
    contadorControl.textContent = "0";
});


mostrarUsuarioEnNavbar();
pintarUsuarios();
pintarAlumnos();
actualizarAriaHamburguesa();
mostrarVista(window.location.hash.replace("#", "") || "inicio");
