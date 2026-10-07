// Pantalla de acceso con persistencia local mediante localStorage.
// Usa funciones de utileria.js: validarCorreo, validarPassword.

const container = document.getElementById("container");
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");

const formLogin = document.getElementById("formLogin");
const inputCorreo = document.getElementById("correo");
const inputPassword = document.getElementById("password");

const formRegistro = document.getElementById("formRegistro");
const inputRegCorreo = document.getElementById("regCorreo");
const inputRegPassword = document.getElementById("regPassword");

// Redireccionar si ya existe una sesión activa
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

// ----- Manejo de Errores -----
function mostrarError(input, mensaje) {
    input.classList.add("is-invalid");
    let feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = mensaje;
    }
}

function limpiarErrores(formulario) {
    formulario.querySelectorAll("input").forEach(function (input) {
        input.classList.remove("is-invalid");
    });
}

// ----- Manejo de Usuarios en localStorage -----
function obtenerUsuariosRegistrados() {
    let usuarios = localStorage.getItem("usuarios_registrados");
    return usuarios ? JSON.parse(usuarios) : [];
}

function guardarUsuario(correo, password) {
    let usuarios = obtenerUsuariosRegistrados();
    // "correo" en minúsculas sirve para buscar; "correoOriginal" guarda el texto tal cual se escribió
    usuarios.push({ correo: correo.toLowerCase(), correoOriginal: correo, password: password });
    localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
}

function buscarUsuario(correo) {
    let usuarios = obtenerUsuariosRegistrados();
    return usuarios.find(u => u.correo === correo.toLowerCase());
}

// Guarda la sesión activa en sessionStorage para que la lea index.html
function iniciarSesion(nombre, correo) {
    sessionStorage.setItem("usuarioNombre", nombre);
    sessionStorage.setItem("usuarioCorreo", correo);
    window.location.href = "index.html";
}

// ----- Validaciones Generales -----
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
        mostrarError(input, "Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo.");
        return false;
    }
    return true;
}

// ----- EVENTO: Iniciar Sesión -----
formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores(formLogin);

    let correoValido = validarCampoCorreo(inputCorreo);
    let passwordValido = validarCampoPassword(inputPassword);
    if (!correoValido || !passwordValido) return;

    let correo = inputCorreo.value.trim();
    let password = inputPassword.value;

    let usuarioEncontrado = buscarUsuario(correo);

    if (!usuarioEncontrado) {
        mostrarError(inputCorreo, "Este correo no está registrado.");
        return;
    }

    if (usuarioEncontrado.password !== password) {
        mostrarError(inputPassword, "Contraseña incorrecta.");
        return;
    }

    // Inicio de sesión exitoso: se muestra el nombre de usuario tal cual se capturó;
    // si no tiene nombre, se muestra el correo tal cual se escribió
    let nombreParaNavbar = usuarioEncontrado.nombre || correo;
    iniciarSesion(nombreParaNavbar, correo);
});

// ----- EVENTO: Crear Cuenta (Registro Local) -----
formRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores(formRegistro);

    let correoValido = validarCampoCorreo(inputRegCorreo);
    let passwordValido = validarCampoPassword(inputRegPassword);
    if (!correoValido || !passwordValido) return;

    let correo = inputRegCorreo.value.trim();
    let password = inputRegPassword.value;

    if (buscarUsuario(correo)) {
        mostrarError(inputRegCorreo, "Este correo ya se encuentra registrado.");
        return;
    }

    // Guarda el nuevo usuario en localStorage
    guardarUsuario(correo, password);

    // Inicia sesión automáticamente tras registrarse (el navbar muestra el correo tal cual)
    iniciarSesion(correo, correo);
});