/**
 * utileria.js
 * Librería de validaciones y utilidades en JavaScript puro (sin frameworks).
 * Se carga con: <script src="js/utileria.js"></script>
 *
 * Funciones obligatorias:
 *   validarCorreo, soloLetras, validarLongitud,
 *   calcularEdad, esMayorDeEdad, validarPassword
 * Funciones propias:
 *   capitalizarNombre, diasParaCumple
 */

/* ---------- Helper interno (no forma parte de la API pública) ---------- */

/**
 * Convierte una fecha a objeto Date a las 00:00 hora local.
 * Acepta un Date o un string "YYYY-MM-DD" (formato de <input type="date">).
 * Se evita new Date("YYYY-MM-DD") porque lo interpreta en UTC y puede
 * mostrar un día menos según la zona horaria.
 * @param {Date|string} fecha
 * @returns {Date|null} Date válido o null si la fecha no es válida.
 */
function _parsearFecha(fecha) {
  if (fecha instanceof Date) {
    return isNaN(fecha.getTime())
      ? null
      : new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }
  if (typeof fecha !== "string") return null;

  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha.trim());
  if (!m) return null;

  var anio = Number(m[1]);
  var mes = Number(m[2]) - 1;
  var dia = Number(m[3]);
  var d = new Date(anio, mes, dia);

  // Rechaza fechas imposibles como 2024-02-31
  if (d.getFullYear() !== anio || d.getMonth() !== mes || d.getDate() !== dia) {
    return null;
  }
  return d;
}

/* ---------------------- FUNCIONES OBLIGATORIAS ---------------------- */

/**
 * Valida el formato de un correo electrónico.
 * Requiere: usuario, "@", dominio y una extensión de al menos 2 letras.
 * @param {string} correo - Correo a validar.
 * @returns {boolean} true si el formato es válido.
 * @example
 * validarCorreo("ana@correo.com");  // true
 * validarCorreo("ana@correo");      // false
 */
function validarCorreo(correo) {
  if (typeof correo !== "string") return false;
  var regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return regex.test(correo.trim());
}

/**
 * Verifica que el texto contenga solo letras (mayúsculas o minúsculas).
 * Acepta vocales acentuadas (á é í ó ú), además de ñ y ü.
 * No acepta espacios, números ni símbolos.
 * @param {string} texto - Texto a validar.
 * @returns {boolean} true si todos los caracteres son letras.
 * @example
 * soloLetras("María");   // true
 * soloLetras("Ana123");  // false
 */
function soloLetras(texto) {
  if (typeof texto !== "string") return false;
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(texto);
}

/**
 * Valida que un número no tenga más dígitos que el máximo permitido.
 * Solo cuenta números enteros; el signo negativo no cuenta como dígito.
 * @param {number|string} numero - Número a validar (también acepta string numérico).
 * @param {number} maxLongitud - Cantidad máxima de dígitos (entero positivo).
 * @returns {boolean} true si tiene entre 1 y maxLongitud dígitos.
 * @example
 * validarLongitud(5512345678, 10);  // true  (10 dígitos)
 * validarLongitud(123456, 4);       // false (6 dígitos)
 */
function validarLongitud(numero, maxLongitud) {
  if (!Number.isInteger(maxLongitud) || maxLongitud < 1) return false;
  if (typeof numero !== "number" && typeof numero !== "string") return false;

  var texto = String(numero).trim();
  if (!/^-?\d+$/.test(texto)) return false;

  var digitos = texto.replace("-", "").length;
  return digitos <= maxLongitud;
}

/**
 * Calcula la edad en años cumplidos a partir de la fecha de nacimiento.
 * @param {Date|string} fechaNacimiento - Date o string "YYYY-MM-DD".
 * @returns {number} Edad como entero. Devuelve -1 si la fecha no es válida
 *                   o está en el futuro.
 * @example
 * calcularEdad("2000-05-20");  // 26 (si hoy es 23/09/2026)
 * calcularEdad("2999-01-01");  // -1
 */
function calcularEdad(fechaNacimiento) {
  var nacimiento = _parsearFecha(fechaNacimiento);
  if (!nacimiento) return -1;

  var hoy = new Date();
  hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (nacimiento > hoy) return -1;

  var edad = hoy.getFullYear() - nacimiento.getFullYear();
  var yaCumplio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate());
  if (!yaCumplio) edad--;

  return edad;
}

/**
 * Indica si la persona tiene 18 años o más.
 * @param {Date|string} fechaNacimiento - Date o string "YYYY-MM-DD".
 * @returns {boolean} true si es mayor de edad; false si es menor o la fecha es inválida.
 * @example
 * esMayorDeEdad("2000-05-20");  // true
 * esMayorDeEdad("2015-01-01");  // false
 */
function esMayorDeEdad(fechaNacimiento) {
  return calcularEdad(fechaNacimiento) >= 18;
}

/**
 * Valida una contraseña segura. Debe tener:
 * mínimo 8 caracteres, una mayúscula, una minúscula, un número
 * y un carácter especial (cualquier símbolo que no sea letra ni número).
 * @param {string} password - Contraseña a validar.
 * @returns {boolean} true si cumple todos los requisitos.
 * @example
 * validarPassword("Segura#2026");  // true
 * validarPassword("password");     // false
 */
function validarPassword(password) {
  if (typeof password !== "string") return false;
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password)
  );
}

/* ---------------------------- SECCIÓN LIBRE ---------------------------- */

/**
 * Da formato de nombre propio a un texto: quita espacios sobrantes,
 * pone la primera letra de cada palabra en mayúscula y deja en minúscula
 * las partículas "de", "del", "la", "las", "los", "y" (salvo al inicio).
 * Resuelve el problema de nombres capturados como "  jUAN pérez  ".
 * @param {string} texto - Nombre a formatear.
 * @returns {string} Nombre formateado. Devuelve "" si no es un string.
 * @example
 * capitalizarNombre("  mARÍA de LOS ángeles  ");  // "María de los Ángeles"
 * capitalizarNombre("juan pérez");                // "Juan Pérez"
 */
function capitalizarNombre(texto) {
  if (typeof texto !== "string") return "";
  var particulas = ["de", "del", "la", "las", "los", "y"];

  return texto
    .trim()
    .split(/\s+/)
    .filter(function (p) { return p.length > 0; })
    .map(function (palabra, i) {
      var minus = palabra.toLowerCase();
      if (i > 0 && particulas.indexOf(minus) !== -1) return minus;
      return minus.charAt(0).toUpperCase() + minus.slice(1);
    })
    .join(" ");
}

/**
 * Calcula cuántos días faltan para el próximo cumpleaños.
 * Devuelve 0 si hoy es el cumpleaños. Quien nació un 29 de febrero
 * celebra el 1 de marzo en los años no bisiestos.
 * @param {Date|string} fechaNacimiento - Date o string "YYYY-MM-DD".
 * @returns {number} Días restantes (entero >= 0). Devuelve -1 si la fecha no es válida
 *                   o está en el futuro.
 * @example
 * diasParaCumple("2000-12-25");  // p. ej. 93 (si hoy es 23/09/2026)
 */
function diasParaCumple(fechaNacimiento) {
  var nacimiento = _parsearFecha(fechaNacimiento);
  if (!nacimiento) return -1;

  var hoy = new Date();
  hoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (nacimiento > hoy) return -1;

  var proximo = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
  if (proximo < hoy) {
    proximo = new Date(hoy.getFullYear() + 1, nacimiento.getMonth(), nacimiento.getDate());
  }

  return Math.round((proximo - hoy) / 86400000);
}

/* Permite probar la librería con Node.js (no afecta al navegador) */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarCorreo: validarCorreo,
    soloLetras: soloLetras,
    validarLongitud: validarLongitud,
    calcularEdad: calcularEdad,
    esMayorDeEdad: esMayorDeEdad,
    validarPassword: validarPassword,
    capitalizarNombre: capitalizarNombre,
    diasParaCumple: diasParaCumple
  };
}
