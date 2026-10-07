// Pantalla de acceso (simulado, sin backend).
// Usa funciones de utileria.js: validarCorreo, validarPassword, soloLetras, formatearNombre.

const container = document.getElementById("container");
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");

const formLogin = document.getElementById("formLogin");
const inputCorreo = document.getElementById("correo");
const inputPassword = document.getElementById("password");

const formRegistro = document.getElementById("formRegistro");
const inputRegNombre = document.getElementById("regNombre");
const inputRegCorreo = document.getElementById("regCorreo");
const inputRegPassword = document.getElementById("regPassword");

// Si ya hay sesión simulada, se entra directo al sistema.
if (sessionStorage.getItem("usuarioCorreo")) {
    window.location.href = "index.html";
}

// ----- Animación del panel deslizable -----
signUpButton.addEventListener("click", function () {
    container.classList.add("right-panel-active");
});
signInButton.addEventListener("click", function () {
    container.classList.remove("right-panel-active");
});

// ----- Utilidades de error -----
// El mensaje se escribe en el div.invalid-feedback que sigue al input.
function mostrarError(input, mensaje) {
    input.classList.add("is-invalid");
    input.nextElementSibling.textContent = mensaje;
}

function limpiarErrores(formulario) {
    formulario.querySelectorAll("input").forEach(function (input) {
        input.classList.remove("is-invalid");
    });
}

// "juan.perez@x.com" -> "Juan Perez"
function obtenerNombreDesdeCorreo(correo) {
    let parteLocal = correo.split("@")[0];
    let limpio = parteLocal.replace(/[._-]+/g, " ").replace(/[0-9]/g, "").trim();
    return limpio ? formatearNombre(limpio) : correo;
}

// Guarda la sesión simulada y entra al sistema. index.html lee estos datos para el navbar.
function iniciarSesion(nombre, correo) {
    sessionStorage.setItem("usuarioNombre", nombre);
    sessionStorage.setItem("usuarioCorreo", correo);
    window.location.href = "index.html";
}

// Validaciones compartidas por ambos formularios. Devuelve true si todo es válido.
function validarCampoCorreo(input) {
    let correo = input.value.trim();
    if (correo === "") {
        mostrarError(input, "Escribe tu correo electrónico.");
        return false;
    }
    if (!validarCorreo(correo)) {
        mostrarError(input, "Correo no válido. Ejemplo: nombre@correo.com");
        return false;
    }
    return true;
}

function validarCampoPassword(input) {
    if (input.value === "") {
        mostrarError(input, "Escribe tu contraseña.");
        return false;
    }
    if (!validarPassword(input.value)) {
        mostrarError(input, "Debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo.");
        return false;
    }
    return true;
}

// ----- Iniciar sesión -----
formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores(formLogin);

    let correoValido = validarCampoCorreo(inputCorreo);
    let passwordValido = validarCampoPassword(inputPassword);
    if (!correoValido || !passwordValido) return;

    let correo = inputCorreo.value.trim();
    iniciarSesion(obtenerNombreDesdeCorreo(correo), correo);
});

// ----- Crear cuenta (simulado: valida y entra al sistema) -----
formRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores(formRegistro);

    let nombre = inputRegNombre.value.trim();
    let nombreValido = true;
    if (nombre === "") {
        mostrarError(inputRegNombre, "Escribe tu nombre.");
        nombreValido = false;
    } else if (!soloLetras(nombre)) {
        mostrarError(inputRegNombre, "El nombre solo puede tener letras.");
        nombreValido = false;
    }

    let correoValido = validarCampoCorreo(inputRegCorreo);
    let passwordValido = validarCampoPassword(inputRegPassword);
    if (!nombreValido || !correoValido || !passwordValido) return;

    iniciarSesion(formatearNombre(nombre), inputRegCorreo.value.trim());
});
